import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useFullLocation } from '../../../Common/Hooks/useFullLocation';
import { useNavigation } from '../../../Common/Hooks/useNavigation';
import { $j } from '../../../Common/Utils/Reimports';
import { Buttons } from '../../../Components/Common/Buttons';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { BaseContentView } from '../../Common/BaseContentView';

const SimulacionDias = () => {
	//HOOKS
	const { stateAs } = useNavigation();
	const dataStateAs = stateAs<{ data: { id: number, fecha_simulacion: string } }>();
	const { pushAbsolute } = useFullLocation();
	const { data_select } = useParams<{ data_select: string }>();


	//STATES
	const [dataId, setDataId] = useState<string>();
	const [fechaSimulacion, setFechaSimulacion] = useState<string>();

	//EFFECTS
	useEffect(() => {
		if (dataStateAs === undefined && data_select === undefined) {
			pushAbsolute("routes:base.simulation_days")
		}

		if (data_select !== undefined) {
			setDataId(data_select)
		} else {
			setDataId(dataStateAs.data.id.toString());			
			setFechaSimulacion(dataStateAs.data.fecha_simulacion);
		}
	}, [])

	return (
		<BaseContentView title='titles:simulation_prediction_days'>
			<Col className="col-12 mb-4 d-flex justify-content-between">
				<Col><Buttons.GoTo path={"routes:base.simulation_days"} /></Col>
				<Col className="d-flex justify-content-end align-items-center">
					{fechaSimulacion && <b>Fecha simulación: {fechaSimulacion}</b>}
				</Col>
			</Col>
			<Col>
				{dataId && <SimulacionGrafica
					resourceData={$j('service_render/data_proyeccion', dataId)}
					setFechaSimulacion={setFechaSimulacion}
				/>}
			</Col>
		</BaseContentView>
	);
};

export default SimulacionDias;