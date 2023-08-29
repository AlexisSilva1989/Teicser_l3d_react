import React, { useState } from 'react'
import { BaseContentView } from '../../Common/BaseContentView'
import { Button, Col } from 'react-bootstrap';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { EquipoTipo } from '../../../Data/Models/Equipo/Equipo';
import { $u } from '../../../Common/Utils/Reimports';
import { JumpLabel } from '../../../Components/Common/JumpLabel';
import PlanosAntiguos from './PlanosAntiguos';
import PlanosActuales from './PlanosActuales';


const DashboardPlano = () => {

  const [equipoSelected, setEquipoSelected] = useState<{
    id: string | undefined
    nombre: string | undefined
  }>({
    id: undefined,
    nombre: undefined
  })

  const [SubModuleSelected, setSubModuleSelected] = useState("planos_actuales")

  return (<>
    <BaseContentView title='Bitácora'>
      <Col md={3}>
        <ApiSelect<EquipoTipo>
          label='Equipo'
          name='equipo_select'
          placeholder='Seleccione equipo'
          source={'service_render/equipos'}
          value={equipoSelected.id}
          selector={(option: EquipoTipo) => {
            return { label: option.nombre, value: option.id.toString(), tipo: option.equipo_tipo.nombre_corto };
          }}
          valueInObject={true}
          onChange={(data) => {
            setEquipoSelected(state => $u(state, {
              id: { $set: data.value },
              nombre: { $set: data.label }
            }))
          }}
        />
      </Col>
      {/* <Col sm={2} className="pt-2">
        <JumpLabel />
        <Button variant="outline-primary"
          disabled={SubModuleSelected === "time_line"}
          onClick={() => { setSubModuleSelected("time_line") }}
          className='btn-outline-primary w-100 d-flex justify-content-center align-items-center'>
          <span className='mx-2' >Time line</span>
        </Button>
      </Col> */}
      <Col sm={1} className="pt-2">
        <JumpLabel />
        <Button variant="outline-primary"
          disabled={SubModuleSelected === "planos_actuales"}
          onClick={() => { setSubModuleSelected("planos_actuales") }}
          className='btn-outline-primary w-100 d-flex justify-content-center align-items-center'>
          <span className='mx-2' >Planos</span>
        </Button>
      </Col>
      <Col sm={2} className="pt-2">
        <JumpLabel />
        <Button variant="outline-primary"
          disabled={SubModuleSelected === "planos_antiguos"}
          onClick={() => { setSubModuleSelected("planos_antiguos") }}
          className='btn-outline-primary w-100 d-flex justify-content-center align-items-center'>
          <span className='mx-2' >Planos antiguos</span>
        </Button>
      </Col>

      {/* <Col sm={12} hidden={SubModuleSelected !== "time_line"}>
        "agregar modulo time line"
      </Col> */}

      {SubModuleSelected === "planos_actuales" && (<PlanosActuales idEquipo={equipoSelected.id}/>) }
      {SubModuleSelected === "planos_antiguos" && (<PlanosAntiguos idEquipo={equipoSelected.id}/>) }
    </BaseContentView>
  </>)
}

export default DashboardPlano