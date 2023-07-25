import { ParamsColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";

export interface IPlanosAntiguos {
  equipo: string
  fecha_carga: string
  pdf_name: string
}

export const IPlanosAntiguosColumns: ParamsColumnsCallback<IPlanosAntiguos> = (intl,params) => {
  return [
    { name: 'Equipo', selector: (row) => (row.pdf_name).toUpperCase() },
    { name: 'Fecha de carga', selector: (row) => row.pdf_name },
    {
      name: 'Descargar',
      center: true,
      // cell: excel => (
      //   <>
      //     <div className="col-6 font-size-18 text-center">
      //       <OverlayTrigger placement="top"
      //         overlay={ <Tooltip id={"tooltip-descargar"}> Descargar </Tooltip> }
      //       >
      //         <i className="fas fa-file-pdf" style={{ cursor: "pointer", color: "#09922C" }}
      //           onClick={() => {
      //             params.onClickExcel(excel.tag_data_leak)
      //           }}
      //         />
      //       </OverlayTrigger>
      //     </div>
      //   </>
      // )
    }
  ];
};