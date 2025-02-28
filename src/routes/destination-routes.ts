import express from "express";
import { createDestination, updateDestination, deleteDestination, getDestination } from "../controllers/destinationController";
import {authenticateUser} from "../middleware/itineraryMiddleware";
import {authorizeDestinationOwner} from "../middleware/destinationMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createDestination);
router.get("/:destinationId", authenticateUser, authorizeDestinationOwner, getDestination);
router.put("/:destinationId", authenticateUser, authorizeDestinationOwner, updateDestination);
router.delete("/:destinationId", authenticateUser, authorizeDestinationOwner, deleteDestination);

export default router;
