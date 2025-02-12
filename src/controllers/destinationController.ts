import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../config/prisma";

export const createDestination = async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, location } = req.body;
    const userId = req.user?.id;

    if (typeof userId !== 'number') {
        res.status(400).json({ message: "User ID must be a number" });
        return;
    }

    try {
        const newDestination = await prisma.destination.create({
            data: {
                name,
                location,
                userId,
            },
        });
        res.status(201).json(newDestination);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getDestinations = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        const destinations = await prisma.destination.findMany({
            where: { userId },
            include: { activities: true },
        });
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getDestinationById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const destination = await prisma.destination.findFirst({
            where: { id: Number(id), userId },
            include: { activities: true },
        });

        if (!destination) {
            res.status(404).json({ message: "Destination not found" });
            return;
        }

        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateDestination = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, location } = req.body;

    try {
        const updatedDestination = await prisma.destination.update({
            where: { id: Number(id) },
            data: { name, location },
        });

        res.status(200).json(updatedDestination);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteDestination = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await prisma.destination.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};