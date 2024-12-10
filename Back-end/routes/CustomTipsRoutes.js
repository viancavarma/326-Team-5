import express from "express";
import tipsModel from "../models/SQLiteTipsModel.js";

const router = express.Router();

// get three random tips
router.get("/", async (req, res) => {
  try {
    const tips = await tipsModel.readRandom(3); // Fetch 3 random tips
    res.json(tips);
  } catch (error) {
    console.error("Error fetching random tips:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// add a new tip
router.post("/", async (req, res) => {
  try {
    console.log("Request body received:", req.body); // Debugging log
    const { tip } = req.body;

    if (!tip) {
      return res.status(400).json({ message: "Tip content is required" });
    }

    const newTip = await tipsModel.create({ tip });
    res.status(201).json(newTip);
  } catch (error) {
    console.error("Error adding tip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete all tips
router.delete("/", async (req, res) => {
  try {
    await tipsModel.delete();
    res.json({ message: "All tips have been deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;