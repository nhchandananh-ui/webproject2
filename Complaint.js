import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Hostel", "Academics", "Infrastructure", "Canteen", "IT/Network", "Other"],
      default: "Other",
    },
    location: { type: String, trim: true, required: true },
    department: {
      type: String,
      enum: [
        "Unassigned",
        "Hostel",
        "Academics",
        "Infrastructure",
        "Canteen",
        "IT/Network",
        "Other"
      ],
      default: "Unassigned"
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    imagePath: { type: String }, // relative path under /uploads

  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
