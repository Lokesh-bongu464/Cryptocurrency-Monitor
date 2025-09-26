import { Request, Response } from "express";
import Alert from "../models/Alert";

export const createAlert = async (req: Request, res: Response) => {
  try {
    const { userId, coinId, threshold, condition } = req.body;

    // Validate required fields
    if (!userId || !coinId || !threshold || !condition) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAlert = new Alert({
      userId,
      coinId,
      threshold,
      condition,
      isTriggered: false,
    });

    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: "Error creating alert", error });
  }
};

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const alerts = await Alert.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alerts", error });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await Alert.findOneAndDelete({ _id: id, userId });
    if (!result) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting alert", error });
  }
};
