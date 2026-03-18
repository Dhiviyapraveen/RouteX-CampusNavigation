import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    facilities: { type: [String], default: [] },
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: (arr) => Array.isArray(arr) && arr.length === 2,
          message: "geo.coordinates must be [lng, lat]",
        },
      },
    },
  },
  { timestamps: true },
);

LocationSchema.index({ geo: "2dsphere" });
LocationSchema.index({ name: "text", description: "text", facilities: "text" });
LocationSchema.index({ category: 1 });

LocationSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Location =
  mongoose.models.Location ?? mongoose.model("Location", LocationSchema);

