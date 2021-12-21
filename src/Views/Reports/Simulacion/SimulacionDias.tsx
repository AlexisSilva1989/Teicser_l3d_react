import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { useApi } from '../../../Common/Hooks/useApi';
import { $j, $m } from '../../../Common/Utils/Reimports';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { IDatesLastProjection } from '../../../Components/views/Home/Projection/FormProjection';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { Equipo } from '../../../Data/Models/Equipo/Equipo';
import { BaseContentView } from '../../Common/BaseContentView';

const SimulacionDias = () => {
	const api = useApi();

	const [datesLastProjection, setDatesLastProjection] = useState<IDatesLastProjection>();
	const [errorMessageModule, setErrorMessageModule] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [idEquipoSelected, setIdEquipoSelected] = useState<string>();
	
	/*OBTENER DATOS ASOCIADOS A LA PROYECCION */
	useEffect(() => {
		const getLastDataSimulated = async () => {
			interface responseInfoRender {
				historial_data_render: IDatesLastProjection,
			}
			if (idEquipoSelected == undefined){return}
			const errors : string[] = [];
			await api.get<responseInfoRender>($j("service_render/get_last_data_simulated/",idEquipoSelected,"original"))
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
		setLoading(true)

		getLastDataSimulated()
	}, [idEquipoSelected]);

	const simulacionGrafica : JSX.Element = <>

		{idEquipoSelected && (<SimulacionGrafica 
			resourceData={$j('service_render/extend/data_proyeccion',idEquipoSelected)}
		/>)}
	</>

	return  (
		<BaseContentView title='titles:simulation_prediction_days'>
			<Col sm={12}>
				<Col sm={3}>
					<ApiSelect<Equipo>
						name='equipo_select'
						placeholder='Seleccione Equipo'
						source={'service_render/equipos'}
						value={idEquipoSelected}
						selector={(option) => {
							return { display: option.nombre, value: option.id.toString() };
						}}
						onChange={ (data) => {
							setIdEquipoSelected(data);
						}}
					/>
				</Col>
			</Col>
			<Col sm={12} className='mt-5'>
				{((loading == false) && (errorMessageModule.length === 0))
					? simulacionGrafica 
					: <ShowMessageInModule message = {errorMessageModule}/> 
				}
			</Col>
		</BaseContentView>
	);
};

export default SimulacionDias;