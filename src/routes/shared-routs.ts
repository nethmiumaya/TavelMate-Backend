import express from 'express';
import { shareItinerary, viewSharedItinerary } from '../controllers/itineraryController';
import { authenticateUser } from "../middleware/itineraryMiddleware";

const router = express.Router();

router.post("/:id/share", authenticateUser, shareItinerary);
router.get("/shared/:sharedLink", viewSharedItinerary);

export default router;