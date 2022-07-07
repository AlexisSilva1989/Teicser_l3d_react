import React from 'react'
import { Col } from 'react-bootstrap'
import { JSONObject } from '../../../Data/Models/Common/general'
import { EquipoSingle } from '../../../Data/Models/Equipo/Equipo'
import MiniGraphSimulation from './components/MiniGraphSimulation'

interface IProps {
  simulationsComponents: JSONObject | undefined
  equipo : EquipoSingle | undefined
}

interface IDataGraph {
  simulacion: string[]
  perfilCritico: string[]
  perfilNominal: string[]
  dataPromedio: any
  fechaSimulacion: string
}

function SimulationSummaryGraphs({ simulationsComponents , equipo }: IProps) {

  const getGraphsComponents = () => {
    let graphs: (JSX.Element | undefined)[] = [] 
    simulationsComponents && Object.keys(simulationsComponents).forEach((key) =>{
      const dataComponent: IDataGraph = simulationsComponents[key] as IDataGraph
      if(dataComponent !== null){
        graphs.push( <Col sm={6}> 
          <MiniGraphSimulation
            perfilCritico={dataComponent.perfilCritico}
            perfilNominal={dataComponent.perfilNominal}
            dataSimulacion={dataComponent.simulacion[0]}
            typeEquipment={equipo!.tipo!}
            component={key}
            dataPromedio={dataComponent.dataPromedio}
            fechaSimulacion={dataComponent.fechaSimulacion}
          /> 
        </Col>)
      }
    })
    return graphs
  }

  return (
    <Col sm={12} className={"mt-3 p-0 text-center"}>
      <Col sm={12} className="text-center"><h4>{`${equipo?.nombre} (${equipo?.tipo}) `}</h4></Col>
      <hr/>
      {
         getGraphsComponents().length > 0
          ? getGraphsComponents()
          : <Col sm={12} className="text-center">
            <Col className="alert alert-info mb-0" sm={6}>
              <i className="fa fa-info mr-2" aria-hidden="true" />
              No hay componentes con simulaciones finalizadas para este equipo
            </Col>
          </Col>
      }
    </Col>

  )
}

export default SimulationSummaryGraphs