import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AxiosError } from 'axios';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { Chart } from 'react-charts'
import { useToasts } from 'react-toast-notifications';

import { useFullIntl } from '../../../../Common/Hooks/useFullIntl';
import { ax } from '../../../../Common/Utils/AxiosCustom';
import { LoadingSpinner } from '../../../../Components/Common/LoadingSpinner';
import { ShowMessageInModule } from '../../../../Components/Common/ShowMessageInModule';

interface IProps {
  resourceData: string
  // dataForm?: IDataPromedio
  setFechaSimulacion?: (fecha: string) => void
  showLegend?: boolean
  dateStart?: string
  dateEnd?: string
}

interface IDataGraph {
  simulacion: string[]
  dates: string[]
  perfilCritico: string[]
  perfilNominal: string[]
  dataPromedio?: any
  status: string
  tipoProyeccion: string
  fechaSimulacion: string
  equipo: string
  componente: string
  tipoEquipo: string
}

const styleListOperationalVar: React.CSSProperties = { 'display': 'flex', 'justifyContent': 'center' }

const SimulacionGrafica = ({ resourceData, setFechaSimulacion, showLegend = true }: IProps) => {

  /*CUSTOM HOOKS */
  const { capitalize: caps, localize } = useFullIntl();
  const { addToast } = useToasts();

  /*STATES */
  const [loadingData, setLoadingData] = useState(true);
  const [rangeSelected, setRangeSelected] = useState(0);
  const [dataSimulacion, setDataSimulacion] = useState<any>();
  const [dataSimulacionSize, setDataSimulacionSize] = useState<number>(0);
  const [perfilCritico, setPerfilCritico] = useState<string[]>([]);
  const [perfilNominal, setPerfilNominal] = useState<string[]>([]);
  const [dataPromedio, setDataPromedio] = useState<any>({});
  const [statusSimulation, setStatusSimulation] = useState<string>();
  const [typeProjection, setTypeProjection] = useState<string>();
  const [component, setcomponent] = useState<string>()
  const [equipo, setequipo] = useState<string>()
  const [tipoEquipo, setTipoEquipo] = useState<string>()

  /*EFFECTS */
  useEffect(() => {
    async function feat() {
      await ax.get<IDataGraph>(resourceData).then(response => {
        setStatusSimulation(response.data.status)
        setTypeProjection(response.data.tipoProyeccion)
        if (response.data.simulacion.length > 0) {
          setDataSimulacionSize(Object.keys(response.data.simulacion[0]).length)
          setDataSimulacion(response.data.simulacion[0]);
          setPerfilCritico(response.data.perfilCritico);
          setPerfilNominal(response.data.perfilNominal);
          setcomponent(response.data.componente)
          setequipo(response.data.equipo)
          setTipoEquipo(response.data.tipoEquipo)
          setFechaSimulacion && setFechaSimulacion(response.data.fechaSimulacion)

          response.data.dataPromedio && setDataPromedio(response.data.dataPromedio);
        }
      }).catch((error: AxiosError) => {
        if (error.response) {
          addToast(
            caps('errors:base.load', { element: 'data de simulación' }),
            { appearance: 'error', autoDismiss: true }
          );
        }
      }).finally(() => { setLoadingData(false); });
    }
    feat();
  }, []);

  /*MEMOS */
  const tooltip = React.useMemo(
    () => ({
      render: ({ datum, primaryAxis, getStyle }: any) => {
        return <CustomTooltip {...{ getStyle, primaryAxis, datum }} />
      }
    }),
    []
  )

  const axes = useMemo(() => [
    { primary: true, position: "bottom", type: "linear", show: true, showTicks: true },
    {
      position: "left", type: "linear", show: true, stacked: false, hardMin: 0,showTicks: true
      // hardMax: tipoEquipo === 'SAG' ? 500 : 200
    },
    {
      position: "right", type: "linear", show: true, stacked: false, hardMin: 0, showTicks: true
    },
  ], [tipoEquipo]
  );

  // const series = useMemo(() => ({ type: "area", seriesLabel: "Espesor" }), []);
  const series = React.useCallback(
    (s, i) => ({
      type: i === 1 ? 'area' : 'line',
      showPoints: false,
    }), []
  )
  const colorLinesGraph: string[] = ["#d50000", "#2962ff", "#212121"]
  const getSeriesStyle = useCallback(
    (series) => ({
      color: colorLinesGraph[series.index],
      transition: 'all .2s ease'
    }), [colorLinesGraph]
  )
  const data = useMemo(() => [
    { data: perfilCritico },
    { data: dataSimulacionSize > 0 ? dataSimulacion[Object.keys(dataSimulacion)[rangeSelected]] : [] },
    { data: perfilNominal }
  ], [rangeSelected, dataSimulacion, perfilCritico, perfilNominal])

  /*LEYENDA DE LA GRAFICA */
  const legendGraph: JSX.Element = <>
    <Col sm='6' className="mt-2">
      <Col sm={12} className="mb-2 text-center">
        <strong>Valores promedios de variables operativas</strong>
      </Col>
      <Table responsive >
        <tbody>
          <tr>
            {
              dataPromedio?.TRAT_MOLINO &&
              (<td key={"trat-molino"}><strong>Tonelaje: </strong> {dataPromedio.TRAT_MOLINO} Ton/día</td>)
            }
            {
              dataPromedio?.DWI &&
              (<td key={"DWI"}><strong>Dureza DWI: </strong>{dataPromedio.DWI}</td>)
            }
            {
              dataPromedio?.BWI &&
              (<td key={"BWI"}><strong>Dureza BWI: </strong> {dataPromedio.BWI}</td>)
            }
          </tr>
          <tr>
            {
              dataPromedio?.BOLAS_TON &&
              (<td key={"BOLAS_TON"}><strong>Cargío bolas: </strong> {dataPromedio.BOLAS_TON} Ton/día</td>)
            }
            {
              dataPromedio?.AI &&
              (<td key={"AI"}><strong>Índice de abrasividad: </strong>{dataPromedio.AI}</td>)
            }
            {
              dataPromedio?.PH &&
              (<td key={"PH"}><strong>PH: </strong> {dataPromedio.PH}</td>)
            }

          </tr>
          <tr>
            {dataPromedio?.VEL_RPM &&
              (<td key={"PH"} colSpan={3}><strong>Velocidad: </strong> {dataPromedio.VEL_RPM} RPM</td>)
            }
          </tr>
        </tbody>
      </Table>
      {(typeProjection !== null && typeProjection !== undefined) &&
        (<>
          <Col sm={12} className="mb-2 p-0">
            <Col className="alert alert-info mb-0" sm={12}>
              <i className="fa fa-info mr-2" aria-hidden="true" />

              Periodo seleccionado para realizar la proyección de variables es de
              <strong> {localize('label:' + typeProjection)}</strong>

            </Col>

          </Col>
        </>
        )
      }
      {/* <Row className="mb-3 justify-content-center" style={{ 'display': 'flex' }}>
                {(typeProjection !== null && typeProjection !== undefined) &&
                    (<p> Simulación realizada con <b>{localize('label:' + typeProjection)}</b></p>)}
            </Row>
            <Row>
                {equipo && <Col xl='12' className="mb-2" style={styleListOperationalVar}>
                    <p> Equipo <b>{equipo}</b></p>
                </Col>}

                {component && <Col xl='12' className="mb-2" style={styleListOperationalVar}>
                    <p> Componente <b>{component}</b></p>
                </Col>}

                {dataPromedio?.TRAT_MOLINO && <Col xl='12' className="mb-2" style={styleListOperationalVar}>
                    <p> Tonelaje <b>{dataPromedio.TRAT_MOLINO}</b></p>
                </Col>}

                {dataPromedio?.VEL_RPM && <Col xl='12' className="mb-2" style={styleListOperationalVar}>
                    <p> Velocidad <b>{dataPromedio.VEL_RPM}</b></p>
                </Col>}

                {dataPromedio?.DWI && <Col xl='12' className="mb-2" style={styleListOperationalVar}>
                    <p> Dureza <b>{dataPromedio.DWI}</b> </p>
                </Col>}

                {dataPromedio?.BOLAS_TON && <Col xl='12' className="mb-2" style={styleListOperationalVar}>
                    <p> Cargío bolas <b>{dataPromedio.BOLAS_TON}</b></p>
                </Col>}
            </Row>
            {/* <Row style={{ 'display': 'flex' }} className={'justify-content-center mt-3'}>
                <Button variant='outline-info' className='mr-3' onClick={returnFunction}>
                    Cambiar datos de simulación
                </Button>
            </Row> */}
    </Col>
  </>

  /*COMPOSICION DE LA GRAFICA */
  const graph: JSX.Element = <>
    <Col className="col-md-6">
      <Col sm="12" style={{ height: '250px' }}>
        <Chart
          data={data}
          axes={axes}
          series={series}
          getSeriesStyle={getSeriesStyle}
          tooltip={tooltip} />
      </Col>
      {(dataSimulacion !== undefined && Object.keys(dataSimulacion).length > 0) && (
        <Form.Group as={Row}>
          <Form.Label column sm="3" className={'text-right'}>
            {Object.keys(dataSimulacion)[0]}
          </Form.Label>
          <Col sm="6">
            <Form.Control value={rangeSelected} type="range"
              min={0} max={dataSimulacionSize - 1}
              onChange={e => setRangeSelected(Number(e.target.value))}
            />
            <h4 className="text-center" >{Object.keys(dataSimulacion)[rangeSelected]}</h4>

          </Col>
          <Form.Label column sm="3">
            {Object.keys(dataSimulacion)[Object.keys(dataSimulacion).length - 1]}
          </Form.Label>
        </Form.Group>
      )}

    </Col>
  </>

  const messagesDataNoReady: { [key: string]: string } = {
    'PENDIENTE': 'La simulación se encuentra en cola para ser realizada, por favor espere',
    'EN PROCESO': 'La simulación se está realizando, por favor espere',
    'ERROR': 'Ha ocurrido un error durante la simulación'
  }
  /*VALIDACION DE DATA*/
  const ShowModule: JSX.Element = <>

    {dataSimulacionSize > 0
      ? (<>
        <Col xl='12' className="p-0">
          <Col sm={12} className="text-center mb-4"><h4>{`${equipo} (${tipoEquipo}) / ${component} `}</h4></Col>
          {graph}
          {showLegend && legendGraph}
        </Col>
      </>)
      : (<>
        {(statusSimulation === "PENDIENTE" || statusSimulation === "EN PROCESO") && <LoadingSpinner />}
        <ShowMessageInModule message={
          (statusSimulation !== undefined && messagesDataNoReady.hasOwnProperty(statusSimulation))
            ? messagesDataNoReady[statusSimulation]
            : 'Ha ocurrido un error'
        } />
      </>)
    }
  </>

  return <>{loadingData ? <LoadingSpinner /> : ShowModule}</>;
}


function CustomTooltip({ getStyle, primaryAxis, datum }: any) {
  const data = React.useMemo(
    () =>
      datum
        ? [
          {
            data: datum.group.map((d: any) => ({
              primary: "Espectro",
              secondary: d.secondary,
              color: getStyle(d).fill
            }))
          }
        ]
        : [],
    [datum, getStyle]
  )
  return datum ? (<>
    Espesor: {primaryAxis.format(datum.secondary)}
  </>) : null
}
export default SimulacionGrafica;
