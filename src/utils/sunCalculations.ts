/**
 * 太陽位置計算モジュール
 * 単一責任の原則に従い、太陽位置の計算ロジックのみを担当
 */

export interface SunPosition {
  x: number
  y: number
  z: number
  elevation: number  // 太陽高度（度）
  azimuth: number    // 方位角（度）
}

export interface Season {
  name: string
  declination: number  // 赤緯（度）
}

export interface Location {
  name: string
  latitude: number
  longitude: number
}

// 定数定義
export const SEASONS: Record<string, Season> = {
  summer: { name: '夏至', declination: 23.5 },
  winter: { name: '冬至', declination: -23.5 },
  spring: { name: '春分', declination: 0 },
  autumn: { name: '秋分', declination: 0 },
} as const

export const JAPAN_LOCATIONS: Record<string, Location> = {
  tokyo: { name: '東京', latitude: 35.6762, longitude: 139.6503 },
  osaka: { name: '大阪', latitude: 34.6937, longitude: 135.5023 },
  fukuoka: { name: '福岡', latitude: 33.5904, longitude: 130.4017 },
  sapporo: { name: '札幌', latitude: 43.0642, longitude: 141.3469 },
  naha: { name: '那覇', latitude: 26.2124, longitude: 127.6792 },
} as const

/**
 * 度をラジアンに変換
 */
export const degreesToRadians = (degrees: number): number => {
  return degrees * Math.PI / 180
}

/**
 * ラジアンを度に変換
 */
export const radiansToDegrees = (radians: number): number => {
  return radians * 180 / Math.PI
}

/**
 * 太陽位置を計算
 * @param time 時刻（0-24）
 * @param seasonKey 季節のキー
 * @param latitude 緯度（度）
 * @param distance 太陽までの距離（3D表示用）
 * @returns 太陽の3D位置と角度情報
 */
export const calculateSunPosition = (
  time: number,
  seasonKey: keyof typeof SEASONS,
  latitude: number,
  distance: number = 80
): SunPosition => {
  const season = SEASONS[seasonKey]
  const declination = degreesToRadians(season.declination)
  const lat = degreesToRadians(latitude)
  const hourAngle = degreesToRadians((time - 12) * 15)
  
  // 太陽高度の計算
  const elevation = Math.asin(
    Math.sin(declination) * Math.sin(lat) +
    Math.cos(declination) * Math.cos(lat) * Math.cos(hourAngle)
  )
  
  // 方位角の計算
  const azimuthRad = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(lat) - Math.tan(declination) * Math.cos(lat)
  )
  
  // 3D座標に変換
  const x = Math.sin(azimuthRad) * Math.cos(elevation) * distance
  const y = Math.sin(elevation) * distance
  const z = -Math.cos(azimuthRad) * Math.cos(elevation) * distance
  
  return {
    x,
    y: Math.max(-10, y), // 地平線下でも少し見えるように
    z,
    elevation: radiansToDegrees(elevation),
    azimuth: (radiansToDegrees(azimuthRad) + 360) % 360,
  }
}

/**
 * 影の長さを計算
 * @param elevation 太陽高度（度）
 * @returns 影の長さ（身長に対する倍率）
 */
export const calculateShadowLength = (elevation: number): number | null => {
  if (elevation <= 0) return null
  const elevationRad = degreesToRadians(elevation)
  return 1 / Math.tan(elevationRad)
}

/**
 * 日照強度を計算（0-1）
 * @param elevation 太陽高度（度）
 * @returns 日照強度（0-1）
 */
export const calculateIntensity = (elevation: number): number => {
  if (elevation <= 0) return 0
  return Math.max(0.3, Math.sin(degreesToRadians(Math.max(0, elevation))))
}

/**
 * マジックアワー・ゴールデンアワーの判定
 */
export type LightCondition = 
  | 'night'
  | 'astronomical'
  | 'nautical'
  | 'civil-deep'
  | 'civil'
  | 'golden-low'
  | 'golden-high'
  | 'normal'

export interface LightConditionInfo {
  type: LightCondition
  name: string
  color: string
  description: string
}

export const getLightCondition = (elevation: number): LightConditionInfo => {
  if (elevation < -18) {
    return { 
      type: 'night', 
      name: '夜間', 
      color: '#1a1a2e',
      description: '完全な夜' 
    }
  }
  if (elevation < -12) {
    return { 
      type: 'astronomical', 
      name: '天体薄明', 
      color: '#16213e',
      description: '星が見え始める' 
    }
  }
  if (elevation < -6) {
    return { 
      type: 'nautical', 
      name: '航海薄明', 
      color: '#1e3a5f',
      description: '水平線が見え始める' 
    }
  }
  if (elevation < -4) {
    return { 
      type: 'civil-deep', 
      name: 'ブルーアワー（濃）', 
      color: '#16537e',
      description: '深い青色の空' 
    }
  }
  if (elevation < 0) {
    return { 
      type: 'civil', 
      name: 'ブルーアワー', 
      color: '#2874a6',
      description: '美しい青色の空' 
    }
  }
  if (elevation < 6) {
    return { 
      type: 'golden-low', 
      name: 'ゴールデンアワー', 
      color: '#ffa500',
      description: '黄金の光' 
    }
  }
  if (elevation < 25) {
    return { 
      type: 'golden-high', 
      name: '柔らかい光', 
      color: '#ffcc66',
      description: 'ポートレート撮影に最適' 
    }
  }
  return { 
    type: 'normal', 
    name: '通常の日中', 
    color: '#87ceeb',
    description: '通常の太陽光' 
  }
}