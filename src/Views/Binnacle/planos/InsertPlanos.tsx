import React, { useState } from 'react'
import { BaseContentView } from '../../Common/BaseContentView';
import { Button, Col } from 'react-bootstrap';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { EquipoTipo } from '../../../Data/Models/Equipo/Equipo';
import { JumpLabel } from '../../../Components/Common/JumpLabel';
import { $u } from '../../../Common/Utils/Reimports';
import InsertPlanoConjunto from '../insertBinnacle/InsertPlanoConjunto';
import InsertPlanoComponente from '../insertBinnacle/InsertPlanoComponente';
import TimeLineTest from '../timeLine/TimeLineTest';

const InsertPlanos = () => {
  const [equipoSelected, setEquipoSelected] = useState<{
    id: string | undefined
    nombre: string | undefined
  }>({
    id: undefined,
    nombre: undefined
  })

  const [SubModuleSelected, setSubModuleSelected] = useState("time_line")


  return (
    <BaseContentView title='Ingresar datos de bitácora'>
      
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
      <Col sm={2} className="pt-2">
        <JumpLabel />
        <Button variant="outline-primary"
          disabled={SubModuleSelected === "planos_conjunto"}
          onClick={() => { setSubModuleSelected("planos_conjunto") }}
          className='btn-outline-primary w-100 d-flex justify-content-center align-items-center'>
          <span className='mx-2' >Planos de conjunto</span>
        </Button>
      </Col>
      <Col sm={2} className="pt-2">
        <JumpLabel />
        <Button variant="outline-primary"
          disabled={SubModuleSelected === "planos_componentes"}
          onClick={() => { setSubModuleSelected("planos_componentes") }}
          className='btn-outline-primary w-100 d-flex justify-content-center align-items-center'>
          <span className='mx-2' >Planos de componentes</span>
        </Button>
      </Col>

      {SubModuleSelected === "time_line" && (<TimeLineTest />) }
      {SubModuleSelected === "planos_conjunto" && (<InsertPlanoConjunto idEquipo={equipoSelected.id}/>) }
      {SubModuleSelected === "planos_componentes" && (<InsertPlanoComponente idEquipo={equipoSelected.id}/>) }
    </BaseContentView>
  )
}

export default InsertPlanos