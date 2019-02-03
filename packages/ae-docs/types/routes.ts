
type FunctionalComponent = (p: any) => JSX.Element;

export type Page = {
  order: number,
  title: string,
  render: FunctionalComponent | React.LazyExoticComponent<FunctionalComponent>,
  description?: string,
  keywords?: string,
  group?: string,
  key?: string,
};

export type Routes = { [key: string]: Page };
