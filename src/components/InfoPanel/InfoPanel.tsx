/**
 * 情報パネルコンポーネント
 * 太陽の位置情報や撮影条件を表示
 */

import React, { useState } from 'react'
import { 
  calculateSunPosition, 
  calculateShadowLength, 
  calculateIntensity,
  getLightCondition,
  JAPAN_LOCATIONS,
  SEASONS 
} from '../../utils/sunCalculations'
import styles from './InfoPanel.module.css'

interface InfoPanelProps {
  time: number
  season: keyof typeof SEASONS
  location: keyof typeof JAPAN_LOCATIONS
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ time, season, location }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const loc = JAPAN_LOCATIONS[location]
  const sunPos = calculateSunPosition(time, season, loc.latitude)
  const shadowLength = calculateShadowLength(sunPos.elevation)
  const intensity = calculateIntensity(sunPos.elevation)
  const lightCondition = getLightCondition(sunPos.elevation)

  const formatElevation = (elevation: number): string => {
    if (elevation < -18) return '地平線下'
    return `${elevation.toFixed(1)}°`
  }

  const formatShadowLength = (length: number | null): string => {
    if (length === null) return '--'
    if (length > 20) return '∞'
    return `${length.toFixed(1)}倍`
  }

  const InfoContent = () => (
    <>
      <h3 className={styles.title}>☀️ 太陽データ</h3>
      
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>現在地:</span>
          <span className={styles.infoValue}>{loc.name}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>太陽高度:</span>
          <span className={styles.infoValue}>{formatElevation(sunPos.elevation)}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>方位角:</span>
          <span className={styles.infoValue}>{sunPos.azimuth.toFixed(1)}°</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>影の長さ:</span>
          <span className={styles.infoValue}>{formatShadowLength(shadowLength)}</span>
        </div>
        
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>日照強度:</span>
          <span className={styles.infoValue}>{(intensity * 100).toFixed(0)}%</span>
        </div>
      </div>
      
      <div 
        className={styles.lightCondition}
        style={{ 
          background: `linear-gradient(135deg, ${lightCondition.color}, ${lightCondition.color}dd)`
        }}
      >
        <div className={styles.lightConditionTitle}>
          📸 {lightCondition.name}
        </div>
        <div className={styles.lightConditionDescription}>
          {lightCondition.description}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* デスクトップ版 */}
      <div className={`${styles.panel} ${styles.infoPanel}`}>
        <InfoContent />
      </div>

      {/* モバイル版ハンバーガーメニュー */}
      <button 
        className={styles.mobileMenuButton}
        onClick={() => setMobileMenuOpen(true)}
        aria-label="太陽データを表示"
      >
        ☀️
      </button>

      {/* モバイル版オーバーレイ */}
      <div 
        className={`${styles.mobileMenuOverlay} ${mobileMenuOpen ? styles.open : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* モバイル版パネル */}
      <div className={`${styles.mobileInfoPanel} ${mobileMenuOpen ? styles.open : ''}`}>
        <button 
          className={styles.closeButton}
          onClick={() => setMobileMenuOpen(false)}
          aria-label="閉じる"
        >
          ✕
        </button>
        <InfoContent />
      </div>
    </>
  )
}