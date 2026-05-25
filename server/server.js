console.log("🔥 NEW SERVER FILE RUNNING");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());




// ✅ LOCAL MONGODB (NO ENV)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// MODELS
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
}));

const Expense = mongoose.model("Expense", new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  userId: mongoose.Schema.Types.ObjectId,
}));

// AUTH
const auth = (req, res, next) => {

  try {

    const token = req.headers.authorization;

    console.log("TOKEN RECEIVED:", token);

    if (!token) {

      return res.status(401).json({
        message: "No token",
      });
    }

    const decoded = jwt.verify(
      token,
      "secret123"
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.log("AUTH ERROR:", err);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {

  try {

    console.log(req.body);

    const { name, phone, password } = req.body;

    // ✅ check existing user
    const existing = await User.findOne({ phone });

    if (existing) {
      return res.json({
        message: "User already exists",
      });
    }

    // ✅ hash password
    const hash = await bcrypt.hash(password, 10);

    // ✅ create user
    const user = new User({
      name,
      phone,
      password: hash,
    });

    await user.save();

    res.json({
      message: "Signup success",
    });

  } catch (err) {

    console.log("SIGNUP ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// LOGIN
app.post("/api/auth/login", async (req, res) => {

  try {

    console.log("LOGIN BODY:", req.body);

    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.json({
        message: "User not found",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", ok);

    if (!ok) {
      return res.json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret123"
    );

    console.log("TOKEN CREATED");

    res.json({
      token,
      user,
    });

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// EXPENSES
app.get("/api/expenses", auth, async (req, res) => {
  const data = await Expense.find({ userId: req.user.id });
  res.json(data);
});

app.post("/api/expenses", auth, async (req, res) => {

  try {

    const { title, amount, category } = req.body;

    console.log("BODY:", req.body);

    // ✅ VALIDATION
    if (!title || !amount) {

      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const exp = new Expense({

      title: title,

      amount: Number(amount),

      category: category || "General",

      userId: req.user.id,
    });

    await exp.save();

    console.log("SAVED:", exp);

    // ✅ RETURN FULL OBJECT
    res.json(exp);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

app.delete("/api/expenses/:id", auth, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// AI (SAFE)
app.post("/api/ai/chat", auth, async (req, res) => {
  const { message } = req.body;

  res.json({
    reply: "💡 Smart suggestion: Avoid unnecessary expenses. You asked: " + message,
  });
});

// TEST
app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);;