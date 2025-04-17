import axios from 'axios';
import type { Marker } from '@/types';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  headers: {
    'Ngrok-Skip-Browser-Warning': '1',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      toast.warn('Too many requests, please try again in a minute.', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
    return Promise.reject(error);
  },
);

export const fetchMarkers = async (): Promise<Marker[]> => {
  const { data } = await api.get<Marker[]>('/markers');
  return data;
};

export const createMarker = async (m: Marker): Promise<Marker> => {
  const { data } = await api.post<Marker>('/markers', m);
  return data;
};

export const importMarkersBulk = async (markers: Marker[]): Promise<Marker[]> => {
  const { data } = await api.post<Marker[]>('/markers/batch', markers);
  return data;
};

export const updateMarker = async (
  id: string,
  payload: Partial<Omit<Marker, 'id'>>,
): Promise<Marker> => {
  const { data } = await api.patch<Marker>(`/markers/${id}`, payload);
  return data;
};

export const deleteMarker = async (id: string): Promise<void> => {
  await api.delete(`/markers/${id}`);
};

export const deleteAllMarkers = async (): Promise<void> => {
  await api.delete('/markers');
};
