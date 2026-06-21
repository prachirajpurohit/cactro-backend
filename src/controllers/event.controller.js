import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Event } from "../models/event.model.js";
import { Booking } from "../models/booking.model.js";

// --- CREATE EVENT (ORGANIZER only) ---
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, totalTickets } = req.body;
  if (!title || !description || !date || !totalTickets)
    throw new ApiError(400, "All fields are required");

  const event = await Event.create({
    title,
    description,
    date,
    totalTickets,
    availableTickets: totalTickets,
    organizer: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, event, "Event created successfully"));
});

// --- UPDATE EVENT (ORGANIZER only, triggers background task #2) ---
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {title, description, date, totalTickets} = req.body;

  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, "Event not found");
  if (event.organizer.toString() !== req.user.id)
    throw new ApiError(403, "You can only update your own events");

  Object.assign(event, { title, description, date, totalTickets });
  await event.save();

  // Background Task #2: Notify customers (console log)
  setTimeout( async () => {
    const bookings = await Booking.find({ event: event._id });
    bookings.forEach(booking => {
    console.log(`Background Task: Notified customer ${booking.customer} about update to "${event.title}"`);
    });
    }, 0);

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event updated successfully"));
});

// --- BOOK TICKETS (CUSTOMER only, triggers background task #1) ---
const bookEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity < 1) throw new ApiError(400, "Invalid quantity");

  const event = await Event.findOneAndUpdate(
    {_id: id, availableTickets: { $gte: quantity}},
    {$inc: {availableTickets: -quantity}},
    {new: true}
  );

  if(!event) {
    throw new ApiError(400, "Event not found or not enough tickets")
  }

  const booking = await Booking.create({
    event: event._id,
    customer: req.user.id,
    quantity,
    status: "CONFIRMED",
  });

  // Background Task #1: Booking confirmation (console log)
  setTimeout(() => {
    console.log(
      `Background Task: Booking confirmation sent for user ${req.user.id} for event "${event.title}"`
    );
  }, 0);

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking successful"));
});

const getAllEvents = asyncHandler(async (req,res)=> {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const events = await Event.find().skip(skip).limit(limit);
    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);
    return res.status(200).json(new ApiResponse(200, {events, totalEvents, totalPages}, "Events fetched successfully"));
});

const getOneEvent = asyncHandler(async (req,res)=> {
    const {id} = req.params;
    const event = await Event.findById(id);
    if(!event) {
        throw new ApiError(404, "Event not found")
    }
    return res.status(200).json(new ApiResponse(200, event, "Event fetched successfully"));
});

export { createEvent, updateEvent, bookEvent, getAllEvents, getOneEvent };