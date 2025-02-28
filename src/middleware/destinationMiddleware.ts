import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export interface AuthRequest extends Request {
    user?: { id: number };
}

export const authorizeDestinationOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const destinationId = Number(req.params.destinationId);
    const userId = req.user?.id;

    const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
        include: { itinerary: true },
    });

    if (!destination) {
        res.status(404).json({ message: "Destination not found" });
        return;
    }

    if (destination.itinerary.userId !== userId) {
        res.status(403).json({ message: "Forbidden: You do not own this itinerary" });
        return;
    }

    next();
};