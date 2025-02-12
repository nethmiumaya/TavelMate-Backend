import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import prisma from "../config/prisma";

export const validateDestinationOwnership = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const destination = await prisma.destination.findUnique({
            where: { id: Number(id) },
        });

        if (!destination) {
            res.status(404).json({ message: "Destination not found" });
            return;
        }

        console.log(`Authenticated user ID: ${userId}`);
        console.log(`Destination user ID: ${destination.userId}`);

        if (destination.userId !== userId) {
            res.status(403).json({ message: "Not authorized" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};