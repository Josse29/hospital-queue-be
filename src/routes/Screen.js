import express from "express";
import protect from "../utils/verifyAdmin.js";
import {
  createScreen,
  deleteScreen,
  readScreen,
  readScreenId,
  readScreenId1,
  updateScreen,
} from "../controllers/Screen.js";
const router = express.Router();
router.post("/", protect, createScreen);
router.get("/", readScreen);
router.get("/:id", readScreenId);
router.get("/queue/:id", readScreenId1);
router.put("/:id", protect, updateScreen);
router.delete("/:id", protect, deleteScreen);
export default router;
