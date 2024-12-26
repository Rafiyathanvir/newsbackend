import express from "express";
import mongoose from "mongoose";
import TourModal from "../models/tour.js";

const router = express.Router();

/** Create a new tour */
export const createTour = async (req, res) => {
  const tour = req.body;

  const newTour = new TourModal({
    ...tour,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Get all tours with pagination */
export const getTours = async (req, res) => {
  const { page } = req.query;

  try {
    const limit = 6;
    const startIndex = (Number(page) - 1) * limit;
    const total = await TourModal.countDocuments({});
    const tours = await TourModal.find().limit(limit).skip(startIndex);

    res.json({
      data: tours,
      currentPage: Number(page),
      totalTours: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Get a single tour by ID */
export const getTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await TourModal.findById(id);

    if (!tour) return res.status(404).json({ message: "Tour not found" });

    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Get tours created by a specific user */
export const getToursByUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "User doesn't exist" });

  try {
    const userTours = await TourModal.find({ creator: id });
    res.status(200).json(userTours);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Delete a tour by ID */
export const deleteTour = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No tour exists with that ID" });

  try {
    await TourModal.findByIdAndRemove(id);
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Update a tour */
export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, creator, imageFile, tags, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No tour exists with that ID" });

  try {
    const updatedTour = {
      title,
      description,
      creator,
      imageFile,
      tags,
      category,
      _id: id,
    };

    const result = await TourModal.findByIdAndUpdate(id, updatedTour, {
      new: true,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Search tours by title */
export const getToursBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");
    const tours = await TourModal.find({ title });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Fetch tours by tag */
export const getToursByTag = async (req, res) => {
  const { tag } = req.params;

  try {
    const tours = await TourModal.find({ tags: { $in: tag } });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Fetch related tours by tags */
export const getRelatedTours = async (req, res) => {
  const tags = req.body;

  try {
    const tours = await TourModal.find({ tags: { $in: tags } });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/** Like or unlike a tour */
export const likeTour = async (req, res) => {
  const { id } = req.params;

  if (!req.userId)
    return res.status(401).json({ message: "User is not authenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "No tour exists with that ID" });

  try {
    const tour = await TourModal.findById(id);

    const index = tour.likes.findIndex((userId) => userId === String(req.userId));

    if (index === -1) {
      tour.likes.push(req.userId); // Like the tour
    } else {
      tour.likes = tour.likes.filter((userId) => userId !== String(req.userId)); // Unlike the tour
    }

    const updatedTour = await TourModal.findByIdAndUpdate(id, tour, {
      new: true,
    });
    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Fetch tours by category */
export const getToursByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const tours = await TourModal.find({ category });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default router;
