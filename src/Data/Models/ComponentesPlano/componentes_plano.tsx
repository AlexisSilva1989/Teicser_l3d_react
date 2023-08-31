import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { Utils } from "../../../Common/Utils/Utils";

export interface IComponentesPlano {
  id: string
  name: string
  status: string
}

export const ComponentesPlanoColumns: (intl: IntlShape) => IDataTableColumn<IComponentesPlano>[] = (intl) => {
  const header = Utils.capitalize(intl);
  return [
    {
      selector: 'nombre',
      name: header('columns:name'),
    },
    {
      selector: 'activo',
      name: header('columns:active'),
      format: (plano) => header(plano.status ? 'labels:common.yes' : 'labels:common.no')
    }
  ];
};

export interface IDataFormComponentesPlano {
  id?: string
  nombre: string
  status?: string
}