import express from "express";
import protect from "../utils/verifyAdmin.js";
import {
  getHospital,
  login,
  logout,
  updateHospital,
} from "../controllers/Hospital.js";
const router = express.Router();
router.get("/", getHospital);
router.put("/:id", updateHospital);
router.post("/login", login);
router.post("/logout/:id/", logout);
export default router;
