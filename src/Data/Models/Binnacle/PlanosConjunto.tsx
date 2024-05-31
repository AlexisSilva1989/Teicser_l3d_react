import React from "react";
import { ParamsColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";
import { Equipo } from "../Equipo/Equipo";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { $m } from "../../../Common/Utils/Reimports";

export interface IPlanosConjunto {
  fecha_carga: string;
  pdf_name: string;
  crea_date: Date;
  equipo?: Equipo;
  ruta: string;
  id?: string;
}

export const IPlanosConjuntosColumns: ParamsColumnsCallback<IPlanosConjunto> = (
  intl,
  params
) => {
  return [
    {
      name: "Equipo",
      width: "20%",
      selector: (row) => (row.equipo?.nombre as string).toUpperCase(),
    },
    { name: "Plano", width: "45%", selector: (row) => row.pdf_name },
    {
      name: "Fecha de carga",
      width: "20%",
      selector: (row) => $m.utc(row.crea_date).format("YYYY-MM-DD"),
    },
    {
      name: "Ver",
      center: true,
      width: "5%",
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
      width: "5%",
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
