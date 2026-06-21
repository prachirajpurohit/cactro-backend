import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    availableTickets: {
      type: Number,
      required: true,
      min: 0,
    },

    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre("save", function (next) {
  if (this.availableTickets > this.totalTickets) {
    return next(new Error("Available tickets cannot exceed total tickets"));
  }
  next();
});

export const Event = mongoose.model("Event", eventSchema);