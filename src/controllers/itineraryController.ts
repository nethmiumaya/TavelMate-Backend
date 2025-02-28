import { Response, Request } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/authMiddleware";
import { generateSharedLink } from '../utils/generateSharedLink';
import { sendSharedLinkEmail } from '../utils/sendEmail';

export const createItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, startDate, endDate } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const itinerary = await prisma.itinerary.create({
            data: { title, startDate, endDate, userId },
        });

        res.status(201).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: "Error creating itinerary", error });
    }
};

export const getAllItineraries = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: user not authenticated" });
        return;
    }

    try {
        const itineraries = await prisma.itinerary.findMany({
            where: { userId: req.user.id },
        });
        res.json(itineraries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching itineraries", error });
    }
};



export const updateItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itineraryId } = req.params;
        const { title, startDate, endDate } = req.body;

        const updatedItinerary = await prisma.itinerary.update({
            where: { id: Number(itineraryId) },
            data: { title, startDate, endDate },
        });

        res.json(updatedItinerary);
    } catch (error) {
        res.status(500).json({ message: "Error updating itinerary", error });
    }
};

export const getItinerary = async (req: Request, res: Response): Promise<void> => {
    const { itineraryId } = req.params;

    try {
        const itinerary = await prisma.itinerary.findUnique({
            where: { id: Number(itineraryId) },
            include: {
                destinations: {
                    include: { activities: true },
                },
                user: true,
            },
        });

        if (!itinerary) {
            res.status(404).json({ message: 'Itinerary not found' });
            return;
        }

        res.json(itinerary);
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itineraryId } = req.params;

        // Delete related activities
        await prisma.activity.deleteMany({
            where: {
                destination: {
                    itineraryId: Number(itineraryId),
                },
            },
        });

        // Delete related destinations
        await prisma.destination.deleteMany({
            where: { itineraryId: Number(itineraryId) },
        });

        // Delete related shared itineraries
        await prisma.sharedItinerary.deleteMany({
            where: { itineraryId: Number(itineraryId) },
        });

        // Delete the itinerary
        await prisma.itinerary.delete({
            where: { id: Number(itineraryId) },
        });

        res.json({ message: "Itinerary deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting itinerary", error });
    }
};

export const shareItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { sharedWithEmail } = req.body;
    const userId = req.user?.id;

    try {
        const itinerary = await prisma.itinerary.findFirst({
            where: { id: parseInt(id), userId },
        });

        if (!itinerary) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        const sharedLink = generateSharedLink();

        await prisma.sharedItinerary.create({
            data: {
                itineraryId: parseInt(id),
                sharedWithEmail,
                sharedLink,
            },
        });

        if (sharedWithEmail) {
            await sendSharedLinkEmail(sharedWithEmail, sharedLink);
        }

        res.json({
            sharedLink: `${process.env.CLIENT_URL}/shared/${sharedLink}`
        });
    } catch (error) {
        console.error("Error sharing itinerary:", error);
        res.status(500).json({ error: 'Sharing failed' });
    }
};
export const viewSharedItinerary = async (req: Request, res: Response): Promise<void> => {
    const { sharedLink } = req.params;

    try {
        const sharedRecord = await prisma.sharedItinerary.findUnique({
            where: { sharedLink },
            include: {
                itinerary: {
                    include: {
                        destinations: {
                            include: { activities: true },
                        },
                        user: { select: { name: true } },
                    },
                },
            },
        });

        if (!sharedRecord) {
            console.error("Invalid link:", sharedLink);
            res.status(404).json({ error: 'Invalid link' });
            return;
        }

        res.json(sharedRecord.itinerary);
    } catch (error) {
        console.error("Error loading shared itinerary:", error);
        res.status(500).json({ error: 'Failed to load itinerary' });
    }
};