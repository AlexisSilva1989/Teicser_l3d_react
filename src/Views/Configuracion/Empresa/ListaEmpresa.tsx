import { ListaBase } from "../../Common/ListaBase";
import React from "react";
import { $j } from "../../../Common/Utils/Reimports";
import {
  Empresa,
  EmpresaColumns,
} from "../../../Data/Models/Configuracion/Empresa";

export const ListaEmpresa = () => {
  return (
    <ListaBase<Empresa>
      title="titles:company"
      source={$j("empresa")}
      permission="configuration"
      columns={EmpresaColumns}
    />
  );
};
