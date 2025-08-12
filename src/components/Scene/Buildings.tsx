/**
 * 日本の建物コンポーネント
 * 各都市の代表的な建物を3Dで表現
 */

import React from 'react'
import { JAPAN_LOCATIONS } from '../../utils/sunCalculations'

interface BuildingsProps {
  location: keyof typeof JAPAN_LOCATIONS
}

const TokyoBuildingsSet: React.FC = () => (
  <group>
    {/* 東京スカイツリー風 */}
    <mesh position={[15, 15, -10]} castShadow>
      <cylinderGeometry args={[0.8, 1.5, 30, 6]} />
      <meshStandardMaterial color="#C0C0C0" />
    </mesh>
    <mesh position={[15, 31, -10]} castShadow>
      <cylinderGeometry args={[0.3, 0.8, 2, 6]} />
      <meshStandardMaterial color="#FF6B6B" />
    </mesh>
    
    {/* 高層ビル群 */}
    <mesh position={[12, 6, -8]} castShadow>
      <boxGeometry args={[3, 12, 3]} />
      <meshStandardMaterial color="#4A90E2" />
    </mesh>
    <mesh position={[18, 8, -12]} castShadow>
      <boxGeometry args={[2.5, 16, 2.5]} />
      <meshStandardMaterial color="#50C878" />
    </mesh>
    <mesh position={[10, 5, -15]} castShadow>
      <boxGeometry args={[2, 10, 2]} />
      <meshStandardMaterial color="#FFB347" />
    </mesh>
  </group>
)

const OsakaBuildingsSet: React.FC = () => (
  <group>
    {/* 大阪城風 */}
    <mesh position={[-15, 8, -10]} castShadow>
      <cylinderGeometry args={[3, 4, 16, 8]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
    <mesh position={[-15, 18, -10]} castShadow>
      <coneGeometry args={[2.5, 4, 8]} />
      <meshStandardMaterial color="#2F4F2F" />
    </mesh>
    
    {/* 商業ビル */}
    <mesh position={[-12, 7, -8]} castShadow>
      <boxGeometry args={[2.5, 14, 2.5]} />
      <meshStandardMaterial color="#FF69B4" />
    </mesh>
    <mesh position={[-18, 5, -12]} castShadow>
      <boxGeometry args={[2, 10, 2]} />
      <meshStandardMaterial color="#20B2AA" />
    </mesh>
  </group>
)

const FukuokaBuildingsSet: React.FC = () => (
  <group>
    {/* 福岡タワー風 */}
    <mesh position={[10, 12, 15]} castShadow>
      <cylinderGeometry args={[0.6, 1.2, 24, 3]} />
      <meshStandardMaterial color="#FFD700" />
    </mesh>
    
    {/* 九州の建物群 */}
    <mesh position={[8, 4, 12]} castShadow>
      <boxGeometry args={[2, 8, 2]} />
      <meshStandardMaterial color="#FF7F50" />
    </mesh>
    <mesh position={[12, 6, 18]} castShadow>
      <boxGeometry args={[2.5, 12, 2.5]} />
      <meshStandardMaterial color="#6A5ACD" />
    </mesh>
  </group>
)

const SapporoBuildingsSet: React.FC = () => (
  <group>
    {/* 札幌時計台風 */}
    <mesh position={[-10, 4, 15]} castShadow>
      <boxGeometry args={[4, 8, 4]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
    <mesh position={[-10, 10, 15]} castShadow>
      <coneGeometry args={[2.5, 4, 4]} />
      <meshStandardMaterial color="#228B22" />
    </mesh>
    
    {/* 雪国の建物 */}
    <mesh position={[-15, 3, 12]} castShadow>
      <boxGeometry args={[2, 6, 2]} />
      <meshStandardMaterial color="#F0F8FF" />
    </mesh>
    <mesh position={[-5, 5, 18]} castShadow>
      <boxGeometry args={[2.5, 10, 2.5]} />
      <meshStandardMaterial color="#4682B4" />
    </mesh>
  </group>
)

const NahaBuildingsSet: React.FC = () => (
  <group>
    {/* 首里城風 */}
    <mesh position={[-15, 5, -15]} castShadow>
      <boxGeometry args={[5, 10, 3]} />
      <meshStandardMaterial color="#DC143C" />
    </mesh>
    <mesh position={[-15, 12, -15]} castShadow>
      <coneGeometry args={[3, 3, 4]} />
      <meshStandardMaterial color="#8B0000" />
    </mesh>
    
    {/* リゾートホテル風 */}
    <mesh position={[-12, 6, -18]} castShadow>
      <boxGeometry args={[2, 12, 2]} />
      <meshStandardMaterial color="#FFF8DC" />
    </mesh>
    <mesh position={[-18, 4, -12]} castShadow>
      <boxGeometry args={[2.5, 8, 2.5]} />
      <meshStandardMaterial color="#F0E68C" />
    </mesh>
  </group>
)

export const Buildings: React.FC<BuildingsProps> = ({ location }) => {
  const renderBuildings = () => {
    switch (location) {
      case 'tokyo':
        return <TokyoBuildingsSet />
      case 'osaka':
        return <OsakaBuildingsSet />
      case 'fukuoka':
        return <FukuokaBuildingsSet />
      case 'sapporo':
        return <SapporoBuildingsSet />
      case 'naha':
        return <NahaBuildingsSet />
      default:
        return <TokyoBuildingsSet />
    }
  }

  return (
    <group>
      {renderBuildings()}
    </group>
  )
}