import { ParamsColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";
import { UbicacionComponentesPlano } from "../ComponentesPlano/componentes_plano";
import { Equipo } from "../Equipo/Equipo";
import { Fabricante } from "../Fabricante/Fabricante";

export interface IBitacoraComponentes {
  ubicacion_id?: string;
  fabricante_id?: string;
  equipo_id?: string;
  nombre: string;
  std_job: string;
}

export interface BitacoraComponentesForm extends IBitacoraComponentes {
  id: string;
  status?: string;
}

export interface BitacoraComponentesColumns extends IBitacoraComponentes {
  id: string;
  status: string;
  equipo?: Equipo;
  fabricante?: Fabricante;
  ubicacion?: UbicacionComponentesPlano;
}

export const IBitacoraComponentesColumns: ParamsColumnsCallback<BitacoraComponentesColumns> =
  (intl, params) => {
    return [
      {
        name: "Componente",
        width: "20%",
        selector: (row) => row.nombre as string,
      },
      {
        name: "Ubicación",
        width: "20%",
        selector: (row) => row?.ubicacion?.nombre as string,
      },
      {
        name: "Equipo",
        width: "20%",
        selector: (row) => row?.equipo?.nombre as string,
      },
      {
        name: "Fabricante",
        width: "20%",
        selector: (row: any) => row?.fabricante?.nombre as string,
      },
      // {
      //   name: "Ver",
      //   center: true,
      //   width: "7%",
      //   cell: (plano) => (
      //     <>
      //       <div className="col-6 font-size-18 text-center">
      //         <OverlayTrigger
      //           placement="top"
      //           overlay={
      //             <Tooltip id={"tooltip-ver"}> Ver en pestaña nueva </Tooltip>
      //           }
      //         >
      //           <i
      //             className="fas fa-file-pdf"
      //             style={{ cursor: "pointer", color: "#09922C" }}
      //             onClick={() => {
      //               params.verPDF(plano.ruta);
      //             }}
      //           />
      //         </OverlayTrigger>
      //       </div>
      //     </>
      //   ),
      // },
      // {
      //   name: "Eliminar",
      //   center: true,
      //   width: "7%",
      //   cell: (plano) => (
      //     <>
      //       <div className="col-6 font-size-18 text-center">
      //         <OverlayTrigger
      //           placement="top"
      //           overlay={<Tooltip id={"tooltip-delete"}> Eliminar </Tooltip>}
      //         >
      //           <i
      //             className="fas fa-times-circle"
      //             style={{ cursor: "pointer", color: "#F44D5F" }}
      //             // onClick={() => {
      //             //   params.deletePdf(plano.pdf_name, plano.id);
      //             // }}
      //           />
      //         </OverlayTrigger>
      //       </div>
      //     </>
      //   ),
      // },
    ];
  };
