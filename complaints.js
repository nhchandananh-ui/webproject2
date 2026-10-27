import { Router } from "express";
import Complaint from "../models/Complaint.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// List complaints: students see only their own; admins see all
router.get("/", requireAuth, async (req, res) => {
  try {
    const { status, category, department } = req.query;
    const filter = {};

    if (req.user.role === "student") {
      filter.student = req.user.id;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (department) filter.department = department;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate("student", "name email studentId department");

    res.json(complaints);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch complaints",
      error: err.message,
    });
  }
});

// Get one complaint: owner or admin
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "student",
      "name email studentId department"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(complaint.student._id) !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized to view this complaint",
      });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch complaint",
      error: err.message,
    });
  }
});

// Create a complaint (student), with optional image
router.post(
  "/",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, category, location } = req.body;

      if (!title || !description || !location) {
        return res.status(400).json({
          message: "Title, description and location are required",
        });
      }

      const complaint = await Complaint.create({
        student: req.user.id,
        title,
        description,
        category,
        location,
        imagePath: req.file
          ? `/ uploads / ${req.file.filename} `
          : undefined,
      });

      res.status(201).json(complaint);
    } catch (err) {
      res.status(500).json({
        message: "Failed to create complaint",
        error: err.message,
      });
    }
  }
);

// Admin-only update: status, department, admin note, and priority
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, department, adminNotes, priority } = req.body;
    const update = {};

    if (status !== undefined) update.status = status;
    if (department !== undefined) update.department = department;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    if (priority !== undefined) {
      if (!["High", "Medium", "Low"].includes(priority)) {
        return res.status(400).json({
          message: "Priority must be High, Medium, or Low",
        });
      }

      update.priority = priority;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
        runValidators: true,
      }
    ).populate("student", "name email studentId department");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update complaint",
      error: err.message,
    });
  }
});

export default router;
