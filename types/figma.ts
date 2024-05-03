export type FigmaComponentProperties = Record<string, string>

export type FigmaToCodeResponse = {
  tag: string | null,
  fills: any,
  absoluteBoundingBox: Rect | null
  children: Array<ChildrenTextNode>
}

export type ChildrenTextNode = {
  characters: string;
  fills: symbol | readonly Paint[];
  absoluteBoundingBox: Rect | null;
}
