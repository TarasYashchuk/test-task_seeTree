import { Marker } from "../models/marker";

const store = new Map<string, Marker>();

export const listMarkers = (): Marker[] => Array.from(store.values());

export const createMarker = (marker: Marker): Marker => {
  console.log(
    `[Service] Creating marker ${marker.id} at (${marker.lng},${marker.lat})`
  );
  store.set(marker.id, marker);
  return marker;
};

export const updateMarker = (
  id: string,
  data: Partial<Omit<Marker, "id">>
): Marker | null => {
  const existing = store.get(id);
  if (!existing) {
    console.warn(`[Service] Tried to update non‑existent marker ${id}`);
    return null;
  }
  const updated = { ...existing, ...data };
  console.log(`[Service] Updated marker ${id}:`, data);
  store.set(id, updated);
  return updated;
};

export const deleteMarker = (id: string): boolean => {
  console.log(`[Service] Deleting marker ${id}`);
  return store.delete(id);
};

export const clearAllMarkers = (): void => {
  console.log("[Service] Clearing all markers");
  store.clear();
};

export const createMarkersBulk = (markers: Marker[]): Marker[] => {
  console.log(`[Service] Bulk importing ${markers.length} markers`);
  markers.forEach((m) => store.set(m.id, m));
  return Array.from(store.values());
};
