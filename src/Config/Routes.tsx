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
import { ListaEquipos } from "../Views/Masters/Equipos/ListaEquipos";
import { AddEquipo } from "../Views/Masters/Equipos/AddEquipo";
import { EditEquipo } from "../Views/Masters/Equipos/EditEquipo";
import { ListaServidores } from "../Views/Masters/Servidores/ListaServidores";
import { AddServidores } from "../Views/Masters/Servidores/AddServidores";
import { EditServidores } from "../Views/Masters/Servidores/EditServidores";
import { ListaComponentes } from "../Views/Masters/Componentes/ListaComponentes";
import { AddComponentes } from "../Views/Masters/Componentes/AddComponentes";
import { EditComponentes } from "../Views/Masters/Componentes/EditComponentes";
import { EditEntrenamiento } from "../Views/Masters/Entrenamiento/EditEntrenamiento";
import { AddEntrenamiento } from "../Views/Masters/Entrenamiento/AddEntrenamiento";
import { ListaEntrenamiento } from "../Views/Masters/Entrenamiento/ListaEntrenamiento";
import { ListSimulacion } from "../Views/Reports/Simulacion/ListSimulacion";
import ListSimulationSummary from "../Views/Reports/SimulationSummary/ListSimulationSummary";
import ShowSimulationSummary from "../Views/Reports/SimulationSummary/ShowSimulationSummary";
import ListaAlarmasEquipos from "../Views/Masters/Alarms/ListaAlarmasEquipos";
import AddAlarmasEquipo from "../Views/Masters/Alarms/AddAlarmasEquipo";
import EditAlarmasEquipo from "../Views/Masters/Alarms/EditAlarmasEquipo";
import ListTonelajeRevestimiento from "../Views/Masters/TonelajeRevestimiento/ListTonelajeRevestimiento";
import DatosOperativos from "../Views/Masters/DatosOperativos/DatosOperativos";
import Projections from "../Views/Projections/Projections";
import ListaFabricantes from "../Views/Masters/Fabricantes/ListaFabricantes";
import AddFabricante from "../Views/Masters/Fabricantes/AddFabricante";
import EditFabricante from "../Views/Masters/Fabricantes/EditFabricante";
import DashboardPlano from "../Views/Binnacle/planos/DashboardPlano";
import InsertPlanos from "../Views/Binnacle/planos/InsertPlanos";


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
      { path: "routes:meta.details", component: <ShowProjection /> },
      { path: "/:data_select?", component: <ShowProjection /> },
    ],
  },
  {
    prefix: "routes:base.simulation_days",
    routes: [
      { path: "routes:meta.base", component: <ListSimulacion /> },
      { path: "routes:meta.modify", component: <SimulacionDias /> },
      { path: "routes:meta.details", component: <SimulacionDias /> },
      { path: "/:data_select?", component: <SimulacionDias /> },

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
  {
    prefix: "routes:base.equipment",
    routes: [
      { path: "routes:meta.base", component: <ListaEquipos /> },
      { path: "routes:meta.add", component: <AddEquipo /> },
      { path: "routes:meta.modify", component: <EditEquipo /> },
    ],
  },
  {
    prefix: "routes:base.manufacturers",
    routes: [
      { path: "routes:meta.base", component: <ListaFabricantes /> },
      { path: "routes:meta.add", component: <AddFabricante /> },
      { path: "routes:meta.modify", component: <EditFabricante /> },
    ],
  },
  {
    prefix: "routes:base.equipments_alarms",
    routes: [
      { path: "routes:meta.base", component: <ListaAlarmasEquipos /> },
      { path: "routes:meta.add", component: <AddAlarmasEquipo /> },
      { path: "routes:meta.modify", component: <EditAlarmasEquipo /> },
    ],
  },
  {
    prefix: "routes:base.component",
    routes: [
      { path: "routes:meta.base", component: <ListaComponentes /> },
      { path: "routes:meta.add", component: <AddComponentes /> },
      { path: "routes:meta.modify", component: <EditComponentes /> },
    ],
  },
  {
    prefix: "routes:base.training",
    routes: [
      { path: "routes:meta.base", component: <ListaEntrenamiento /> },
      { path: "routes:meta.add", component: <AddEntrenamiento /> },
      { path: "routes:meta.modify", component: <EditEntrenamiento /> },
    ],
  },
  {
    prefix: "routes:base.site_servers",
    routes: [
      { path: "routes:meta.base", component: <ListaServidores /> },
      { path: "routes:meta.add", component: <AddServidores /> },
      { path: "routes:meta.modify", component: <EditServidores /> },
    ],
  },
  {
    prefix: "routes:base.summary_projection",
    routes: [
      { path: "routes:meta.base", component: <ListSimulationSummary /> },
      { path: "routes:meta.details", component: <ShowSimulationSummary /> },
    ],
  },
  {
    prefix: "routes:base.data_tdr",
    routes: [
      { path: "routes:meta.base", component: <ListTonelajeRevestimiento /> },
    ],
  },
  {
    prefix: "routes:base.data_op",
    routes: [
      { path: "routes:meta.base", component: <DatosOperativos /> },
    ],
  },
  {
    prefix: "routes:base.projections",
    routes: [
      { path: "routes:meta.base", component: <Projections /> },
    ],
  },
  {
    prefix: "routes:base.insert_binnacle",
    routes: [
      { path: "routes:meta.base", component: <InsertPlanos /> },
    ],
  },
  {
    prefix: "routes:base.time_line_binnacle",
    routes: [
      { path: "routes:meta.base", component: <DashboardPlano /> },
    ],
  },
];

export default routes;
