import { IntlShape } from "react-intl";
import { IDataTableColumn } from "react-data-table-component";
import { Utils } from "../../../Common/Utils/Utils";

export interface Empresa {
  nombre_sistema: string;
  rut: string;
  nombre: string;
  id_industria: string;
  direccion: string;
  telefono?: string;
  email?: string;
  web?: string;
  logo: string;
  imagen_principal: string;
  status: boolean;
  id: number;
}

export const EmpresaColumns: (intl: IntlShape) => IDataTableColumn<Empresa>[] =
  (intl) => {
    const header = Utils.capitalize(intl);
    return [
      {
        name: header("columns:rut"),
        selector: (x) => x.rut,
        wrap: true,
      },
      {
        name: header("columns:empresa"),
        selector: (x) => x.nombre,
        wrap: true,
      },
      {
        name: header("columns:direccion"),
        selector: (x) => x.direccion,
        wrap: true,
      },
      {
        name: header("columns:email"),
        selector: (x) => x.email,
        wrap: true,
      },
      {
        name: header("columns:telefono"),
        selector: (x) => x.telefono,
        wrap: true,
      },
      {
        name: header("columns:status"),
        selector: (x) => x.status,
        wrap: true,
      },
    ];
  };
