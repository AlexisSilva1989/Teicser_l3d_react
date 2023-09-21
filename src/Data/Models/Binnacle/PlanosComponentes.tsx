import React from "react";
import { ParamsColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";
import { Equipo } from "../Equipo/Equipo";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IComponente } from "../Componentes/Componentes";
import { $m } from "../../../Common/Utils/Reimports";
import { IFabricante } from "../Fabricantes/fabricantes";

export interface IPlanosComponentes {
  fecha_carga: string;
  pdf_name: string;
  crea_date: Date;
  equipo?: Equipo;
  componente?: IComponente;
  fabricante?: IFabricante;
  ruta: string;
  tag_plano_conjunto: string;
  id?: string;
}

export const IPlanosComponentesColumns: ParamsColumnsCallback<IPlanosComponentes> =
  (intl, params) => {
    return [
      {
        name: "Componente",
        width: "20%",
        selector: (row) => row.componente?.nombre as string,
      },
      {
        name: "Fabricante",
        width: "20%",
        selector: (row) => row.fabricante?.name as string,
      },
      {
        name: "Código",
        width: "20%",
        selector: (row) => row.componente?.codigo as string,
      },
      { name: "Plano", width: "26%", selector: (row) => row.pdf_name },
      {
        name: "Fecha de carga",
        width: "20%",
        selector: (row) => $m.utc(row.crea_date).format("YYYY-MM-DD"),
      },
      {
        name: "Ver",
        center: true,
        width: "7%",
        cell: (plano) => (
          <>
            <div className="col-6 font-size-18 text-center">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={"tooltip-ver"}> Ver en pestaña nueva </Tooltip>
                }
              >
                <i
                  className="fas fa-file-pdf"
                  style={{ cursor: "pointer", color: "#09922C" }}
                  onClick={() => {
                    params.verPDF(plano.ruta);
                  }}
                />
              </OverlayTrigger>
            </div>
          </>
        ),
      },
      {
        name: "Eliminar",
        center: true,
        width: "7%",
        cell: (plano) => (
          <>
            <div className="col-6 font-size-18 text-center">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={"tooltip-delete"}> Eliminar </Tooltip>}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ cursor: "pointer", color: "#F44D5F" }}
                  onClick={() => {
                    params.deletePdf(plano.pdf_name, plano.id);
                  }}
                />
              </OverlayTrigger>
            </div>
          </>
        ),
      },
    ];
  };

export const IPlanosComponentesColumnView: ParamsColumnsCallback<IPlanosComponentes> =
  (intl, params) => {
    return [
      {
        name: "Componente",
        width: "20%",
        selector: (row) => row.componente?.nombre as string,
      },
      {
        name: "Fabricante",
        width: "20%",
        selector: (row) => row.fabricante?.name as string,
      },
      {
        name: "Código",
        width: "20%",
        selector: (row) => row.componente?.codigo as string,
      },
      { name: "Plano", width: "30%", selector: (row) => row.pdf_name },
      {
        name: "Última actualización",
        width: "20%",
        selector: (row) => $m.utc(row.crea_date).format("YYYY-MM-DD"),
        center: true,
      },
      {
        name: "Ver",
        center: true,
        width: "10%",
        cell: (plano) => (
          <>
            <div className="col-6 font-size-18 text-center">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={"tooltip-ver"}> Ver en pestaña nueva </Tooltip>
                }
              >
                <i
                  className="fas fa-file-pdf"
                  style={{ cursor: "pointer", color: "#09922C" }}
                  onClick={() => {
                    params.verPDF(plano.ruta);
                  }}
                />
              </OverlayTrigger>
            </div>
          </>
        ),
      },
    ];
  };
