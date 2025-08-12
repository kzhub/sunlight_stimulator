import { describe, it, expect } from 'vitest'
import {
  calculateSunPosition,
  calculateShadowLength,
  calculateIntensity,
  getLightCondition,
  degreesToRadians,
  radiansToDegrees,
  SEASONS,
  JAPAN_LOCATIONS,
} from './sunCalculations'

describe('sunCalculations', () => {
  describe('degreesToRadians', () => {
    it('should convert 0 degrees to 0 radians', () => {
      expect(degreesToRadians(0)).toBe(0)
    })

    it('should convert 180 degrees to π radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI)
    })

    it('should convert 90 degrees to π/2 radians', () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2)
    })
  })

  describe('radiansToDegrees', () => {
    it('should convert 0 radians to 0 degrees', () => {
      expect(radiansToDegrees(0)).toBe(0)
    })

    it('should convert π radians to 180 degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180)
    })

    it('should convert π/2 radians to 90 degrees', () => {
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90)
    })
  })

  describe('calculateSunPosition', () => {
    it('should calculate noon position at summer solstice in Tokyo', () => {
      const position = calculateSunPosition(12, 'summer', JAPAN_LOCATIONS.tokyo.latitude)
      
      // 夏至の正午は最も高い位置
      expect(position.elevation).toBeGreaterThan(70)
      expect(position.elevation).toBeLessThan(90)
      
      // 正午の方位角は0度（北から測る）
      expect(position.azimuth).toBeLessThan(10) // ほぼ0度
      
      // 3D座標の確認
      expect(position.x).toBeCloseTo(0, 0)
      expect(position.y).toBeGreaterThan(60)
      expect(position.z).toBeLessThan(0) // 南は負のz方向
    })

    it('should calculate sunrise position', () => {
      const position = calculateSunPosition(6, 'spring', JAPAN_LOCATIONS.tokyo.latitude)
      
      // 朝6時頃は東寄り（270度付近 - 西から東へ）
      expect(position.azimuth).toBeGreaterThan(250)
      expect(position.azimuth).toBeLessThan(290)
      
      // 日の出直後なので低い位置
      expect(position.elevation).toBeLessThan(20)
    })

    it('should calculate winter solstice noon position', () => {
      const summerNoon = calculateSunPosition(12, 'summer', JAPAN_LOCATIONS.tokyo.latitude)
      const winterNoon = calculateSunPosition(12, 'winter', JAPAN_LOCATIONS.tokyo.latitude)
      
      // 冬至の正午は夏至より低い
      expect(winterNoon.elevation).toBeLessThan(summerNoon.elevation)
      
      // 両方とも正午なので方位はほぼ0度（真南）
      expect(winterNoon.azimuth).toBeLessThan(10)
      expect(summerNoon.azimuth).toBeLessThan(10)
    })

    it('should handle different latitudes correctly', () => {
      const tokyoNoon = calculateSunPosition(12, 'summer', JAPAN_LOCATIONS.tokyo.latitude)
      const sapporoNoon = calculateSunPosition(12, 'summer', JAPAN_LOCATIONS.sapporo.latitude)
      const nahaNoon = calculateSunPosition(12, 'summer', JAPAN_LOCATIONS.naha.latitude)
      
      // 緯度が低いほど太陽が高い
      expect(nahaNoon.elevation).toBeGreaterThan(tokyoNoon.elevation)
      expect(tokyoNoon.elevation).toBeGreaterThan(sapporoNoon.elevation)
    })
  })

  describe('calculateShadowLength', () => {
    it('should return null for negative elevation', () => {
      expect(calculateShadowLength(-10)).toBeNull()
    })

    it('should return 1 for 45 degrees elevation', () => {
      expect(calculateShadowLength(45)).toBeCloseTo(1, 1)
    })

    it('should return shorter shadow for higher elevation', () => {
      const shadow30 = calculateShadowLength(30)
      const shadow60 = calculateShadowLength(60)
      
      expect(shadow30).not.toBeNull()
      expect(shadow60).not.toBeNull()
      expect(shadow60!).toBeLessThan(shadow30!)
    })

    it('should approach 0 as elevation approaches 90', () => {
      const shadow89 = calculateShadowLength(89)
      expect(shadow89).not.toBeNull()
      expect(shadow89!).toBeLessThan(0.1)
    })
  })

  describe('calculateIntensity', () => {
    it('should return 0 for negative elevation', () => {
      expect(calculateIntensity(-10)).toBe(0)
    })

    it('should return minimum 0.3 for low positive elevation', () => {
      expect(calculateIntensity(5)).toBeGreaterThanOrEqual(0.3)
    })

    it('should return maximum intensity for 90 degrees', () => {
      expect(calculateIntensity(90)).toBeCloseTo(1, 1)
    })

    it('should increase with elevation', () => {
      const intensity30 = calculateIntensity(30)
      const intensity60 = calculateIntensity(60)
      
      expect(intensity60).toBeGreaterThan(intensity30)
    })
  })

  describe('getLightCondition', () => {
    it('should return night for elevation below -18', () => {
      const condition = getLightCondition(-20)
      expect(condition.type).toBe('night')
      expect(condition.name).toBe('夜間')
    })

    it('should return astronomical twilight for -18 to -12', () => {
      const condition = getLightCondition(-15)
      expect(condition.type).toBe('astronomical')
      expect(condition.name).toBe('天体薄明')
    })

    it('should return nautical twilight for -12 to -6', () => {
      const condition = getLightCondition(-9)
      expect(condition.type).toBe('nautical')
      expect(condition.name).toBe('航海薄明')
    })

    it('should return deep blue hour for -6 to -4', () => {
      const condition = getLightCondition(-5)
      expect(condition.type).toBe('civil-deep')
      expect(condition.name).toBe('ブルーアワー（濃）')
    })

    it('should return blue hour for -4 to 0', () => {
      const condition = getLightCondition(-2)
      expect(condition.type).toBe('civil')
      expect(condition.name).toBe('ブルーアワー')
    })

    it('should return golden hour for 0 to 6', () => {
      const condition = getLightCondition(3)
      expect(condition.type).toBe('golden-low')
      expect(condition.name).toBe('ゴールデンアワー')
    })

    it('should return soft light for 6 to 25', () => {
      const condition = getLightCondition(15)
      expect(condition.type).toBe('golden-high')
      expect(condition.name).toBe('柔らかい光')
    })

    it('should return normal daylight for above 25', () => {
      const condition = getLightCondition(45)
      expect(condition.type).toBe('normal')
      expect(condition.name).toBe('通常の日中')
    })
  })

  describe('constants', () => {
    it('should have correct season declinations', () => {
      expect(SEASONS.summer.declination).toBe(23.5)
      expect(SEASONS.winter.declination).toBe(-23.5)
      expect(SEASONS.spring.declination).toBe(0)
      expect(SEASONS.autumn.declination).toBe(0)
    })

    it('should have correct Japan location coordinates', () => {
      expect(JAPAN_LOCATIONS.tokyo.latitude).toBeCloseTo(35.6762, 3)
      expect(JAPAN_LOCATIONS.osaka.latitude).toBeCloseTo(34.6937, 3)
      expect(JAPAN_LOCATIONS.sapporo.latitude).toBeCloseTo(43.0642, 3)
      expect(JAPAN_LOCATIONS.naha.latitude).toBeCloseTo(26.2124, 3)
    })
  })
})