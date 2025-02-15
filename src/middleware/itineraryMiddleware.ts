import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../config/prisma";

dotenv.config();

export interface AuthRequest extends Request {
    user?: { id: number };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
        req.user = { id: decoded.userId };
        console.log(req.user);
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export const authorizeItineraryOwner = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const { itineraryId } = req.params;
    const userId = req.user?.id;
console.log(userId+"userId")
    if (!userId) {
        res.status(401).json({ message: "Unauthorized: No user ID found" });
        return;
    }

    try {
        const itinerary = await prisma.itinerary.findUnique({
            where: { id: Number(itineraryId) },
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
    } catch (error) {
        res.status(500).json({ message: "Error checking itinerary ownership", error });
    }
};