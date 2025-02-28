import express, { Request, Response } from "express";
import {signup, login, getAllUsers} from "../controllers/authController";

const router = express.Router();

// Ensure signup and login match Express route handler expectations
router.post("/signup", async (req: Request, res: Response) => {
    await signup(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
    await login(req, res);
});

// Route to get all users
router.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

export default router;
