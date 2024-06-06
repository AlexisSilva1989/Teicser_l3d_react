import React, { useCallback, useMemo, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap';
import { Chart } from 'react-charts'

interface IProps {
  perfilCritico: string[]
  perfilNominal: string[]
  dataSimulacion: any
  typeEquipment: string
  component: string
  dataPromedio?: any
  fechaSimulacion: string
}

function MiniGraphSimulation({
  perfilCritico,
  perfilNominal,
  dataSimulacion,
  typeEquipment,
  component,
  dataPromedio,
  fechaSimulacion,
}: IProps) {
  /*STATES*/
  const [rangeSelected, setRangeSelected] = useState(0);

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
      position: "left", type: "linear", show: true, stacked: false,
      hardMin: 0, showTicks: true
    },
    {
      position: "right", type: "linear", show: true, stacked: false,
      hardMin: 0, showTicks: true
    },
  ], []
  );
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
    { data: Object.keys(dataSimulacion).length > 0 ? dataSimulacion[Object.keys(dataSimulacion)[rangeSelected]] : [] },
    { data: perfilNominal }
  ], [rangeSelected, dataSimulacion, perfilCritico, perfilNominal])

  function CustomTooltip({ getStyle, primaryAxis, datum }: any) {
    const data = React.useMemo(() => datum
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

  return (
    <Col sm="12" className={"mt-2 mb-2 p-0"}>
      <Col sm="12" className="text-center"><strong>{component}</strong></Col>
      <Col sm="12" style={{ height: '220px' }} >
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
          <Col sm="6" className="text-center">
            <Form.Control value={rangeSelected} type="range"
              min={0} max={Object.keys(dataSimulacion).length - 1}
              onChange={e => setRangeSelected(Number(e.target.value))}
            />
            <strong >{Object.keys(dataSimulacion)[rangeSelected]}</strong>

          </Col>
          <Form.Label column sm="3">
            {Object.keys(dataSimulacion)[Object.keys(dataSimulacion).length - 1]}
          </Form.Label>
        </Form.Group>
      )}
      {
        fechaSimulacion && <Col sm="12" className="text-right p-0">
          <strong>Fecha de simulación: </strong> {fechaSimulacion}
        </Col>
      }
      {/* //comentado momentanemente */}
      {/* <Col sm={12} className="mb-2">
        <strong>Valores promedios de variables operativas</strong>
      </Col>
      <Table responsive className={'text-left'}>
        <tbody>
          <tr>
            <td colSpan={3} key={"sub-title"}>
              {
                fechaSimulacion && <>
                  <strong>Fecha de simulación: </strong> {fechaSimulacion}
                </>
              }
            </td>
          </tr>
          <tr>
            {
              dataPromedio?.TRAT_MOLINO &&
              (<td key={"trat-molino"}><strong>Tonelaje: </strong> {dataPromedio.TRAT_MOLINO}</td>)
            }
            {
              dataPromedio?.DWI &&
              (<td key={"DWI"}><strong>Dureza: </strong>{dataPromedio.DWI}</td>)
            }
            {
              dataPromedio?.BWI &&
              (<td key={"BWI"}><strong>Dureza: </strong> {dataPromedio.BWI}</td>)
            }
            {
              dataPromedio?.BOLAS_TON &&
              (<td key={"BOLAS_TON"}><strong>Cargío bolas: </strong> {dataPromedio.BOLAS_TON}</td>)
            }
          </tr>
          <tr>
            {
              dataPromedio?.AI &&
              (<td key={"AI"}><strong>Índice de abrasividad: </strong>{dataPromedio.AI}</td>)
            }
            {
              dataPromedio?.PH &&
              (<td key={"PH"}><strong>Dureza: </strong> {dataPromedio.PH}</td>)
            }

            <td key={"VEL_RPM"}>{dataPromedio?.VEL_RPM && <><strong>  Velocidad: </strong> {dataPromedio.VEL_RPM}</>}</td>

          </tr>
        </tbody>
      </Table> */}
    </Col>
  )
}

export default MiniGraphSimulation