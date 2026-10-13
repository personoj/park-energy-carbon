/** Bootstrap contracts. Runtime validation and OpenAPI generation are milestone M1. */
export type AssetKind = 'solar' | 'storage' | 'factory';
export interface SceneAsset {
  id: string;
  name: string;
  kind: AssetKind;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}
