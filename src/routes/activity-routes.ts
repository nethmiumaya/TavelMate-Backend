import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import {checkActivityExists, checkDestinationExists, validateActivityData} from "../middleware/activityMiddleware";
import {
    createActivity,
    getActivityById,
    updateActivity,
    deleteActivity,
    getActivities
} from "../controllers/activityController";

const router = express.Router();

router.post("/", authenticateUser, validateActivityData, checkDestinationExists, createActivity);
router.get("/", authenticateUser, getActivities);
router.get("/:id", authenticateUser, checkActivityExists, getActivityById);
router.put("/:id", authenticateUser, validateActivityData, checkActivityExists, updateActivity);
router.delete("/:id", authenticateUser, checkActivityExists, deleteActivity);
export default router;
