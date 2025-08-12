/**
 * 場所選択コンポーネント
 */

import React from 'react'
import { JAPAN_LOCATIONS } from '../../utils/sunCalculations'
import styles from './Controls.module.css'

interface LocationControlProps {
  value: keyof typeof JAPAN_LOCATIONS
  onChange: (value: keyof typeof JAPAN_LOCATIONS) => void
}

const locationIcons: Record<keyof typeof JAPAN_LOCATIONS, string> = {
  tokyo: '🗼',
  osaka: '🏯',
  fukuoka: '🏮',
  sapporo: '❄️',
  naha: '🌺'
}

export const LocationControl: React.FC<LocationControlProps> = ({ value, onChange }) => {
  const currentLocation = JAPAN_LOCATIONS[value]
  
  return (
    <div className={styles.controlGroup}>
      <label className={styles.label}>
        日本の都市: <span className={styles.value}>{currentLocation.name}</span>
      </label>
      <div className={styles.locationGrid}>
        {(Object.keys(JAPAN_LOCATIONS) as Array<keyof typeof JAPAN_LOCATIONS>).map((location) => (
          <button
            key={location}
            className={`${styles.button} ${value === location ? styles.active : ''}`}
            onClick={() => onChange(location)}
            aria-pressed={value === location}
            title={`緯度: ${JAPAN_LOCATIONS[location].latitude.toFixed(2)}°N`}
          >
            {locationIcons[location]} {JAPAN_LOCATIONS[location].name}
          </button>
        ))}
      </div>
      <div className={styles.hint}>
        緯度: {currentLocation.latitude.toFixed(2)}°N, 
        経度: {currentLocation.longitude.toFixed(2)}°E
      </div>
    </div>
  )
}