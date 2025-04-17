import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import * as api from '@/api/markers';
import type { Marker } from '@/types';

export const useMarkers = () => {
  const qc = useQueryClient();

  const markersQuery = useQuery<Marker[], Error>({
    queryKey: ['markers'],
    queryFn: api.fetchMarkers,
  });

  const addMarker = useMutation<Marker, Error, Omit<Marker, 'id'>>({
    mutationFn: (payload) => api.createMarker({ id: uuidv4(), ...payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['markers'] }),
    retry: false,
  });

  const changeMarker = useMutation<Marker, Error, Marker>({
    mutationFn: (m) =>
      api.updateMarker(m.id, {
        lng: m.lng,
        lat: m.lat,
        score: m.score,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['markers'] });
    },
  });

  const removeMarker = useMutation<void, Error, string>({
    mutationFn: (id) => api.deleteMarker(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['markers'] });
    },
  });

  const clearAll = useMutation<void, Error>({
    mutationFn: () => api.deleteAllMarkers(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['markers'] });
    },
  });

  const importBulk = useMutation<Marker[], Error, Marker[]>({
    mutationFn: (arr) => api.importMarkersBulk(arr),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['markers'] }),
  });

  return { markersQuery, addMarker, changeMarker, removeMarker, clearAll, importBulk };
};
