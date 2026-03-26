export const Encoder = {
  encode: (str: string) => btoa(str),
  decode: (str: string) => atob(str),
};
