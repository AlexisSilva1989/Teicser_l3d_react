import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useNavigation } from "../../../Common/Hooks/useNavigation";
import { Buttons } from "../../../Components/Common/Buttons";
import { LoadingSpinner } from "../../../Components/Common/LoadingSpinner";
import {
  extendColumnsAlarms,
  IAlarmsEquipment,
  IFormAlarmsEquipment,
} from "../../../Data/Models/Alarmas/AlarmsEquipments";
import { BaseContentView } from "../../Common/BaseContentView";
import FormAlarmEquipment from "../../../Components/views/Home/Alarmas/FormAlarmEquipment";

function EditAlarmasEquipo() {
  //hooks
  const { stateAs, goto } = useNavigation();
  const dataStateAs =
    stateAs<{ data: IFormAlarmsEquipment & extendColumnsAlarms }>();

  //states
  const [alarmsEquipment, setAlarmsEquipment] = useState<
    IFormAlarmsEquipment & extendColumnsAlarms
  >();
  const [isLoadModule, setIsLoadModule] = useState<boolean>(true);

  //effects
  useEffect(() => {
    setIsLoadModule(true);
    if (dataStateAs === undefined) {
      goto.absolute("base.equipments_alarms");
    } else {
      setAlarmsEquipment(dataStateAs.data);
    }
    setIsLoadModule(false);
  }, []);

  return (
    <BaseContentView title="Modificar alarma de equipo">
      {isLoadModule ? (
        <LoadingSpinner />
      ) : (
        <>
          <Col sm={12} className="mb-4">
            <Buttons.Back />
          </Col>
          <Col className="mb-3 p-0">
            <FormAlarmEquipment dataInitial={alarmsEquipment} isUpdate={true} />
          </Col>
        </>
      )}
    </BaseContentView>
  );
}

export default EditAlarmasEquipo;
