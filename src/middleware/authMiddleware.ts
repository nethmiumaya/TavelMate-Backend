import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
    user?: { id: number };
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        req.user = { id: user.id };
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error });
    }
};