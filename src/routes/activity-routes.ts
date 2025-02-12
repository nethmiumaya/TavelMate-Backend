import express from "express";
import {authenticate} from "../middleware/authMiddleware";
import {checkActivityExists, checkDestinationExists, validateActivityData} from "../middleware/activityMiddleware";
import {
    createActivity,
    getActivityById,
    updateActivity,
    deleteActivity,
    getActivities
} from "../controllers/activityController";

const router = express.Router();

router.post("/", authenticate, validateActivityData, checkDestinationExists, createActivity);
router.get("/", authenticate, getActivities);
router.get("/:id", authenticate, checkActivityExists, getActivityById);
router.put("/:id", authenticate, validateActivityData, checkActivityExists, updateActivity);
router.delete("/:id", authenticate, checkActivityExists, deleteActivity);

export default router;
