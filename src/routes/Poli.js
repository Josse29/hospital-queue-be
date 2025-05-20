import express from "express";
import {
  createPoli,
  deletePoli,
  printPoliQueue,
  readPoli,
  readPoliQueue,
  readPoliQueueId,
  ringPoliQueue,
  updatePoli,
} from "../controllers/Poli.js";
import protect from "../utils/verifyAdmin.js";
const router = express.Router();
router.post("/", protect, createPoli);
router.get("/", readPoli);
router.get("/queue", readPoliQueue);
router.get("/:id", readPoliQueueId);
router.put("/:id", protect, updatePoli);
router.delete("/:id", protect, deletePoli);
router.put("/print-queue/:id", printPoliQueue);
router.put("/ring-queue/:id", protect, ringPoliQueue);
export default router;
