export interface Slots {
  small?: SizeOptions;
  medium?: SizeOptions;
  large?: SizeOptions;
}

interface SizeOptions {
  spaces: Array<number>;
  total: number;
}
