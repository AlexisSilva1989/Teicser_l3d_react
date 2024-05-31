import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { Utils } from "../../../Common/Utils/Utils";

export interface Fabricante {
  id: string;
  name: string;
  status: string;
}

export const FabricanteColumns: (
  intl: IntlShape
) => IDataTableColumn<Fabricante>[] = (intl) => {
  const header = Utils.capitalize(intl);
  return [
    {
      selector: "name",
      name: header("columns:name"),
    },
    {
      selector: "activo",
      name: header("columns:active"),
      format: (equipo) =>
        header(equipo.status ? "labels:common.yes" : "labels:common.no"),
    },
  ];
};

export interface IDataFormFabricante {
  id?: string;
  name: string;
  status?: string;
  components_selected?: string[];
}
