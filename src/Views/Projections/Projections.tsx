import React, { useEffect, useState } from 'react'
import { BaseContentView } from '../Common/BaseContentView'
import { Col } from 'react-bootstrap'
import { ApiSelect } from '../../Components/Api/ApiSelect'
import { Equipo } from '../../Data/Models/Equipo/Equipo'
import { $u } from '../../Common/Utils/Reimports'
import { Datepicker } from '../../Components/Forms/Datepicker'
import LineGraph from '../../Components/Graphs/LineGraph'
import { timeStamp } from 'console'

const xampleData = [
  { x: 0, y: 381.27 },
  { x: 0.009, y: 380.18 },
  { x: 0.038, y: 379.25 },
  { x: 0.071, y: 378.34 },
  { x: 0.102, y: 377.39 },
  { x: 0.136, y: 376.48 },
  { x: 0.168, y: 375.73 },
  { x: 0.194, y: 374.90 },
  { x: 0.223, y: 374.10 },
  { x: 0.251, y: 373.23 },
  { x: 0.282, y: 372.34 },
  { x: 0.313, y: 371.39 },
  { x: 0.346, y: 370.43 },
  { x: 0.38, y: 369.47 },
  { x: 0.414, y: 368.53 },
  { x: 0.447, y: 367.57 },
  { x: 0.48, y: 366.63 },
  { x: 0.513, y: 365.78 },
  { x: 0.543, y: 364.99 }
]

const xampleTimestamps = [
  "2018-07-15",
  "2018-07-16",
  "2018-07-17",
  "2018-07-18",
  "2018-07-19",
  "2018-07-20",
  "2018-07-21",
  "2018-07-22",
  "2018-07-23",
  "2018-07-24",
  "2018-07-25",
  "2018-07-26",
  "2018-07-27",
  "2018-07-28",
  "2018-07-29",
  "2018-07-30",
  "2018-07-31",
  "2018-08-01",
  "2018-08-02",
]

const Projections = () => {
  //STATES
  const [filtersParams, setFiltersParams] = useState({
    filterByEquipo: '133',
    filterByEspesorCritico: undefined,
  });

  const [FechaCriterio, setFechaCriterio] = useState<string | undefined>()
  const [DataComponents, setDataComponents] = useState<{
    nombre: string
    data?: {
      x: any
      y: any
    }[]
    timeStamp?: string[]
  }[]>([
    {
      nombre: 'cil 1',
      data: xampleData,
      timeStamp: xampleTimestamps
    },
    {
      nombre: 'cil 2',
      data: xampleData,
      timeStamp: xampleTimestamps
    },
    {
      nombre: 'cil 3',
      data: xampleData,
      timeStamp: xampleTimestamps
    },
    {
      nombre: 'cil 4',
      data: xampleData,
      timeStamp: xampleTimestamps
    },
    {
      nombre: 'cil 5',
      data: xampleData,
      timeStamp: xampleTimestamps
    },
    {
      nombre: 'cil 6',
      data: xampleData,
      timeStamp: xampleTimestamps
    },
  ])

  //HANDLES
  const getGraphsComponents = () => {
    let graphs: (JSX.Element | undefined)[] = []

    DataComponents.forEach((element, index) => {
      graphs.push(
        <Col sm={4} style={{ height: '33vh' }} className='' >
          <Col className='h-100'>
            zszz
            <LineGraph data={[{ data: DataComponents[index].data ?? [] }]}
              timestamps={DataComponents[index].timeStamp ?? []}
              dataSelected={{ x: 0.071, y: 378.34, date: "2023-03-18" }}
            />
          </Col>
        </Col>
      )
    });
    return graphs
  }

  //EFFECTS
  useEffect(() => {

    console.log('filtersParams: ', filtersParams);
  }, [filtersParams.filterByEquipo])

  useEffect(() => {

    console.log('FechaCriterio: ', FechaCriterio);
  }, [FechaCriterio])
  return (
    <BaseContentView title="Proyecciones">
      <Col sm={12} className='px-0'>
        <Col sm={3}>
          <ApiSelect<Equipo>
            name='equipo_select'
            placeholder='Seleccione'
            source={'service_render/equipos'}
            label={'Equipo'}
            value={filtersParams.filterByEquipo == undefined ? '-1' : filtersParams.filterByEquipo}
            selector={(option) => {
              return { label: option.nombre, value: option.id.toString() };
            }}
            onChange={(data) => {
              setFiltersParams(state => $u(state, { filterByEquipo: { $set: data != '-1' ? data : undefined } }))
            }}
          />
        </Col>
        <Col sm={3}>
          <ApiSelect
            name='criterio_select'
            label='Criterio de cambio'
            value={filtersParams.filterByEspesorCritico == undefined ? '-1' : filtersParams.filterByEspesorCritico}
            source={[
              // { label: "NINGUNO", value: "-1" },
              { label: "FECHA", value: "FECHA" },
              { label: "ESPESOR CRÍTICO", value: "ESPESOR" },
            ]}
            selector={(option) => {
              return { label: option.label, value: option.value };
            }}
            onChange={(data) => {
              data !== 'FECHA' && setFechaCriterio(undefined)
              setFiltersParams(state => $u(state, { filterByEspesorCritico: { $set: data !== '-1' ? data : undefined } }))
            }}
          />
        </Col>

        <Col sm={3} hidden={filtersParams.filterByEspesorCritico !== 'FECHA'}>
          <Datepicker
            label='Fecha criterio'
            value={FechaCriterio}
            onChange={value => {
              setFechaCriterio(value)
            }}
          />
        </Col>
      </Col>
      <Col sm={12}>
        {
          DataComponents.length > 0
            ? getGraphsComponents()
            : <Col sm={12} className="text-center">
              <Col className="alert alert-info mb-0" sm={6}>
                <i className="fa fa-info mr-2" aria-hidden="true" />
                No se encontraron componentes
              </Col>
            </Col>
        }
      </Col>
    </BaseContentView>
  )
}


















export default Projections