import { Router } from "express";
import { body, param } from "express-validator";

import * as ctrl from "../controllers/markersController";

const router = Router();

router.use((req, _res, next) => {
  console.info(`[Markers API] ${req.method} ${req.originalUrl}`);
  next();
});

const idParam = param("id").isUUID().withMessage("Invalid ID");
const markerBody = [
  body("lng").isFloat({ min: -180, max: 180 }),
  body("lat").isFloat({ min: -90, max: 90 }),
  body("score").isInt({ min: 0, max: 5 }),
];

router.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

router.get("/", ctrl.listMarkers);
router.post("/", markerBody, ctrl.createNewMarker);
router.post("/batch", ctrl.importMarkersBulk);
router.patch("/:id", idParam, markerBody, ctrl.partiallyUpdateMarker);
router.delete("/", ctrl.clearAllMarkers);
router.delete("/:id", idParam, ctrl.removeMarkerById);

export default router;
