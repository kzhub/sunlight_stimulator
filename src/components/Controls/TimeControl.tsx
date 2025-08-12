/**
 * 時間コントロールコンポーネント
 */

import React from 'react'
import styles from './Controls.module.css'

interface TimeControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export const TimeControl: React.FC<TimeControlProps> = ({
  value,
  onChange,
  min = 0,
  max = 24,
  step = 0.25
}) => {
  const formatTime = (time: number): string => {
    const hours = Math.floor(time)
    const minutes = Math.round((time - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  const getGradientColor = (time: number): string => {
    if (time < 5 || time > 19) return '#2d3436' // 夜
    if (time < 6 || time > 18) return '#6c5ce7' // ブルーアワー
    if (time < 7 || time > 17) return '#fd79a8' // ゴールデンアワー
    if (time < 8 || time > 16) return '#fdcb6e' // 朝夕
    return '#74b9ff' // 昼間
  }

  const gradientStops = Array.from({ length: 25 }, (_, i) => {
    const time = i
    const color = getGradientColor(time)
    return `${color} ${(i / 24) * 100}%`
  }).join(', ')

  return (
    <div className={styles.controlGroup}>
      <label className={styles.label}>
        時刻: <span className={styles.value}>{formatTime(value)}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.slider}
        style={{
          background: `linear-gradient(to right, ${gradientStops})`
        }}
      />
      <div className={styles.hint}>
        グラデーションが時間帯の光の色を表示
      </div>
    </div>
  )
}