// Controlled way to provision an admin account.
// Public registration always creates "student" accounts — this script is the
// only supported way to create an "admin" account, and it must be run
// directly on the server (never exposed as an API route).
//
// Usage:
//   1. Set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD in server/.env
//   2. From the server/ folder run: npm run create-admin

import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

async function run() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error("Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    existing.name = name;
    existing.passwordHash = await bcrypt.hash(password, 12);
    await existing.save();
    console.log(`Existing user ${email} promoted to admin.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ name, email: email.toLowerCase(), passwordHash, role: "admin" });
    console.log(`Admin account created for ${email}.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
