export type ZIndex = {
  base: number;
  overlay: number;
  modal: number;
  toast: number;
  highest: number;
};

export const zIndex: ZIndex = {
  base: 0,
  overlay: 10,
  modal: 20,
  toast: 30,
  highest: 2147483647,
};


