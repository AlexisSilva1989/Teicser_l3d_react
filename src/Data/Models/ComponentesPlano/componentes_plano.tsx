import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { Utils } from "../../../Common/Utils/Utils";

export interface IComponentesPlano {
  id: string;
  name: string;
  location: string;
  status: string;
  codigo?: string;
}

export const ComponentesPlanoColumns: (
  intl: IntlShape
) => IDataTableColumn<IComponentesPlano>[] = (intl) => {
  const header = Utils.capitalize(intl);
  return [
    {
      selector: "nombre",
      name: header("columns:name"),
    },
    {
      name: "Código",
      selector: (row) => row?.codigo as string,
    },
    {
      selector: "activo",
      name: header("columns:active"),
      format: (plano) =>
        header(plano.status ? "labels:common.yes" : "labels:common.no"),
    },
  ];
};

export interface UbicacionComponentesPlano {
  id: number;
  nombre: string;
}

export interface IDataColumnComponentesPlano
  extends Omit<IComponentesPlano, "location" | "name"> {
  ubicacion: UbicacionComponentesPlano;
  nombre: string;
}

export interface IDataFormComponentesPlano {
  id?: string;
  nombre: string;
  ubicacion: number;
  status?: string;
  codigo?: string;
}
