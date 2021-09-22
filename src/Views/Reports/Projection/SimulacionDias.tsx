import React from 'react';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { BaseContentView } from '../../Common/BaseContentView';

const SimulacionDias = () => {

	return  (
		<BaseContentView title='titles:simulation_prediction_days'>
			<SimulacionGrafica resourceData='service_render/data_proyeccion_dias'/>
		</BaseContentView>
	);
};

export default SimulacionDias;