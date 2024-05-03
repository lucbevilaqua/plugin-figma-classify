export type FigmaComponentProperties = Record<string, string>

export type FigmaToCodeResponse = {
  tag: string | null,
  fills: any,
  absoluteBoundingBox: any
  children: Array<SceneNode>
}
