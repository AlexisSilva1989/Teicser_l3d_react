import React from "react";
import { NotFound } from "../Views/NotFound";
import { ModificarUsuario } from "../Views/Configuracion/ModificarUsuario";
import { ListaUsuarios } from "../Views/Configuracion/ListaUsuarios";
import { AdministrarRoles } from "../Views/Configuracion/AdministrarRoles";
import { AgregarUsuario } from "../Views/Configuracion/AgregarUsuario";
import { Home } from "../Views/Home";
import { IndexScam3d } from "../Views/InformationLoad/sacm3d/IndexScam3d";
import Parametros from "../Views/Configuracion/Parametros";
import { ModificarEmpresa } from "../Views/Configuracion/Empresa/ModificarEmpresa";
import { CambiarContrasena } from "../Views/Auth/CambiarContrasena";

interface Route {
  path: string;
  exact?: boolean;
  component: JSX.Element;
  element?: string;
}

interface RouteGroup {
  prefix: string;
  routes?: Route[];
}

const routes: RouteGroup[] = [
  {
    prefix: "routes:meta.debug",
    routes: [],
  },
  {
    prefix: "routes:base.parameters",
    routes: [{ path: "routes:meta.base", component: <Parametros /> }],
  },
  {
    prefix: "routes:base.scam_3d",
    routes: [
      { path: "routes:meta.base", component: <IndexScam3d /> },
    ],
  },
  {
    prefix: "routes:base.root",
    routes: [
      { path: "routes:meta.base", component: <Home /> },
      { path: "routes:meta.not_found", component: <NotFound /> },
    ],
  },

  {
    prefix: "routes:base.roles",
    routes: [{ path: "routes:meta.base", component: <AdministrarRoles /> }],
  },
  {
    prefix: "routes:base.users",
    routes: [
      { path: "routes:meta.base", component: <ListaUsuarios /> },
      { path: "routes:meta.add", component: <AgregarUsuario /> },
      { path: "routes:meta.modify", component: <ModificarUsuario /> },
    ],
  },
  {
    prefix: "routes:base.company",
    routes: [
      { path: "routes:meta.base", component: <ModificarEmpresa /> },
    ],
  },
  {
    prefix: "routes:base.change_password",
    routes: [{ path: "routes:meta.base", component: <CambiarContrasena /> }]
  },
];

export default routes;
