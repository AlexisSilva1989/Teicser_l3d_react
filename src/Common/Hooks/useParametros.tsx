import { useEffect, useState } from "react";
import { useApi } from "../Hooks/useApi";
import moment from "moment";

export const useParametros = () => {
  const api = useApi();
  useEffect(() => {
    async function feat() {
      api
        .get<any>("v2/parametros")
        .success((e) => {
          e.filter((x: any) => x.nombre === "PARAM_FILTER_DATA").map(
            (parametro: any) => {
              localStorage.setItem(
                "dateFrom",
                moment()
                  .subtract(parametro.valor, "months")
                  .format("DD-MM-YYYY")
              );
              localStorage.setItem("dateTo", moment().format("DD-MM-YYYY"));
            }
          );
          e.filter((x: any) => x.nombre === "VALOR_IMP").map(
            (parametro: any) => {
              localStorage.setItem("impuesto", parametro.valor);
            }
          );
        })
        .fail("base.load");
    }
    feat();
  }, []);
  return [];
};
