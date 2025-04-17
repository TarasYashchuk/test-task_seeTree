import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import * as service from "../services/markersService";
import type { Marker } from "../models/marker";

export const listMarkers = (_req: Request, res: Response): void => {
  try {
    const markers = service.listMarkers();
    res.json(markers);
  } catch (err: any) {
    console.error("Error listing markers:", err);
    res
      .status(500)
      .json({ message: "Failed to retrieve markers", details: err.message });
  }
};

export const createNewMarker = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  try {
    const { lng, lat, score } = req.body as Partial<Marker>;
    const newMarker: Marker = { id: uuidv4(), lng, lat, score } as Marker;
    const created = service.createMarker(newMarker);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("Error creating marker:", err);
    res
      .status(500)
      .json({ message: "Failed to create marker", details: err.message });
  }
};

export const partiallyUpdateMarker = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  try {
    const { id } = req.params;
    const updated = service.updateMarker(id, req.body);
    if (!updated) {
      res.status(404).json({ message: `Marker with id ${id} not found` });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    console.error(`Error updating marker ${req.params.id}:`, err);
    res
      .status(500)
      .json({ message: "Failed to update marker", details: err.message });
  }
};

export const removeMarkerById = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { id } = req.params;
    const removed = service.deleteMarker(id);
    if (!removed) {
      res.status(404).json({ message: `Marker with id ${id} not found` });
      return;
    }
    res.status(204).send();
  } catch (err: any) {
    console.error(`Error deleting marker ${req.params.id}:`, err);
    res
      .status(500)
      .json({ message: "Failed to delete marker", details: err.message });
  }
};

export const clearAllMarkers = (_req: Request, res: Response): void => {
  try {
    service.clearAllMarkers();
    res.status(204).send();
  } catch (err: any) {
    console.error("Error clearing all markers:", err);
    res
      .status(500)
      .json({ message: "Failed to clear markers", details: err.message });
  }
};

export const importMarkersBulk = (req: Request, res: Response): void => {
  try {
    const arr = req.body as Marker[];
    if (!Array.isArray(arr)) {
      res.status(400).json({ message: "Expected an array of markers" });
      return;
    }
    const created = service.createMarkersBulk(arr);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("Error bulk importing markers:", err);
    res
      .status(500)
      .json({ message: "Failed to import markers", details: err.message });
  }
};
