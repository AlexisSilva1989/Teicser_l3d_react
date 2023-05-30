import React, { useEffect, useState } from 'react'
import { BaseContentView } from '../Common/BaseContentView'
import { Col } from 'react-bootstrap'
import { ApiSelect } from '../../Components/Api/ApiSelect'
import { Equipo } from '../../Data/Models/Equipo/Equipo'
import { $m, $u } from '../../Common/Utils/Reimports'
import { Datepicker } from '../../Components/Forms/Datepicker'
import LineGraph from '../../Components/Graphs/LineGraph'
import { Textbox } from '../../Components/Forms/Textbox'
import { useDebounce } from 'use-debounce/lib'
import { useNavigation } from '../../Common/Hooks/useNavigation'
import { BounceLoader } from 'react-spinners'
import { ax } from '../../Common/Utils/AxiosCustom'
import { AxiosError } from 'axios'
import { ProjectionPolinomio } from '../../Data/Models/Proyeccion/Polinomio'
import { useToasts } from 'react-toast-notifications'
import { LoadingSpinner } from '../../Components/Common/LoadingSpinner'

const Projections = () => {
  //HOOKS
  const { stateAs } = useNavigation();
  const dataStateAs = stateAs<{ data: { id: string } }>();
  const { addToast } = useToasts()

  //STATES
  const [filtersParams, setFiltersParams] = useState<{ filterByEquipo: string | undefined }>({
    filterByEquipo: undefined,
  });
  const [IsFilter, setIsFilter] = useState<boolean>(false)
  const [CriticalCondition, setCriticalCondition] = useState<{ type: string, value: string | undefined }>({
    type: "FECHA",
    value: $m().format('DD-MM-YYYY')
  })
  const [FilterCriterioMill, setFilterCriterioMill] = useState<{
    x?: number | string
    y?: null | number
    date?: string
  }[]>([])
  const [valueSearch] = useDebounce(CriticalCondition.value, 1500);
  const [TipoEspesor, setTipoEspesor] = useState<string>('placa')
  const [DataComponents, setDataComponents] = useState<ProjectionPolinomio[]>()
  const [IsLoadData, setIsLoadData] = useState<boolean>(true)

  //HANDLES
  const getGraphsComponents = () => {
    let graphs: (JSX.Element | undefined)[] = []

    DataComponents?.forEach((element, index) => {
      let data: { x: any; y: any; }[] = []

      if(TipoEspesor === 'placa'){
        data = DataComponents[index].data.placa ?? []
      }

      if(TipoEspesor === 'placa_b'){
        data = DataComponents[index].data.placa_b ?? []
      }

      if(TipoEspesor === 'lifter'){
        data = DataComponents[index].data.lifter ?? []
      }

      graphs.push(
        <Col sm={4} style={{ height: '36vh' }} className='py-3' key={`graph-component-${index}`}>
          <Col className='h-100 p-0'>
            <LineGraph title={DataComponents[index].nombre}
              data={[{data}]}
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
    DataComponents?.forEach((mill) => {
      let existDate: boolean = false
      const dataEspesores = TipoEspesor === 'placa' 
        ? mill.data?.placa 
        : TipoEspesor === 'placa_b' 
          ? mill.data?.placa_b
          : mill.data?.lifter

      if (date && dataEspesores) {
        const dateParse = $m(date, 'DD-MM-YYYY').format('YYYY-MM-DD')

        mill.timeStamp?.forEach((timeStamp, dataPosition) => {
          if (timeStamp === dateParse) {
            existDate = true
            filterSelect.push({
              x: dataEspesores[dataPosition].x,
              y: dataEspesores[dataPosition].y,
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
    DataComponents?.forEach((mill) => {

      const dataEspesores = TipoEspesor === 'placa' 
        ? mill.data?.placa 
        : TipoEspesor === 'placa_b' 
          ? mill.data?.placa_b
          : mill.data?.lifter

      let existEspesor: boolean = false
      if (espesor && dataEspesores) {
        dataEspesores.some((data, dataPosition) => {
          if (parseInt(data.y) <= parseInt(espesor)) {
            existEspesor = true;
            filterSelect.push({
              x: data.x,
              y: data.y,
              date: mill.timeStamp[dataPosition]
            });
            return true; // stops the iteration
          }
          return false;
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

  const getData = async () => {
    setIsLoadData(true)
    await ax.get<ProjectionPolinomio[]>('service_render/proyeccion_pl', {
      params: { equipoId: filtersParams.filterByEquipo }
    })
      .then((response) => {
        setDataComponents(response.data)
      })
      .catch((e: AxiosError) => {
        if (e.response) {
          addToast('Error al cargar los datos del equipo', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      }).finally(() => {
        setIsLoadData(false)
      });
  }

  //EFFECTS
  useEffect(() => {
    if (filtersParams.filterByEquipo === undefined)
      return
    getData()
  }, [filtersParams.filterByEquipo])

  useEffect(() => {
    const idEquipo = dataStateAs?.data?.id
    setFiltersParams(state => $u(state, { filterByEquipo: { $set: idEquipo } }))
  }, [dataStateAs])

  useEffect(() => {
    setCriticalCondition(state => $u(state, {
      value: { $set: CriticalCondition.type === 'FECHA' ? $m().format('DD-MM-YYYY') : undefined }
    }))
  }, [filtersParams.filterByEquipo])

  useEffect(() => {
    if (CriticalCondition.type === 'FECHA') {
      findMillForDate(valueSearch)
    }

    if (CriticalCondition.type === 'ESPESOR') {
      findMillForEspesor(valueSearch)
    }
    setIsFilter(false)
  }, [valueSearch, TipoEspesor, DataComponents])

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

        <Col sm={2}>
          <ApiSelect
            name='typo_espesor_select'
            label='Tipo'
            value={TipoEspesor}
            source={[
              { label: "PLACA", value: "placa" },
              { label: "PLACA B", value: "placa_b" },
              { label: "LIFTER", value: "lifter" },
            ]}
            selector={(option) => {
              return { label: option.label, value: option.value };
            }}
            onChange={(data) => {
              setTipoEspesor(data)
            }}
          />
        </Col>

        <Col sm={2}>
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

        <Col sm={2} hidden={CriticalCondition.type !== 'FECHA'}>
          <Datepicker
            label='Fecha criterio'
            value={CriticalCondition.type === 'FECHA' ? CriticalCondition.value : undefined}
            onChange={value => {
              setIsFilter(true)
              setCriticalCondition(state => $u(state, { value: { $set: value } }))
            }}
          />
        </Col>

        <Col sm={2} hidden={CriticalCondition.type !== 'ESPESOR'}>
          <Textbox
            label='Buscar espesor'
            value={CriticalCondition.value ?? ''}
            name={"espesor"}
            id={"espesor"}
            placeholder={"número entero"}
            onlyNumber={true}
            onChange={
              (data) => {
                setIsFilter(true)
                setCriticalCondition(state => $u(state, {
                  value: { $set: data as string }
                }))
              }
            }
          />
        </Col>

        <Col sm={3} style={{ height: '66px' }} hidden={!IsFilter}>
          <Col sm={12} className='p-0 pt-3 h-100 d-flex align-items-center'>
            <BounceLoader color='var(--primary)' size={18} />
            <span className='pl-3' style={{ color: 'var(--primary)' }}>{`Buscando ${CriticalCondition.type.toLowerCase()} ...`}</span>
          </Col>
        </Col>


      </Col>
      <Col sm={12} className='px-0'>
        {
          IsLoadData
            ? (<LoadingSpinner />)
            : (DataComponents && (DataComponents.length > 0)
              ? getGraphsComponents()
              : <Col sm={12} className="text-center">
                <Col className="alert alert-info mb-0 mt-5" sm={6}>
                  <i className="fa fa-info mr-2" aria-hidden="true" />
                  No se encontraron componentes
                </Col>
              </Col>
            )
        }
      </Col>
    </BaseContentView>
  )
}

export default Projections