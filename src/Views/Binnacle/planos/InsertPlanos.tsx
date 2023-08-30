import React, { useState } from 'react'
import { BaseContentView } from '../../Common/BaseContentView';
import { Button, Col, Modal } from 'react-bootstrap';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { EquipoTipo } from '../../../Data/Models/Equipo/Equipo';
import { JumpLabel } from '../../../Components/Common/JumpLabel';
import { $u } from '../../../Common/Utils/Reimports';
import InsertPlanoConjunto from '../insertBinnacle/InsertPlanoConjunto';
import InsertPlanoComponente from '../insertBinnacle/InsertPlanoComponente';
import { useShortModal } from '../../../Common/Hooks/useModal';
import FormPlano from '../../../Components/views/Home/Planos/FormPlano';
import { useReload } from '../../../Common/Hooks/useReload';

const InsertPlanos = () => {
  const modalNvoPlano = useShortModal();
  const [reloadTable, doReloadTable] = useReload();

  //States
  const [equipoSelected, setEquipoSelected] = useState<{
    id: string | undefined
    nombre: string | undefined
  }>({
    id: undefined,
    nombre: undefined
  })
  const [SubModuleSelected, setSubModuleSelected] = useState("planos_conjunto")

  const onFinishSavingPlano = () => {
    modalNvoPlano.hide()
    doReloadTable()
  }

  return (
    <BaseContentView title='Planos'>

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
      <Col sm={5} className="pt-3 col-sm-5 d-flex d-sm-flex justify-content-end align-items-center">
        <Button variant={"primary"} onClick={()=>{ modalNvoPlano.show()}}>
          <i className="fas fa-plus mr-3" /> {'Nuevo Plano'}
        </Button>
      </Col>

      {SubModuleSelected === "planos_conjunto" && (
        <InsertPlanoConjunto idEquipo={equipoSelected.id} reloadTable={reloadTable} doReloadTable={doReloadTable} />
      )}

      {SubModuleSelected === "planos_componentes" && (
        <InsertPlanoComponente idEquipo={equipoSelected.id} reloadTable={reloadTable} doReloadTable={doReloadTable}  />
      )}
      
      <Modal show={modalNvoPlano.visible} onHide={modalNvoPlano.hide}>
      <Modal.Header closeButton>
        <b>Agregar plano</b>
      </Modal.Header>
      <Modal.Body>
        <FormPlano 
          initialData={{equipo: equipoSelected.id, tipo_plano: SubModuleSelected}} 
          onFinishSaving={onFinishSavingPlano}
        />
      </Modal.Body>
    </Modal>

    </BaseContentView>
    
  )
}

export default InsertPlanos