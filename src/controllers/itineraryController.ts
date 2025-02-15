import { Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, startDate, endDate,userId } = req.body;

        console.log(req.body);
        if (!userId) {
            console.log(userId);
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
    try {
        const itineraries = await prisma.itinerary.findMany();
        res.json(itineraries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching itineraries", error });
    }
};

export const updateItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itineraryId } = req.params;
        const { title, startDate, endDate } = req.body;

        console.log("Updating itinerary with ID:", itineraryId);

        const updatedItinerary = await prisma.itinerary.update({
            where: { id: Number(itineraryId) },
            data: { title, startDate, endDate },
        });

        res.json(updatedItinerary);
    } catch (error) {
        console.error("Error updating itinerary:", error);
        res.status(500).json({ message: "Error updating itinerary", error });
    }
};

export const getItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itineraryId } = req.params;
        console.log("Fetching itinerary with ID:", itineraryId);

        const itinerary = await prisma.itinerary.findUnique({
            where: { id: Number(itineraryId) },
        });

        if (!itinerary) {
            res.status(404).json({ message: "Itinerary not found" });
            return;
        }

        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ message: "Error fetching itinerary", error });
    }
};

export const deleteItinerary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itineraryId } = req.params;
        console.log("Deleting itinerary with ID:", itineraryId);

        await prisma.itinerary.delete({
            where: { id: Number(itineraryId) },
        });

        res.json({ message: "Itinerary deleted successfully" });
    } catch (error) {
        console.error("Error deleting itinerary:", error);
        res.status(500).json({ message: "Error deleting itinerary", error });
    }
};