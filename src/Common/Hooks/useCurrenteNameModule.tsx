/*
useCurrenteNameModule => Es un custom hooks para cambiar el title de modulo donde se encuentra.

newTitleName => es una variable opcional se usa para dar un nombre diferente a la ruta raiz
si no pasa el hooks toma por defecto el nombre del sistema en este caso DEFAULT_NAME

ejemplo:
path => "/providers_selection" => useCurrenteNameModule => PROVIDERS SELECTION 
*/

import { useLocation } from "react-router-dom";

export const DEFAULT_NAME = "Sistema de proyecciones";

export const useCurrenteNameModule = (newTitleName?: string) => {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return newTitleName ? newTitleName : DEFAULT_NAME;
  } else {
    let str = pathname.replace("/", "").replace(/[/_]/gmu, " ");

    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
