/**
 * 3Dシーンコンポーネント
 * React Three FiberとDreiを使用した宣言的な3D描画
 */

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { 
  calculateSunPosition, 
  calculateIntensity,
  JAPAN_LOCATIONS,
  SEASONS
} from '../../utils/sunCalculations'
import { Buildings } from './Buildings'
import { JapanCompass } from './JapanCompass'

interface SunProps {
  position: { x: number; y: number; z: number }
  intensity: number
}

const Sun: React.FC<SunProps> = ({ position, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      // 太陽の微妙な脈動アニメーション
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.05)
    }
  })

  return (
    <>
      <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          color={intensity > 0.5 ? '#FFD700' : '#FFA500'} 
          emissive="#FFAA00"
          emissiveIntensity={0.3}
        />
      </mesh>
      <directionalLight
        position={[position.x, position.y, position.z]}
        intensity={intensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
    </>
  )
}

interface PersonProps {
  height?: number
}

const Person: React.FC<PersonProps> = () => {
  return (
    <group position={[0, 0, 0]} castShadow>
      {/* 体 */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 3, 8]} />
        <meshStandardMaterial color="#2B5AA0" />
      </mesh>
      
      {/* 頭 */}
      <mesh position={[0, 5.2, 0]} castShadow>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#FFDBAC" />
      </mesh>
      
      {/* 腕 */}
      <mesh position={[-1.5, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#FFDBAC" />
      </mesh>
      <mesh position={[1.5, 3.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#FFDBAC" />
      </mesh>
      
      {/* 足 */}
      <mesh position={[-0.4, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.4, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  )
}


interface SceneContentProps {
  time: number
  season: keyof typeof SEASONS
  location: keyof typeof JAPAN_LOCATIONS
}

const SceneContent: React.FC<SceneContentProps> = ({ time, season, location }) => {
  const { sunPosition, intensity } = useMemo(() => {
    const loc = JAPAN_LOCATIONS[location]
    const pos = calculateSunPosition(time, season, loc.latitude)
    const int = calculateIntensity(pos.elevation)
    
    return {
      sunPosition: pos,
      intensity: int
    }
  }, [time, season, location])

  return (
    <>
      {/* 照明 */}
      <ambientLight intensity={0.6} />
      
      {/* 太陽 */}
      {sunPosition.elevation > -6 && (
        <Sun position={sunPosition} intensity={intensity} />
      )}
      
      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#7CB342" side={THREE.DoubleSide} />
      </mesh>
      
      {/* 道路 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 100]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 20]} receiveShadow>
        <planeGeometry args={[100, 6]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* 横断歩道 */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[17 + i * 0.5, 0.02, 0]} receiveShadow>
          <planeGeometry args={[0.3, 6]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 17 + i * 0.5]} receiveShadow>
          <planeGeometry args={[6, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
      
      {/* グリッド */}
      <Grid 
        args={[300, 300]} 
        cellSize={10} 
        cellThickness={0.3} 
        cellColor="#666666" 
        sectionSize={50} 
        sectionThickness={0.8} 
        sectionColor="#444444"
        fadeDistance={200}
        fadeStrength={1}
        followCamera={false}
      />
      
      {/* 人物 */}
      <Person />
      
      {/* 建物群 */}
      <Buildings location={location} />
      
      {/* 日本地理コンパス */}
      <JapanCompass location={location} />
      
      {/* 空 */}
      <Sky 
        distance={450000}
        sunPosition={[sunPosition.x, sunPosition.y, sunPosition.z]}
        inclination={0.6}
        azimuth={0.25}
      />
    </>
  )
}

export interface SunSimulatorSceneProps {
  time: number
  season: keyof typeof SEASONS
  location: keyof typeof JAPAN_LOCATIONS
}

export const SunSimulatorScene: React.FC<SunSimulatorSceneProps> = ({
  time,
  season,
  location
}) => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ 
          position: [50, 30, 50], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <SceneContent time={time} season={season} location={location} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={20}
          maxDistance={150}
        />
      </Canvas>
    </div>
  )
}