import React from 'react'
import { Col } from 'react-bootstrap'
import { Buttons } from '../../../Components/Common/Buttons'
import { BaseContentView } from '../../Common/BaseContentView'
import FormAlarmEquipment from '../../../Components/views/Home/Alarmas/FormAlarmEquipment'

function AddAlarmasEquipo() {
  return (<BaseContentView title="Agregar alarma de equipo">
    <Col sm={12} className="mb-4">
      <Buttons.Back />
    </Col>
    <Col sm={12} className="p-0">
      <FormAlarmEquipment />
    </Col>
  </BaseContentView>)
}

export default AddAlarmasEquipo