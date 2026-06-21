import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  createEvent,
  updateEvent,
  bookEvent,
  getAllEvents,
  getOneEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", verifyJWT, getAllEvents);
router.get("/:id", verifyJWT, getOneEvent);
router.post("/create-event", verifyJWT, requireRole("ORGANIZER"), createEvent);
router.put("/:id", verifyJWT, requireRole("ORGANIZER"), updateEvent);
router.post("/:id/book", verifyJWT, requireRole("CUSTOMER"), bookEvent);

export default router;