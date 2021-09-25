import React, { useEffect, useState } from 'react';
import { useApi } from '../../../Common/Hooks/useApi';
import { $j, $m } from '../../../Common/Utils/Reimports';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { IDatesLastProjection } from '../../../Components/views/Home/Projection/FormProjection';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { BaseContentView } from '../../Common/BaseContentView';

const SimulacionDias = () => {
	const api = useApi();
	const EQUIPO_ID : string = "1";

	const [datesLastProjection, setDatesLastProjection] = useState<IDatesLastProjection>();
	const [errorMessageModule, setErrorMessageModule] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	/*OBTENER DATOS ASOCIADOS A LA PROYECCION */
	useEffect(() => {
		const getLastDataSimulated = async () => {
			interface responseInfoRender {
				historial_data_render: IDatesLastProjection,
			}

			const errors : string[] = [];
			await api.get<responseInfoRender>($j("service_render/get_last_data_simulated/",EQUIPO_ID))
				.success((response) => {
					response.historial_data_render === null 
						? errors.push('No se han encontrado datos operacionales')
						: setDatesLastProjection(response.historial_data_render)
				})
				.fail("Error al consultar los datos de simulación")
				.finally(()=>{
					setLoading(false)
					setErrorMessageModule(errors);
				});
		};

		getLastDataSimulated()
	}, []);

	const simulacionGrafica : JSX.Element = <>
		<SimulacionGrafica resourceData={$j('service_render/data_proyeccion_dias',EQUIPO_ID)}
			showLegend={false}
			dateStart={$m(datesLastProjection?.fecha_start_xample).format('DD-MM-YYYY')}
			dateEnd={$m(datesLastProjection?.fecha_end_xample).format('DD-MM-YYYY')}
		/>
	</>

	return  (
		<BaseContentView title='titles:simulation_prediction_days'>
			{((loading == false) && (errorMessageModule.length === 0))
				? simulacionGrafica 
				: <ShowMessageInModule message = {errorMessageModule}/> 
			}
		</BaseContentView>
	);
};

export default SimulacionDias;