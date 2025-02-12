import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, destinationId } = req.body;

        if (!destinationId) {
            res.status(400).json({ message: "Destination ID is required" });
            return;
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                description,
                date: new Date(), // Set the current date and time
                destinationId
            },
        });

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: "Error creating activity", error });
    }
};

export const getActivityById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const activity = await prisma.activity.findUnique({
            where: { id: Number(id) },
        });

        if (!activity) {
            res.status(404).json({ message: "Activity not found" });
            return;
        }

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activity", error });
    }
};

export const getActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const activities = await prisma.activity.findMany();
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error });
    }
};

export const updateActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, date } = req.body;

        const updatedActivity = await prisma.activity.update({
            where: { id: Number(id) },
            data: { title, description, date: new Date(date) },
        });

        res.json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: "Error updating activity", error });
    }
};

export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.activity.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting activity", error });
    }
};