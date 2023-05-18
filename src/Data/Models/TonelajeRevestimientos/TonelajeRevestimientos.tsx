import React from 'react'
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ParamsColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";

export interface ITonelajeRevestimientosTable {
  nombre: string
  tag_data_leak: Date
}

export const TonelajeRevestimientosColumns: ParamsColumnsCallback<ITonelajeRevestimientosTable> = (intl,params) => {
  return [
    { name: 'Equipo', selector: (row) => (row.nombre).toUpperCase() },
    // { name: 'Último registro', selector: (row) => row.lastData },
    {
      name: 'Descargar',
      center: true,
      cell: excel => (
        <>
          <div className="col-6 font-size-18 text-center">
            <OverlayTrigger placement="top"
              overlay={ <Tooltip id={"tooltip-descargar"}> Descargar </Tooltip> }
            >
              <i className="fas fa-file-pdf" style={{ cursor: "pointer", color: "#09922C" }}
                onClick={() => {
                  params.onClickExcel(excel.tag_data_leak)
                }}
              />
            </OverlayTrigger>
          </div>
        </>
      )
    }
  ];
};