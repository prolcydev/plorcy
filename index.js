const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const path = require("path");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// CREATE user
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

    res.status(500).json({
      error: error.message,
    });
  }
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});