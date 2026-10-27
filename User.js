import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    studentId: { type: String, trim: true }, // optional roll no. / registration id
    department: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
