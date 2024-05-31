import { ColumnsPipe } from "../Common/Utils/LocalizedColumnsCallback";

export interface Parametro {
  id: number;
  nombre: string;
  descripcion: string;
  valor: string;
  orden: number;
  categoria: string;
  tipoDato: string;
}

export const ParametroColumns: ColumnsPipe<Parametro> = (caps) => [
  //{ name: 'name', selector: parametro => parametro.nombre },
  {
    name: "description",
    selector: (parametro) => parametro.descripcion,
    width: "80%",
  },
  {
    name: "value",
    selector: (parametro) =>
      parametro.tipoDato === "boolean"
        ? caps(
            parametro.valor === "true"
              ? "labels:common.yes"
              : "labels:common.no"
          )
        : parametro.valor,
    width: "20%",
  },
];
