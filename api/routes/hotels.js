import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
  getHotelRooms,
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Create a new hotel
router.post("/", verifyAdmin, createHotel);

// Update an existing hotel
router.put("/:id", verifyAdmin, updateHotel);

// Delete a hotel by ID
router.delete("/:id", verifyAdmin, deleteHotel);

// Get a single hotel by ID
router.get("/find/:id", getHotel); // Removed the space here

// Get all hotels or filtered hotels
router.get("/", getHotels);

// Count hotels by city
router.get("/countByCity", countByCity);

// Count hotels by type
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
export default router;