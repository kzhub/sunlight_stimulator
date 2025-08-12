import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSimulatorState } from './useSimulatorState'

describe('useSimulatorState', () => {
  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSimulatorState())
    const [state] = result.current

    expect(state.time).toBe(12)
    expect(state.season).toBe('summer')
    expect(state.location).toBe('tokyo')
  })

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() => 
      useSimulatorState({ time: 15, season: 'winter' })
    )
    const [state] = result.current

    expect(state.time).toBe(15)
    expect(state.season).toBe('winter')
    expect(state.location).toBe('tokyo') // デフォルト値
  })

  it('should update time within valid range', () => {
    const { result } = renderHook(() => useSimulatorState())

    act(() => {
      result.current[1].setTime(18)
    })

    expect(result.current[0].time).toBe(18)

    // 範囲外の値はクランプされる
    act(() => {
      result.current[1].setTime(25)
    })
    expect(result.current[0].time).toBe(24)

    act(() => {
      result.current[1].setTime(-1)
    })
    expect(result.current[0].time).toBe(0)
  })

  it('should update season', () => {
    const { result } = renderHook(() => useSimulatorState())

    act(() => {
      result.current[1].setSeason('winter')
    })

    expect(result.current[0].season).toBe('winter')
  })

  it('should update location', () => {
    const { result } = renderHook(() => useSimulatorState())

    act(() => {
      result.current[1].setLocation('osaka')
    })

    expect(result.current[0].location).toBe('osaka')
  })

  it('should reset to defaults', () => {
    const { result } = renderHook(() => useSimulatorState())

    act(() => {
      result.current[1].setTime(15)
      result.current[1].setSeason('winter')
      result.current[1].setLocation('sapporo')
    })

    expect(result.current[0].time).toBe(15)
    expect(result.current[0].season).toBe('winter')
    expect(result.current[0].location).toBe('sapporo')

    act(() => {
      result.current[1].resetToDefaults()
    })

    expect(result.current[0].time).toBe(12)
    expect(result.current[0].season).toBe('summer')
    expect(result.current[0].location).toBe('tokyo')
  })

  it('should save state to localStorage', async () => {
    const { result } = renderHook(() => useSimulatorState())

    act(() => {
      result.current[1].setTime(15)
      result.current[1].setSeason('winter')
    })

    // デバウンスのため待機
    await new Promise(resolve => setTimeout(resolve, 600))

    const saved = localStorage.getItem('sun-simulator-state')
    expect(saved).toBeTruthy()
    
    const parsed = JSON.parse(saved!)
    expect(parsed.time).toBe(15)
    expect(parsed.season).toBe('winter')
  })

  it('should load state from localStorage', () => {
    const savedState = {
      time: 9,
      season: 'spring',
      location: 'naha'
    }
    localStorage.setItem('sun-simulator-state', JSON.stringify(savedState))

    const { result } = renderHook(() => useSimulatorState())
    const [state] = result.current

    expect(state.time).toBe(9)
    expect(state.season).toBe('spring')
    expect(state.location).toBe('naha')
  })

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // LocalStorageのエラーをシミュレート
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useSimulatorState())

    act(() => {
      result.current[1].setTime(15)
    })

    // エラーが発生してもクラッシュしない
    expect(result.current[0].time).toBe(15)

    Storage.prototype.setItem = originalSetItem
    consoleSpy.mockRestore()
  })
})