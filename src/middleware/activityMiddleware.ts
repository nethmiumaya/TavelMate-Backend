import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

// Middleware to validate activity input data
export const validateActivityData = (req: Request, res: Response, next: NextFunction): void => {
    const { title, description, date, destinationId } = req.body;

    if (!title || !description || !date || !destinationId) {
        res.status(400).json({ message: "All fields (title, description, date, destinationId) are required" });
        return;
    }

    next();
};

// Middleware to check if destination exists before creating an activity
export const checkDestinationExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { destinationId } = req.body;

    try {
        const destination = await prisma.destination.findUnique({
            where: { id: Number(destinationId) },
        });

        if (!destination) {
            res.status(404).json({ message: "Destination not found" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Error checking destination", error });
    }
};

// Middleware to check if activity exists before updating or deleting
export const checkActivityExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const activity = await prisma.activity.findUnique({
            where: { id: Number(id) },
        });

        if (!activity) {
            res.status(404).json({ message: "Activity not found" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Error checking activity", error });
    }
};