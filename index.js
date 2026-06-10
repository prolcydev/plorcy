const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const path = require("path");

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   CREATE USER
========================= */
app.post("/users", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("USER CREATE ERROR:", error);

    // Handle duplicate email error
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
});

/* =========================
   GET ALL USERS
========================= */
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* =========================
   SERVE FRONTEND
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   START SERVER (RENDER SAFE)
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});