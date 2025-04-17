import React, { useMemo } from 'react';
import { useMarkers } from '@/hooks/useMarkers';
import styles from './StatsPanel.module.css';
import type { Marker } from '@/types';

const StatsPanel: React.FC = () => {
  const { markersQuery } = useMarkers();
  const data = markersQuery.data || [];

  const counts = useMemo(() => {
    const c: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach((m: Marker) => {
      c[m.score] += 1;
    });
    return c;
  }, [data]);

  return (
    <div
      className={styles.container}
      role="region"
      aria-live="polite"
      aria-label="Markers statistics"
    >
      <p className={styles.stat}>
        <strong>Total:</strong> {data.length}
      </p>
      {([5, 4, 3, 2, 1, 0] as const).map((s) => (
        <p key={s} className={styles.stat}>
          <strong>{['Zero', 'One', 'Two', 'Three', 'Four', 'Five'][s]}:</strong> {counts[s]}
        </p>
      ))}
    </div>
  );
};

export default StatsPanel;
