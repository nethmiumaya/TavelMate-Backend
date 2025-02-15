import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createDestination = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itineraryId, name, location, latitude, longitude } = req.body;
        const userId = req.user?.id;

        console.log("Creating destination for itinerary ID:", itineraryId);

        const itinerary = await prisma.itinerary.findUnique({ where: { id: itineraryId } });
        if (!itinerary || itinerary.userId !== userId) {
            res.status(403).json({ message: "You do not own this itinerary" });
            return;
        }

        const destination = await prisma.destination.create({
            data: { itineraryId, name, location, latitude, longitude },
        });

        res.status(201).json(destination);
    } catch (error) {
        console.error("Error creating destination:", error);
        res.status(500).json({ message: "Error creating destination", error });
    }
};

export const getDestination = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const destinationId = Number(req.params.destinationId);

        const destination = await prisma.destination.findUnique({
            where: { id: destinationId },
            include: { activities: true },
        });

        if (!destination) {
            res.status(404).json({ message: "Destination not found" });
            return;
        }

        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: "Error fetching destination", error });
    }
};

export const updateDestination = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const destinationId = Number(req.params.destinationId);
        const { name, location, latitude, longitude } = req.body;

        const updatedDestination = await prisma.destination.update({
            where: { id: destinationId },
            data: { name, location, latitude, longitude },
        });

        res.json(updatedDestination);
    } catch (error) {
        res.status(500).json({ message: "Error updating destination", error });
    }
};

export const deleteDestination = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const destinationId = Number(req.params.destinationId);

        await prisma.destination.delete({ where: { id: destinationId } });

        res.json({ message: "Destination deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting destination", error });
    }
};