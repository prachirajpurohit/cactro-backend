import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ event: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);