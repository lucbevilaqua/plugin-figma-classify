type GeneratorCodeProps = {
  componentProps: { [key: string]: string | boolean };
  componentName: string;
};

type MappingToProps = { [key: string]: (key: string, value: string | boolean) => string }
type MappingSpacings = { [key: string]: string }
