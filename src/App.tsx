/**
 * メインアプリケーションコンポーネント
 */

import { useState } from 'react'
import { SunSimulatorScene } from './components/Scene/SunSimulatorScene'
import { TimeControl } from './components/Controls/TimeControl'
import { SeasonControl } from './components/Controls/SeasonControl'
import { LocationControl } from './components/Controls/LocationControl'
import { InfoPanel } from './components/InfoPanel/InfoPanel'
import { useSimulatorState } from './hooks/useSimulatorState'
import './App.css'

function App() {
  const [state, controls] = useSimulatorState()
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false)

  const ControlsContent = ({ includeTimeControl = true }) => (
    <>
      <h2 className="panel-title">🌞 太陽シミュレーター</h2>
      
      {includeTimeControl && (
        <TimeControl 
          value={state.time}
          onChange={controls.setTime}
        />
      )}
      
      <LocationControl
        value={state.location}
        onChange={controls.setLocation}
      />
      
      <SeasonControl
        value={state.season}
        onChange={controls.setSeason}
      />
      
      <button 
        className="reset-button"
        onClick={controls.resetToDefaults}
      >
        🔄 リセット
      </button>
      
      <div className="help-text">
        💡 マウスドラッグで視点回転<br />
        🔍 ホイールでズーム
      </div>
    </>
  )

  return (
    <div className="app">
      {/* 3Dシーン */}
      <SunSimulatorScene 
        time={state.time}
        season={state.season}
        location={state.location}
      />
      
      {/* デスクトップ版コントロールパネル */}
      <div className="controls-panel">
        <ControlsContent />
      </div>

      {/* モバイル版時間コントロール */}
      <div className="mobileTimeControl">
        <TimeControl 
          value={state.time}
          onChange={controls.setTime}
        />
      </div>

      {/* モバイル版コントロールハンバーガーメニュー */}
      <button 
        className="mobileControlButton"
        onClick={() => setMobileControlsOpen(true)}
        aria-label="コントロールパネルを表示"
      >
        ⚙️
      </button>

      {/* モバイル版コントロールオーバーレイ */}
      <div 
        className={`mobileControlOverlay ${mobileControlsOpen ? 'open' : ''}`}
        onClick={() => setMobileControlsOpen(false)}
      />

      {/* モバイル版コントロールパネル */}
      <div className={`mobileControlPanel ${mobileControlsOpen ? 'open' : ''}`}>
        <button 
          className="closeControlButton"
          onClick={() => setMobileControlsOpen(false)}
          aria-label="閉じる"
        >
          ✕
        </button>
        <ControlsContent includeTimeControl={false} />
      </div>
      
      {/* 情報パネル */}
      <InfoPanel 
        time={state.time}
        season={state.season}
        location={state.location}
      />
    </div>
  )
}

export default App
