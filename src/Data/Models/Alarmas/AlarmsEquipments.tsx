import { randomUUID } from 'crypto';
import React, { Fragment } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { Utils } from '../../../Common/Utils/Utils';
import { EquipoTipo } from '../Equipo/Equipo';

interface IAlarmInfo {
  isActive: boolean
  value?: string | null
}

export interface IAlarmsTypes {
  critical_point: IAlarmInfo
}

export interface IAlarmsEquipment extends EquipoTipo {
  alarms: string[]
}

export interface IFormAlarmsEquipment {
  id_equipment: number
  notify_users: string[]
  is_alarm_critical_point: boolean
  is_active?: boolean
}

export interface extendColumnsAlarms {
  alarmsActive: string[]
  dataUsers: { cusuario: string, nombres: string, primer_apellido: string }[]
}

export const AlarmsEquipmentColumns: LocalizedColumnsCallback<IFormAlarmsEquipment & extendColumnsAlarms> = (intl) => {
  const caps = Utils.capitalize(intl)
  return [
    { selector: 'equipo_nombre', name: caps('labels:equipment') },
    {
      name: caps('labels:users_notifiable'),
      center: true,
      cell: (equipo) => (
        <>
          <span className="pr-2">{equipo.dataUsers.length}</span>
          {
            equipo.dataUsers.length > 0 && (
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip id={`tooltip-${randomUUID}`}>
                    {
                      equipo.dataUsers.map(user =>
                        <Fragment key={`alarms-eq-${randomUUID}`}>
                          <span> {`${caps(user.nombres)} ${caps(user.primer_apellido)}`}</span><br />
                        </Fragment>)
                    }
                  </Tooltip>}>
                <i className='fas fa-eye' color='red' />
              </OverlayTrigger>)
          }
        </>
      )
    },
    {
      name: caps('labels:alarms_active'),
      center: true,
      cell: (equipo) => (
        <>
          <span className="pr-2">{equipo.alarmsActive?.length}</span>
          {
            equipo.alarmsActive?.length > 0 && (
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip id={`tooltip-${randomUUID}`}>
                    {
                      equipo.alarmsActive?.map(alarms =>
                        <Fragment key={`alarms-eq-${randomUUID}`}>
                          <span> {caps(alarms)}</span><br />
                        </Fragment>)
                    }
                  </Tooltip>}>
                <i className='fas fa-eye' color='red' />
              </OverlayTrigger>)
          }
        </>
      )
    },
    {
      selector: 'is_active',
      name: caps('columns:active'),
      center: true,
      format: (alarma) => caps(alarma.is_active ? 'labels:common.yes' : 'labels:common.no')
    },
  ]
}

