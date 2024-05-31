import React, { useCallback, useState } from "react";
import { Col } from "react-bootstrap";
import { $u } from "../../../Common/Utils/Reimports";
import { CustomSelect } from "../../../Components/Forms/CustomSelect";
import {
  AlarmsEquipmentColumns,
  extendColumnsAlarms,
  IFormAlarmsEquipment,
} from "../../../Data/Models/Alarmas/AlarmsEquipments";
import { ListaBase } from "../../Common/ListaBase";

function ListaAlarmasEquipos() {
  const [filter, setFilter] = useState<{ active: string }>({
    active: "-1",
  });

  const customFilter = useCallback(
    (equipo: IFormAlarmsEquipment): boolean => {
      if (filter.active === "-1") {
        return true;
      }

      if (equipo.is_active === true && filter.active === "1") {
        return true;
      }

      return !equipo.is_active && filter.active === "0";
    },
    [filter]
  );

  return (
    <>
      <ListaBase<IFormAlarmsEquipment & extendColumnsAlarms>
        title="titles:alarms_equipments"
        source={"equipments_alarms/list"}
        permission="masters"
        columns={AlarmsEquipmentColumns}
        customFilter={customFilter}
      >
        <Col>
          <br className="mb-2" />

          <CustomSelect
            preSelect={filter.active}
            onChange={(e) => {
              setFilter((s) => $u(s, { active: { $set: e.value } }));
            }}
            options={[
              { label: "labels:common.all", value: "-1" },
              { label: "labels:active", value: "1" },
              { label: "labels:inactive", value: "0" },
            ]}
          />
        </Col>
      </ListaBase>
    </>
  );
}

export default ListaAlarmasEquipos;
