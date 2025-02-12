import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { validateDestinationOwnership } from "../middleware/destinationMiddleware";
import {
    createDestination,
    getDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination,
} from "../controllers/destinationController";

const router = express.Router();

// Routes for destination CRUD operations
router.post("/", authenticate, createDestination);
router.get("/", authenticate, getDestinations);
router.get("/:id", authenticate, getDestinationById);
router.put("/:id", authenticate, validateDestinationOwnership, updateDestination);
router.delete("/:id", authenticate, validateDestinationOwnership, deleteDestination);

export default router;