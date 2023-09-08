import { IntlShape } from "react-intl";
import { ParamsColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";
import { IDataTableColumn } from "react-data-table-component";
import { Utils } from "../../../Common/Utils/Utils";
import { Attachment } from "../Common/general";
import { OptionType } from "../../../Components/Api/ApiSelect";

export interface IPlanosAntiguos {
  equipo: string;
  fecha_carga: string;
  pdf_name: string;
}

export const IPlanosAntiguosColumns: ParamsColumnsCallback<IPlanosAntiguos> = (
  intl,
  params
) => {
  return [
    { name: "Equipo", selector: (row) => row.pdf_name.toUpperCase() },
    { name: "Fecha de carga", selector: (row) => row.pdf_name },
    {
      name: "Descargar",
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
    },
  ];
};

export interface ComponenteBitacora {
  id: number;
  has_all_parts: boolean;
  part_number?: string;
}

export interface IBitacora {
  id: number;
  title: string;
  type: number;
  date: string;
  equipment: number;
  location: OptionType[];
  components: ComponenteBitacora[];
  description?: string;
  status?: number;
}

export interface IDataFormBitacora extends IBitacora {
  files?: Partial<Attachment>[];
}

export interface EventType {
  id: number;
  name: string;
}
export interface EventLocation {
  id: number;
  nombre: string;
}
export interface EventEquipment {
  id: number;
  name: string;
}

export interface IColumnasBitacora
  extends Omit<IBitacora, "type" | "equipment" | "location"> {
  type: EventType;
  location: OptionType[];
  equipment: EventEquipment;
  files?: Partial<Attachment>[];
}

export const BitacoraColumns = (
  appendColumns: IDataTableColumn<IColumnasBitacora>[]
) => {
  const columns: (intl: IntlShape) => IDataTableColumn<IColumnasBitacora>[] = (
    intl
  ) => {
    const header = Utils.capitalize(intl);
    return [
      {
        selector: "title",
        name: header("columns:title"),
      },
      {
        selector: "type.name",
        name: header("columns:event_type"),
      },
      {
        selector: "date",
        name: header("columns:event_date"),
      },
      {
        selector: "equipment.name",
        name: header("columns:equipo"),
      },
      // {
      //   selector: "location.name",
      //   name: header("columns:location"),
      // },
      ...appendColumns,
    ];
  };
  return columns;
};
