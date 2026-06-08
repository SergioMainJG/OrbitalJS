export interface TextureProvider {
  getTexture(bodyId: string): Promise<string>;
}
