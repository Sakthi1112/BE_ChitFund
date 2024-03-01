const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/formulaDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const formulaSchema = new mongoose.Schema({
  A: Number,
  B: Number,
  C: Number,
  D: Number,
  E: Number,
  F: Number,
  G: Number,
  finalAnswer: Number,
});

const Formula = mongoose.model("Formula", formulaSchema);

app.post("/api/formula", async (req, res) => {
  try {
    const { A, B, C, D, E, F, G, finalAnswer } = req.body;
    const formula = new Formula({ A, B, C, D, E, F, G, finalAnswer });
    await formula.save();
    res.status(201).json(formula);
  } catch (error) {
    console.error("Error saving formula:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
