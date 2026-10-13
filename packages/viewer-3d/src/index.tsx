import { Canvas } from '@react-three/fiber';
import type { SceneAsset } from '@park/contracts';

export interface CampusViewerProps {
  assets: SceneAsset[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
}

/** Geometry-only placeholder. Production models and camera navigation are not implemented. */
export function CampusViewer({ assets, selectedAssetId, onSelectAsset }: CampusViewerProps) {
  return (
    <Canvas
      camera={{ position: [11, 12, 15], fov: 45 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <color attach="background" args={['#081827']} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 10, 5]} intensity={3} />
      <gridHelper args={[24, 24, '#2b6174', '#143243']} />
      {assets.map((asset) => (
        <mesh
          key={asset.id}
          position={asset.position}
          onClick={(event) => {
            event.stopPropagation();
            onSelectAsset(asset.id);
          }}
        >
          <boxGeometry args={asset.size} />
          <meshStandardMaterial
            color={asset.color}
            emissive={selectedAssetId === asset.id ? '#39748a' : '#000000'}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </Canvas>
  );
}
