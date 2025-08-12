/**
 * 日本地理コンパスコンポーネント
 * 日本の地理的方向を表示する3D方角マーカー
 */

import React from 'react'
import { Text } from '@react-three/drei'
import { JAPAN_LOCATIONS } from '../../utils/sunCalculations'

interface JapanCompassProps {
  location: keyof typeof JAPAN_LOCATIONS
}

interface DirectionMarkerProps {
  position: [number, number, number]
  color: string
  label: string
  japaneseLocation: string
  distance?: string
}

const DirectionMarker: React.FC<DirectionMarkerProps> = ({ 
  position, 
  color, 
  label, 
  japaneseLocation, 
  distance 
}) => {
  return (
    <group position={position}>
      {/* 基台 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[2, 2.5, 1, 8]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* メインマーカー */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[1.5, 4, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* 方向表示の矢印 */}
      <mesh position={[0, 6, 0]}>
        <coneGeometry args={[1, 2, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* 方角テキスト */}
      <Text
        position={[0, 10, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.2}
        outlineColor="black"
      >
        {label}
      </Text>
      
      {/* 日本の地名 */}
      <Text
        position={[0, 8, 0]}
        fontSize={1.2}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        {japaneseLocation}
      </Text>
      
      {/* 距離表示 */}
      {distance && (
        <Text
          position={[0, 6.5, 0]}
          fontSize={1}
          color="#E0E0E0"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="black"
        >
          {distance}
        </Text>
      )}
    </group>
  )
}

export const JapanCompass: React.FC<JapanCompassProps> = ({ location }) => {
  const getDirectionInfo = () => {
    switch (location) {
      case 'tokyo':
        return [
          { position: [0, 2, -35], color: '#FF0000', label: '北', japaneseLocation: '仙台・札幌', distance: '300km' },
          { position: [0, 2, 35], color: '#0000FF', label: '南', japaneseLocation: '静岡・名古屋', distance: '200km' },
          { position: [35, 2, 0], color: '#00FF00', label: '東', japaneseLocation: '千葉・太平洋', distance: '50km' },
          { position: [-35, 2, 0], color: '#FF00FF', label: '西', japaneseLocation: '山梨・長野', distance: '100km' }
        ]
      
      case 'osaka':
        return [
          { position: [0, 2, -35], color: '#FF0000', label: '北', japaneseLocation: '京都・福井', distance: '100km' },
          { position: [0, 2, 35], color: '#0000FF', label: '南', japaneseLocation: '和歌山・紀伊半島', distance: '80km' },
          { position: [35, 2, 0], color: '#00FF00', label: '東', japaneseLocation: '奈良・三重', distance: '60km' },
          { position: [-35, 2, 0], color: '#FF00FF', label: '西', japaneseLocation: '神戸・姫路', distance: '50km' }
        ]
      
      case 'fukuoka':
        return [
          { position: [0, 2, -35], color: '#FF0000', label: '北', japaneseLocation: '佐賀・長崎', distance: '100km' },
          { position: [0, 2, 35], color: '#0000FF', label: '南', japaneseLocation: '熊本・鹿児島', distance: '200km' },
          { position: [35, 2, 0], color: '#00FF00', label: '東', japaneseLocation: '大分・別府', distance: '150km' },
          { position: [-35, 2, 0], color: '#FF00FF', label: '西', japaneseLocation: '玄界灘・朝鮮半島', distance: '200km' }
        ]
      
      case 'sapporo':
        return [
          { position: [0, 2, -35], color: '#FF0000', label: '北', japaneseLocation: '旭川・稚内', distance: '300km' },
          { position: [0, 2, 35], color: '#0000FF', label: '南', japaneseLocation: '函館・本州', distance: '250km' },
          { position: [35, 2, 0], color: '#00FF00', label: '東', japaneseLocation: '帯広・釧路', distance: '200km' },
          { position: [-35, 2, 0], color: '#FF00FF', label: '西', japaneseLocation: '小樽・日本海', distance: '40km' }
        ]
      
      case 'naha':
        return [
          { position: [0, 2, -35], color: '#FF0000', label: '北', japaneseLocation: '本部・名護', distance: '70km' },
          { position: [0, 2, 35], color: '#0000FF', label: '南', japaneseLocation: '糸満・南城', distance: '20km' },
          { position: [35, 2, 0], color: '#00FF00', label: '東', japaneseLocation: '太平洋・久米島', distance: '100km' },
          { position: [-35, 2, 0], color: '#FF00FF', label: '西', japaneseLocation: '東シナ海・台湾', distance: '600km' }
        ]
      
      default:
        return [
          { position: [0, 2, -35], color: '#FF0000', label: '北', japaneseLocation: '北海道', distance: '' },
          { position: [0, 2, 35], color: '#0000FF', label: '南', japaneseLocation: '九州', distance: '' },
          { position: [35, 2, 0], color: '#00FF00', label: '東', japaneseLocation: '太平洋', distance: '' },
          { position: [-35, 2, 0], color: '#FF00FF', label: '西', japaneseLocation: '日本海', distance: '' }
        ]
    }
  }

  return (
    <group>
      {getDirectionInfo().map((direction, index) => (
        <DirectionMarker
          key={index}
          position={direction.position as [number, number, number]}
          color={direction.color}
          label={direction.label}
          japaneseLocation={direction.japaneseLocation}
          distance={direction.distance}
        />
      ))}
      
      {/* 中央コンパス */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[8, 8, 0.4, 32]} />
        <meshStandardMaterial color="#333333" opacity={0.8} transparent />
      </mesh>
      
      {/* 中央のロゴ */}
      <Text
        position={[0, 2, 0]}
        fontSize={3}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.2}
        outlineColor="black"
      >
        {JAPAN_LOCATIONS[location].name}
      </Text>
    </group>
  )
}