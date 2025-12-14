require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Member = require("../models/memberModel");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete previous data (Dev only)
    await User.deleteMany({});
    await Member.deleteMany({});
    console.log("🗑️  Cleared existing users & members");

    // Create admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@gym.com",
      password: "admin123",
      role: "admin"
    });

    const staff = await User.create({
      name: "Staff Member",
      email: "staff@gym.com",
      password: "staff123",
      role: "staff"
    });

    console.log("👤 Admin & staff users created");

    const members = [
      {
        fullName: "John Doe",
        email: "john.doe@email.com",
        phone: "9876543210",
        address: "123 Main Street, New York",
        packageType: "premium",
        membershipStatus: "active",
        joinDate: new Date("2024-01-15"),
        expiryDate: new Date("2024-04-15"),
        createdBy: admin._id
      },
      {
        fullName: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "9876543211",
        address: "456 Park Avenue, Los Angeles",
        packageType: "elite",
        membershipStatus: "active",
        joinDate: new Date("2024-02-01"),
        expiryDate: new Date("2025-02-01"),
        createdBy: admin._id
      },
      {
        fullName: "Mike Johnson",
        email: "mike.j@email.com",
        phone: "9876543212",
        address: "789 Oak Road, Chicago",
        packageType: "basic",
        membershipStatus: "active",
        joinDate: new Date("2024-11-01"),
        expiryDate: new Date("2024-12-01"),
        createdBy: staff._id
      },
      {
        fullName: "Sarah Williams",
        email: "sarah.w@email.com",
        phone: "9876543213",
        address: "321 Elm Street, Miami",
        packageType: "premium",
        membershipStatus: "expired",
        joinDate: new Date("2024-06-01"),
        expiryDate: new Date("2024-09-01"),
        createdBy: admin._id
      },
      {
        fullName: "David Brown",
        email: "david.b@email.com",
        phone: "9876543214",
        address: "654 Pine Lane, Seattle",
        packageType: "trial",
        membershipStatus: "active",
        joinDate: new Date("2024-12-01"),
        expiryDate: new Date("2024-12-08"),
        createdBy: staff._id
      }
    ];

    await Member.insertMany(members);
    console.log("👥 Sample members added");

    console.log("\n🎉 Database Seeded Successfully!");
    console.log("\n🔑 Login Credentials:");
    console.log("Admin → admin@gym.com | admin123");
    console.log("Staff → staff@gym.com | staff123");

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
