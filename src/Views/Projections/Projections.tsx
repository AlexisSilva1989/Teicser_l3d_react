import React, { useEffect, useState } from 'react'
import { BaseContentView } from '../Common/BaseContentView'
import { Col } from 'react-bootstrap'
import { ApiSelect } from '../../Components/Api/ApiSelect'
import { Equipo } from '../../Data/Models/Equipo/Equipo'
import { $u } from '../../Common/Utils/Reimports'
import { Datepicker } from '../../Components/Forms/Datepicker'
import LineGraph from '../../Components/Graphs/LineGraph'
import { Textbox } from '../../Components/Forms/Textbox'
import { useDebounce } from 'use-debounce/lib'

const xampleData = [
  { x: 0, y: 382.27 },
  { x: 0.009, y: 381.18 },
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

const xampleData2 = [
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
  { x: 0.513, y: 365.71 },
  { x: 0.48, y: 366.63 },
  { x: 0.543, y: 364.99 }
]

const xampleTimestamps = [
  "15-07-2018",
  "16-07-2018",
  "17-07-2018",
  "18-07-2018",
  "19-07-2018",
  "20-07-2018",
  "21-07-2018",
  "22-07-2018",
  "23-07-2018",
  "24-07-2018",
  "25-07-2018",
  "26-07-2018",
  "27-07-2018",
  "28-07-2018",
  "29-07-2018",
  "30-07-2018",
  "31-07-2018",
  "01-08-2018",
  "02-08-2018",
]

const Projections = () => {


  //STATES
  const [filtersParams, setFiltersParams] = useState({
    filterByEquipo: '133',
  });

  const [CriticalCondition, setCriticalCondition] = useState<{ type: string, value: string | undefined }>({
    type: "FECHA",
    value: undefined
  })

  const [FilterCriterioMill, setFilterCriterioMill] = useState<{
    x?: number | string
    y?: null | number
    date?: string
  }[]>([])

  const [valueSearch] = useDebounce(CriticalCondition, 1500);

  const [DataComponents, setDataComponents] = useState<{
    nombre: string
    data: {
      x: any
      y: any
    }[]
    timeStamp: string[]
  }[]>([
    {
      nombre: 'cil 1',
      data: xampleData,
      timeStamp: xampleTimestamps
    },
    {
      nombre: 'cil 2',
      data: xampleData2,
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
        <Col sm={4} style={{ height: '36vh' }} className='' >
          <Col className='h-100 py-3'>
            <LineGraph title={DataComponents[index].nombre}
              data={[{ data: DataComponents[index].data ?? [] }]}
              timestamps={DataComponents[index].timeStamp ?? []}
              dataSelected={FilterCriterioMill[index]}
            />
          </Col>
        </Col>
      )
    });
    return graphs
  }

  const findMillForDate = (date: string | undefined) => {
    const filterSelect: {
      x?: string | number | undefined; y?: number | null | undefined; date?: string | undefined
    }[] = []
    console.log('date: ', date);
    DataComponents.forEach((mill) => {
      let existDate: boolean = false
      if (date) {
        mill.timeStamp?.forEach((timeStamp, dataPosition) => {
          if (timeStamp === date) {
            existDate = true
            filterSelect.push({
              x: mill.data[dataPosition].x,
              y: mill.data[dataPosition].y,
              date: timeStamp
            })
            return
          }
        });
      }
      if (!existDate) {
        filterSelect.push({
          x: undefined,
          y: undefined,
          date: undefined
        })
      }
    });
    setFilterCriterioMill(state => $u(state, { $set: filterSelect }))
  }


  const findMillForEspesor = (espesor: string | undefined) => {
    const filterSelect: { x?: string | number | undefined; y?: number | null | undefined; date?: string | undefined }[] = []
    DataComponents.forEach((mill) => {
      let existEspesor: boolean = false
      if (espesor) {
        mill.data?.forEach((data, dataPosition) => {
          if (parseInt(data.y) === parseInt(espesor)) {
            existEspesor = true
            filterSelect.push({
              x: data.x,
              y: data.y,
              date: mill.timeStamp[dataPosition]
            })
            return
          }
        });
      }
      if (!existEspesor) {
        filterSelect.push({
          x: undefined,
          y: undefined,
          date: undefined
        })
      }
    });
    setFilterCriterioMill(state => $u(state, { $set: filterSelect }))
  }

  //EFFECTS
  // useEffect(() => {

  //   console.log('filtersParams: ', filtersParams);
  // }, [filtersParams.filterByEquipo])
  // useEffect(() => {

  //   console.log('FilterCriterioMill: ', FilterCriterioMill);
  // }, [FilterCriterioMill])

  useEffect(() => {
    if (valueSearch.type === 'FECHA') {
      console.log('valueSearch: ', valueSearch.value);
      findMillForDate(valueSearch.value)
    }

    if (valueSearch.type === 'ESPESOR') {
      findMillForEspesor(valueSearch.value)
    }
  }, [valueSearch])


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
            value={CriticalCondition.type == undefined ? '-1' : CriticalCondition.type}
            source={[
              // { label: "NINGUNO", value: "-1" },
              { label: "FECHA", value: "FECHA" },
              { label: "ESPESOR CRÍTICO", value: "ESPESOR" },
            ]}
            selector={(option) => {
              return { label: option.label, value: option.value };
            }}
            onChange={(data) => {
              setCriticalCondition(state => $u(state, {
                type: { $set: data !== '-1' ? data : undefined },
                value: { $set: undefined }
              }))
            }}
          />
        </Col>

        <Col sm={3} hidden={CriticalCondition.type !== 'FECHA'}>
          <Datepicker
            label='Fecha criterio'
            value={CriticalCondition.type === 'FECHA' ? CriticalCondition.value : undefined}
            onChange={value => {
              setCriticalCondition(state => $u(state, { value: { $set: value } }))
            }}
          />
        </Col>
        <Col sm={3} hidden={CriticalCondition.type !== 'ESPESOR'}>
          <Textbox
            label='Buscar espesor'
            value={CriticalCondition.value ?? ''}
            name={"espesor"}
            id={"espesor"}
            placeholder={"número entero"}
            onlyNumber={true}
            onChange={
              (data) => {
                setCriticalCondition(state => $u(state, {
                  value: { $set: data as string }
                }))
              }
            }
          />
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
      </Col>
    </BaseContentView>
  )
}


















export default Projections