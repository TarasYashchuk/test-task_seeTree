import React, { useRef, useEffect, useCallback } from 'react';
import mapboxgl, { type MapMouseEvent, type Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarkers } from '@/hooks/useMarkers';
import { SCORE_COLORS } from '@/utils/colors';
import { toast } from 'react-toastify';
import type { Marker as MType } from '@/types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN!;

function createMarkerElement(color: string): HTMLElement {
  const el = document.createElement('div');
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.cursor = 'pointer';
  el.innerHTML = `
    <svg width="30" height="30" viewBox="0 0 24 24">
      <path 
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="${color}" stroke="black" stroke-width="2"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
  `;
  return el;
}

const MapView: React.FC = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const mapMarkers = useRef<Record<string, mapboxgl.Marker>>({});
  const { markersQuery, addMarker, changeMarker, removeMarker } = useMarkers();

  useEffect(() => {
    if (map.current || !container.current) return;
    map.current = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 2,
    });

    map.current.on('click', (e: MapMouseEvent) => {
      const [lng, lat] = e.lngLat.toArray();
      addMarker.mutate(
        { lng, lat, score: 0 },
        {
          onError: () => toast.error('Failed to add marker'),
          onSuccess: (m: MType) => {
            const el = createMarkerElement(SCORE_COLORS[0]);
            const mk = new mapboxgl.Marker({ element: el, draggable: true })
              .setLngLat([m.lng, m.lat])
              .addTo(map.current!);
            mapMarkers.current[m.id] = mk;
            bindMarker(m.id, mk);
          },
        },
      );
    });
  }, [addMarker]);

  useEffect(() => {
    if (!map.current || !markersQuery.data) return;
    Object.values(mapMarkers.current).forEach((mk) => mk.remove());
    mapMarkers.current = {};

    markersQuery.data.forEach((m) => {
      const el = createMarkerElement(SCORE_COLORS[m.score]);
      const mk = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat([m.lng, m.lat])
        .addTo(map.current!);
      mapMarkers.current[m.id] = mk;
      bindMarker(m.id, mk);
    });
  }, [markersQuery.data]);

  const bindMarker = useCallback(
    (id: string, marker: mapboxgl.Marker) => {
      let isDragging = false;

      marker.on('dragstart', () => {
        isDragging = true;
      });

      marker.on('dragend', () => {
        const [lng, lat] = marker.getLngLat().toArray();
        const current = markersQuery.data!.find((x) => x.id === id)!;
        changeMarker.mutate(
          { id, lng, lat, score: current.score },
          { onError: () => toast.error('Failed to move marker') },
        );
        setTimeout(() => (isDragging = false), 0);
      });

      const el = marker.getElement();
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (isDragging) {
          return;
        }

        const current = markersQuery.data!.find((x) => x.id === id)!;
        const action = window.prompt('Enter new score (0–5) or DELETE:');
        if (!action) return;

        if (action.toUpperCase() === 'DELETE') {
          removeMarker.mutate(id, {
            onSuccess: () => {
              marker.remove();
              delete mapMarkers.current[id];
              toast.success('Marker deleted');
            },
            onError: () => toast.error('Failed to delete marker'),
          });
        } else {
          const s = Number(action);
          if (isNaN(s) || s < 0 || s > 5) {
            return toast.error('Invalid score');
          }
          changeMarker.mutate(
            { id, lng: current.lng, lat: current.lat, score: s },
            {
              onSuccess: () => {
                const newEl = createMarkerElement(SCORE_COLORS[s]);
                const newMk = new mapboxgl.Marker({ element: newEl, draggable: true })
                  .setLngLat(marker.getLngLat())
                  .addTo(map.current!);
                marker.remove();
                mapMarkers.current[id] = newMk;
                bindMarker(id, newMk);
                toast.success(`Score updated to ${s}`);
              },
              onError: () => toast.error('Failed to update score'),
            },
          );
        }
      });
    },
    [changeMarker, markersQuery.data, removeMarker],
  );

  if (markersQuery.isLoading) return <p>Loading map...</p>;
  if (markersQuery.error) return <p>Error loading markers</p>;

  return (
    <div
      ref={container}
      style={{ width: '100%', height: '100%' }}
      role="application"
      aria-label="Map with markers"
    />
  );
};

export default React.memo(MapView);
