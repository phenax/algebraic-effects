
declare module 'pipey' {
  type CurriedMethod = (...args: any) => (o: any) => any;
  type Methods = { [key: string]: CurriedMethod };

  export function fromClassPrototype(classWithP: any): Methods;
}
