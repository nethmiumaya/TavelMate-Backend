import express from "express";
import {
    createItinerary,
    updateItinerary,
    deleteItinerary,
    getItinerary,
    getAllItineraries
} from "../controllers/itineraryController";
import { authenticateUser, authorizeItineraryOwner } from "../middleware/itineraryMiddleware";

const router = express.Router();

router.post("/", authenticateUser, createItinerary);
router.get("/", authenticateUser, getAllItineraries);
router.get("/:itineraryId", authenticateUser, authorizeItineraryOwner, getItinerary);
router.put("/:itineraryId", authenticateUser, authorizeItineraryOwner, updateItinerary);
router.delete("/:itineraryId", authenticateUser, authorizeItineraryOwner, deleteItinerary);

export default router;