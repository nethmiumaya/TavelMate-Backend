import express, { Request, Response } from "express";
import { signup, login } from "../controllers/authController";

const router = express.Router();

// Ensure signup and login match Express route handler expectations
router.post("/signup", async (req: Request, res: Response) => {
    await signup(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
    await login(req, res);
});

export default router;
