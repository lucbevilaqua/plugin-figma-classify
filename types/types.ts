export type FigmaComponentProps = Record<string, string>

export type DsComponentType = 'component' | 'className'

export type MappingGenerators = Record<DsComponentType, (componentName: string, componentProperties: FigmaComponentProps) => string | null>;
interface DsComponentOptions {
  capitalize?: boolean
}

interface DsComponent {
  type?: DsComponentType
  props: Array<string>
  directives: Array<{ key: string, mask: string }>
  contents?: Array<string>
  options?: DsComponentOptions
}

export type DesignSystem = {
  prefix: string;
  components: Record<string, DsComponent>;
}
