import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { $j, $u } from '../../../Common/Utils/Reimports';
import { Buttons } from '../../../Components/Common/Buttons'
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { JSONObject } from '../../../Data/Models/Common/general';
import { EquipoSingle } from '../../../Data/Models/Equipo/Equipo';
import { BaseContentView } from '../../Common/BaseContentView'
import SimulationSummaryGraphs from './SimulationSummaryGraphs';

function ShowSimulationSummary() {
  //HOOKS
  const { stateAs } = useNavigation();
  const dataStateAs = stateAs<{ data: { id: number, fecha_simulacion: string } }>();
  const { pushAbsolute } = useFullLocation();
  const { data_select } = useParams<{ data_select: string }>();
  const { addToast } = useToasts();
  const { capitalize: caps } = useFullIntl();


  //STATES
  const [idEquipoSelected, setIdEquipoSelected] = useState<string>();
  const [loadingData, setLoadingData] = useState(true);
  const [simulationsComponents, setSimulationsComponents] = useState<JSONObject>();
  const [equipo, setEquipo] = useState<EquipoSingle>({
    "nombre": undefined,
    "tipo" : undefined
  });

  //EFFECTS
  useEffect(() => {
    if (dataStateAs === undefined && data_select === undefined) {
      pushAbsolute("routes:base.summary_projection")
    }
    setIdEquipoSelected(data_select ?? dataStateAs.data.id.toString())
  }, [])

  useEffect(() => {
    async function feat() {
      await ax.get<{simulaciones: JSONObject , equipo_nombre: string, equipo_tipo: string}>($j('service_render/summary_projection_equipment', idEquipoSelected!))
        .then(response => {
          setSimulationsComponents(response.data.simulaciones)
          setEquipo((s) => $u(s, { $merge: { 
            nombre: response.data.equipo_nombre ,
            tipo: response.data.equipo_tipo
          } }));
        })
        .catch((error: AxiosError) => {
          if (error.response) {
            addToast(
              caps('errors:base.load', { element: 'proyeciones de equipo' }),
              { appearance: 'error', autoDismiss: true }
            );
          }
        }).finally(() => { setLoadingData(false) });
    }
    idEquipoSelected && feat();
  }, [idEquipoSelected])

  return (
    <BaseContentView title='Proyecciones de equipo'>
      <Col sm={12}>
        <Buttons.GoTo path={"routes:base.summary_projection"} />
      </Col>
      <Col sm={12}>
        { loadingData 
          ? <LoadingSpinner /> 
          : <SimulationSummaryGraphs 
            simulationsComponents={simulationsComponents}
            equipo={equipo}
          />
        }
      </Col>
    </BaseContentView>
  )
}

export default ShowSimulationSummary