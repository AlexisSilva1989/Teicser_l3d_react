import React from "react";
import { NotFound } from "../Views/NotFound";
import { ModificarUsuario } from "../Views/Configuracion/ModificarUsuario";
import { ListaUsuarios } from "../Views/Configuracion/ListaUsuarios";
import { AdministrarRoles } from "../Views/Configuracion/AdministrarRoles";
import { AgregarUsuario } from "../Views/Configuracion/AgregarUsuario";
import { Home } from "../Views/Home";
import { IndexScam3d } from "../Views/InformationLoad/sacm3d/IndexScam3d";
import { IndexCalibration } from "../Views/InformationLoad/Calibration/IndexCalibration";

import { IndexInformation } from "../Views/Reports/Information/IndexInformation";
import { IndexRecords } from "../Views/Reports/Records/IndexRecords";
import { IndexMeasurement } from "../Views/Reports/Measurement/IndexMeasurement";
import { AddProjection } from "../Views/Reports/Projection/AddProjection";

import Parametros from "../Views/Configuracion/Parametros";
import { ModificarEmpresa } from "../Views/Configuracion/Empresa/ModificarEmpresa";
import { CambiarContrasena } from "../Views/Auth/CambiarContrasena";
import SimulacionDias from "../Views/Reports/Simulacion/SimulacionDias";

import { IndexReportsPdf } from "../Views/Reports/Reports_pdf/IndexReportsPdf";
import { IndexDownloadableReport } from "../Views/Reports/DownloadableReport/IndexDownloadableReport";

import { IndexOperationalData } from "../Views/InformationLoad/OperationalData/IndexOperationalData";
import { IndexImagenCondicion } from "../Views/InformationLoad/ImagenCondicion/IndexImagenCondicion";
import { ListProjection } from "../Views/Reports/Projection/ListProjection";
import ShowProjection from "../Views/Reports/Projection/ShowProjection";


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
    prefix: "routes:base.calibration",
    routes: [
      { path: "routes:meta.base", component: <IndexCalibration /> },
    ],
  },
  {
    prefix: "routes:base.operational_data",
    routes: [
      { path: "routes:meta.base", component: <IndexOperationalData /> },
    ],
  },
  {
    prefix: "routes:base.image_condicion",
    routes: [
      { path: "routes:meta.base", component: <IndexImagenCondicion /> },
    ],
  },
  {
    prefix: "routes:base.information",
    routes: [
      { path: "routes:meta.base", component: <IndexInformation /> },
    ],
  },
  {
    prefix: "routes:base.records",
    routes: [
      { path: "routes:meta.base", component: <IndexRecords /> },
    ],
  },
  {
    prefix: "routes:base.reports_pdf",
    routes: [
      { path: "routes:meta.base", component: <IndexReportsPdf /> },
    ],
  },
  {
    prefix: "routes:base.downloadable_report",
    routes: [
      { path: "routes:meta.base", component: <IndexDownloadableReport /> },
    ],
  },
  {
    prefix: "routes:base.measurement",
    routes: [
      { path: "routes:meta.base", component: <IndexMeasurement /> },
    ],
  },
  {
    prefix: "routes:base.measurement",
    routes: [
      { path: "routes:meta.base", component: <IndexMeasurement /> },
    ],
  },
  {
    prefix: "routes:base.projection",
    routes: [
      { path: "routes:meta.base", component: <ListProjection /> },
      { path: "routes:meta.add", component: <AddProjection /> },
      { path: "routes:meta.modify", component: <ShowProjection /> },
    ],
  },
  {
    prefix: "routes:base.simulation_days",
    routes: [
      { path: "routes:meta.base", component: <SimulacionDias /> },
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
