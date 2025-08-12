/**
 * シミュレーター状態管理カスタムフック
 * 状態管理と副作用を分離してテスタブルにする
 */

import { useState, useCallback, useEffect } from 'react'
import { SEASONS, JAPAN_LOCATIONS } from '../utils/sunCalculations'

export interface SimulatorState {
  time: number                    // 時刻 (0-24)
  season: keyof typeof SEASONS    // 季節
  location: keyof typeof JAPAN_LOCATIONS  // 場所
}

export interface SimulatorControls {
  setTime: (time: number) => void
  setSeason: (season: keyof typeof SEASONS) => void
  setLocation: (location: keyof typeof JAPAN_LOCATIONS) => void
  resetToDefaults: () => void
}

const DEFAULT_STATE: SimulatorState = {
  time: 12,
  season: 'summer',
  location: 'tokyo',
}

export const useSimulatorState = (
  initialState: Partial<SimulatorState> = {}
): [SimulatorState, SimulatorControls] => {
  const [state, setState] = useState<SimulatorState>({
    ...DEFAULT_STATE,
    ...initialState,
  })

  const setTime = useCallback((time: number) => {
    setState(prev => ({
      ...prev,
      time: Math.max(0, Math.min(24, time))
    }))
  }, [])

  const setSeason = useCallback((season: keyof typeof SEASONS) => {
    setState(prev => ({ ...prev, season }))
  }, [])

  const setLocation = useCallback((location: keyof typeof JAPAN_LOCATIONS) => {
    setState(prev => ({ ...prev, location }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setState(DEFAULT_STATE)
  }, [])

  // LocalStorageに状態を保存
  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem('sun-simulator-state', JSON.stringify(state))
      } catch (error) {
        console.error('Failed to save state:', error)
      }
    }
    
    const timer = setTimeout(saveState, 500) // デバウンス
    return () => clearTimeout(timer)
  }, [state])

  // LocalStorageから状態を復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sun-simulator-state')
      if (saved) {
        const parsed = JSON.parse(saved) as SimulatorState
        setState(prev => ({
          ...prev,
          ...parsed,
        }))
      }
    } catch (error) {
      console.error('Failed to load state:', error)
    }
  }, [])

  return [
    state,
    {
      setTime,
      setSeason,
      setLocation,
      resetToDefaults,
    }
  ]
}