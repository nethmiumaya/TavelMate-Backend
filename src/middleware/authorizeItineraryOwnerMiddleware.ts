import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "./authMiddleware";

export const authorizeItineraryOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const itineraryId = Number(req.params.itineraryId);
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized: No user ID found" });
        return;
    }

    const itinerary = await prisma.itinerary.findUnique({
        where: { id: itineraryId },
    });

    if (!itinerary) {
        res.status(404).json({ message: "Itinerary not found" });
        return;
    }

    if (itinerary.userId !== userId) {
        res.status(403).json({ message: "Forbidden: You do not own this itinerary" });
        return;
    }

    next();
};