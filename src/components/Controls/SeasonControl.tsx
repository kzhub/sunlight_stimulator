/**
 * 季節選択コンポーネント
 */

import React from 'react'
import { SEASONS } from '../../utils/sunCalculations'
import styles from './Controls.module.css'

interface SeasonControlProps {
  value: keyof typeof SEASONS
  onChange: (value: keyof typeof SEASONS) => void
}

const seasonIcons: Record<keyof typeof SEASONS, string> = {
  summer: '☀️',
  winter: '❄️',
  spring: '🌸',
  autumn: '🍂'
}

export const SeasonControl: React.FC<SeasonControlProps> = ({ value, onChange }) => {
  return (
    <div className={styles.controlGroup}>
      <label className={styles.label}>季節を選択:</label>
      <div className={styles.buttonGrid}>
        {(Object.keys(SEASONS) as Array<keyof typeof SEASONS>).map((season) => (
          <button
            key={season}
            className={`${styles.button} ${value === season ? styles.active : ''}`}
            onClick={() => onChange(season)}
            aria-pressed={value === season}
          >
            {seasonIcons[season]} {SEASONS[season].name}
          </button>
        ))}
      </div>
    </div>
  )
}