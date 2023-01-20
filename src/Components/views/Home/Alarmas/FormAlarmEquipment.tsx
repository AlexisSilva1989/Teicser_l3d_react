import React, { useEffect, useState } from 'react'
import { Col, Form } from 'react-bootstrap'
import { Controller, ErrorMessage, useForm } from 'react-hook-form'
import { useFullIntl } from '../../../../Common/Hooks/useFullIntl'
import { ApiSelect } from '../../../Api/ApiSelect'
import { Buttons } from '../../../Common/Buttons'
import * as yup from 'yup'
import { $u } from '../../../../Common/Utils/Reimports'
import DualListBox, { Option } from 'react-dual-listbox'
import { useCommonRoutes } from '../../../../Common/Hooks/useCommonRoutes'
import { extendColumnsAlarms, IAlarmsTypes, IFormAlarmsEquipment } from '../../../../Data/Models/Alarmas/AlarmsEquipments'
import DualListLang from '../../../../Data/Models/Common/DualListLang'
import { AxiosError } from 'axios'
import { ax } from '../../../../Common/Utils/AxiosCustom'
import { useToasts } from 'react-toast-notifications'

interface IFormAlarmEquipment {
  dataInitial?: IFormAlarmsEquipment & extendColumnsAlarms
  isUpdate?: boolean
}

function FormAlarmEquipment({ dataInitial, isUpdate }: IFormAlarmEquipment) {

  //hooks
  const { capitalize: caps } = useFullIntl()
  const { goBack } = useCommonRoutes()
  const { addToast } = useToasts();

  //states
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [notyfiableUsers, setNotyfiableUsers] = useState<Option<unknown>[]>([])
  const [notyfiableUsersSelected, setNotyfiableUsersSelected] = useState<string[] | undefined>([])
  const [activeAlarms, setActiveAlarms] = useState<IAlarmsTypes>({
    critical_point: { isActive: false, value: null },
  })
  const [isReadyUsersNotifiable, setIsReadyUsersNotifiable] = useState<boolean>(false)

  //SCHEMA
  const FormAlarmEquipmentSchema = yup.object().shape({
    id_equipment: yup.number().required(caps('validations:required')),
    notify_users: yup.array().required('Seleccione almenos un (1) usuario a notificar')
  })

  //FORM
  const { 
    handleSubmit, register, errors, control, watch, setValue 
  } = useForm<IFormAlarmsEquipment>({
    mode: 'onSubmit',
    submitFocusError: true,
    validationSchema: FormAlarmEquipmentSchema,
  })

  //HANDLES
  const onSubmit = async (data: IFormAlarmsEquipment) => {
    setIsSaving(true)
    isUpdate ? await updateAlarmsEquipment(data) : await postAlarmsEquipment(data) 
  }

  const postAlarmsEquipment = (data: IFormAlarmsEquipment) => {
    ax.post('equipments_alarms', data)
    .then(() => {
      goBack();
      addToast(
        caps('success:base.save'), 
        { appearance: 'success', autoDismiss: true }
      );
    })
    .catch((e: AxiosError) => {
      if (e.response) { 
        const message = e.response.data.message || caps('errors:base.post', { element: "alarma" })
        
        addToast( message ,
          { appearance: 'error', autoDismiss: true }
        );
      }
    })
    .finally(() => { setIsSaving(false) });
  } 

  const updateAlarmsEquipment = (data: IFormAlarmsEquipment) => {
    ax.patch('equipments_alarms', data)
    .then(() => {
      goBack();
      addToast(
        caps('success:base.update'), 
        { appearance: 'success', autoDismiss: true }
      );
    })
    .catch((e: AxiosError) => {
      if (e.response) { 
        const message = e.response.data.message || caps('errors:update.', { element: "alarma" })
        
        addToast( message ,
          { appearance: 'error', autoDismiss: true }
        );
      }
    })
    .finally(() => { setIsSaving(false) });
  }

  //WATCHS
  const watchEquipmentId = watch("id_equipment");

  //EFFECTS
  useEffect(() => {
    const fetchNotyfiableUsers = async () => {
      setIsReadyUsersNotifiable(false)
      await ax.get<Option<unknown>[]>('equipments_alarms/notyfiable_users')
        .then((response) => {
          setNotyfiableUsers(response.data)
        })
        .catch((e: AxiosError) => {
          if (e.response) {
            addToast(caps('errors:base.load', { element: "usuarios notificables" }), {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        })
        .finally(() => {
          setIsReadyUsersNotifiable(true)
        });
    }
    watchEquipmentId && fetchNotyfiableUsers()
  }, [watchEquipmentId])

  useEffect(() => {
    if (dataInitial !== undefined) {
      const dataUsers: string[] = dataInitial.dataUsers.map(({ cusuario }) => cusuario);
      console.log('dataUsers: ', dataUsers);

      console.log('dataInitial: ', dataInitial);
      setActiveAlarms((state) => $u(state, {
        critical_point: { isActive: { $set: dataInitial.is_alarm_critical_point } }
      }))
      setNotyfiableUsersSelected(dataUsers)
      setValue([
        { id_equipment: dataInitial.id_equipment },
        { is_alarm_critical_point: dataInitial.is_alarm_critical_point },
        { notify_users: dataUsers },
      ])
    } else {
      setActiveAlarms((state) => $u(state, {
        critical_point: { isActive: { $set: true } }
      }))
      setNotyfiableUsersSelected([])
      setValue([{ notify_users: [] }])
    }
  }, [dataInitial,notyfiableUsers])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Col sm={12} className={'px-0'}>
        <Col sm={3}>
          <Controller as={ApiSelect} name="id_equipment"
            id="id_equipment"
            label="labels:equipment"
            placeholder="Seleccione equipo..."
            source={'service_render/equipos'}
            queryParams={{ isSelectFilter: true }}
            selector={(option: any) => {
              return { label: option.nombre, value: option.id };
            }}
            isDisabled={isUpdate}
            isLabelRequired={true}
            isSelectFirtsOption={false}
            errorForm={errors.id_equipment}
            control={control}
          />
        </Col>
      </Col>

      <Col sm={12} className={'mb-3'}>
        <b>Tipos de notificaciones <span className="text-danger"> (*)</span>:</b>
      </Col>

      <Col sm={12} className={'px-0'}>
        <Col sm={3}>
          <div className="d-flex">
            <input type="checkbox"
              ref={register}
              id={'is_alarm_critical_point'}
              name={'is_alarm_critical_point'}
              disabled={!isReadyUsersNotifiable}
              checked={activeAlarms.critical_point.isActive}
              style={{ width: '20px', height: '20px' }}
              onChange={() => {
                const isActiveAlarm = !activeAlarms.critical_point.isActive
                setActiveAlarms((state) => $u(state, {
                  critical_point: { isActive: { $set: isActiveAlarm } }
                }))
              }}
              className="mr-2"
            />
            <label className="pr-3">
              <b>Perfil crítico</b>
            </label>
          </div>
        </Col>
      </Col>

      <Col>
        <Col className="alert alert-info mt-3">
          <i className="fa fa-info mr-2" aria-hidden="true" />
          <strong> ¡Encienda las notificaciones que desea recibir del equipo!</strong> .
        </Col>
      </Col>

      <Col sm={12} className="pt-2">
        <label>
          <b>
            Usuarios a notificar
            <span className="text-danger"> (*)</span>:
          </b>
        </label>
        <Controller
          control={control}
          as={DualListBox}
          id={'notify_users'}
          name={'notify_users'}
          options={notyfiableUsers}
          selected={notyfiableUsersSelected}
          canFilter
          filterPlaceholder={'Buscar usuario...'}
          showHeaderLabels={true}
          lang={DualListLang}
          onChange={(data) => {
            console.log('data: ', data);
            setNotyfiableUsersSelected(data[0])
            return data[0]
          }}
          disabled={!isReadyUsersNotifiable}
        />
        <ErrorMessage errors={errors} name="notify_users">
          {({ message }) => <small className="text-danger">{message}</small>}
        </ErrorMessage>
      </Col>

      <Col>
        <Col className="alert alert-info mt-3">
          <i className="fa fa-info mr-2" aria-hidden="true" />
          <strong> ¡Selecciones los usuarios que serán notificados!</strong> .
        </Col>
      </Col>

      <Col>
        <Buttons.Form isLoading={isSaving} />
      </Col>
    </Form>
  )
}

export default FormAlarmEquipment