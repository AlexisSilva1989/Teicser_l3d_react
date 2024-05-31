import React, { useState, useCallback } from "react";
import { $j, $u } from "../../../Common/Utils/Reimports";
import { CustomSelect } from "../../../Components/Forms/CustomSelect";
import { ListaBase } from "../../Common/ListaBase";
import {
  Servidor,
  ServidorColumns,
} from "../../../Data/Models/Servidor/Servidor";

export const ListaServidores = () => {
  const [filter, setFilter] = useState<{ status: string }>({ status: "-1" });

  const customFilter = useCallback(
    (server: Servidor): boolean => {
      return filter.status == "-1" || server.status.toString() == filter.status;
    },
    [filter]
  );

  return (
    <>
      <ListaBase<Servidor>
        title="servidores"
        source={$j("service_render/servidores")}
        permission="masters"
        columns={ServidorColumns}
        customFilter={customFilter}
      >
        <CustomSelect
          label="Activo"
          preSelect={filter.status}
          onChange={(e) => {
            const val = e.value;
            setFilter((s) => $u(s, { status: { $set: val } }));
          }}
          options={[
            {
              label: "labels:common.all",
              value: "-1",
            },
            {
              label: "labels:common.yes",
              value: "1",
            },
            {
              label: "labels:common.no",
              value: "0",
            },
          ]}
        />
      </ListaBase>
    </>
  );
};
