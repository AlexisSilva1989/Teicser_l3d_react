import { ParamsColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";

export interface ITypeEvents {
  nombre: string;
  jerarquia: string;
}

export interface TypeEventsForm extends ITypeEvents {
  id: string;
  status?: string;
}

export interface TypeEventsColumns extends ITypeEvents {
  id: string;
  status: string;
}

export const ITypeEventsColumns: ParamsColumnsCallback<TypeEventsColumns> = (
  intl,
  params
) => {
  return [
    {
      name: "Componente",
      selector: (row) => row.nombre as string,
    },
    {
      name: "Jerarquía",
      selector: (row) => row?.jerarquia as string,
    },
  ];
};
