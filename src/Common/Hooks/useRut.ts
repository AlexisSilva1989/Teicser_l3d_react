import { validate, format, clean } from "rut.js";

export const useRut = () => {
  const validRut = (rut: string) => {
    if (rut === undefined) return false;
    return validate(rut);
  };

  const rutFormat = (rut: string) => {
    return format(rut);
  };

  const rutClearFormat = (rut: string) => {
    return clean(rut);
  };

  return { validRut, rutFormat, rutClearFormat };
};
