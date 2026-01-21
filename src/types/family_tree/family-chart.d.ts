declare module "family-chart" {
  export interface Person {
    id: string | number;
    name?: string;
    birthDate?: string;
    gender?: "male" | "female";
    parents?: (string | number)[];
    img?: string;
    title?: string;
    [key: string]: any;
  }

  export interface Config {
    nodeWidth?: number;
    nodeHeight?: number;
    levelHeight?: number;
    showMarriage?: boolean;
    collapsible?: boolean;
    backgroundColor?: string;
    fontSize?: number;
    nodeRenderer?: (node: any) => string;
    [key: string]: any;
  }

  export interface Options {
    data: Person[];
    config?: Config;
  }

  export const createChart: (container: HTMLElement, options: Options) => void;
  export const CalculateTree: (options: Options) => any;
  export const createStore: (initialState: any) => any;

  // thêm formatData
  export const formatData: (data: Person[]) => Person[];
  export const formatDataForExport: (data: Person[], legacy_format?: boolean) => any;
}
