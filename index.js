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

    // Handle duplicate email
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
   DELETE USER
========================= */
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* =========================
   FRONTEND ROUTES
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

/* =========================
   START SERVER (RENDER READY)
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});