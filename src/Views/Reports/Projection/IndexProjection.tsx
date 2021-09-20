import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Col } from 'react-bootstrap';

import { BaseContentView } from '../../Common/BaseContentView';
import { useApi } from "../../../Common/Hooks/useApi";
import FormProjection, { IdataFormProjection } from '../../../Components/views/Home/Projection/FormProjection';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';

export const IndexProjection = () => {

	/*STATES*/
	const [tittleModule, setTittleModule] = useState<string>();
	const [statusService, setStatusService] = useState<string>();
	const [lastDateProjection, setLastDateProjection] = useState<string | null>('01-03-2021');
	
	/*HOOKS */
	const api = useApi();
	const { setLoading } = useDashboard();
	const { addToast } = useToasts();

	/*EJECUTAR EL SERVICIO DE PROYECCION DE VARIABLES OPERACIONALES */
	const handleSubmitProjection = async (data: IdataFormProjection) => {
		setLoading(true); 
		const type_projection_value : {[key : string] : any} = JSON.parse(JSON.stringify(data.type_projection));
		data.type_projection = type_projection_value['value']
		await api.post("service_render/projection_operational_var", data)
			.success((response) => {setStatusService('PENDIENTE')})
			.fail("No se pudo consumir el servicio",null, ()=> {setLoading(false);});
	};

	/*OBTENER ESTATUS DEL SERVICIO */
	useEffect(() => {
		const checkStatusService = async () => {
			await api.get<{status: string, message: string}>("service_render/get_status_last_projection_operational")
				.success((response) => {
					const statusServiceResponse = response.status;
					setStatusService(statusServiceResponse)
					if(statusServiceResponse === 'PENDIENTE' && statusService === 'PENDIENTE' ){
						const timer = setTimeout(() => checkStatusService(), 20000);
        				return () => clearTimeout(timer);
					}else{
						setLoading(false);
						statusServiceResponse === 'ERROR' && addToast( 'ERROR: ' + response.message, {
							appearance: 'error',
							autoDismiss: false,
						});
					}
				})
				.fail(
					"Error al consultar status del servicio", 
					() => {
						setStatusService('ERROR');
						setLoading(false);
					}
				);
		};

		statusService === 'PENDIENTE' && checkStatusService()
    }, [statusService]);

	useEffect(() => {
		if(statusService === 'SUCCESS' ){
			setTittleModule('Simulación de desgaste')
		}else{
			{setTittleModule('titles:projection_variable')}
		}
	}, [statusService]);
	
	return (<>
		<BaseContentView title={tittleModule}>
			{ 
				lastDateProjection === null 
				? <ShowMessageInModule message='No se ha encotrado datos de variables operacionales'/>
				: (<>
					{
						statusService === 'SUCCESS' 
						? <> 
							<SimulacionGrafica resourceData='service_render/data_projection_operational_var'/> </>
						: <>
							<Col sm={6} className='text-left mb-2'>
								<h4>Periodo a considerar para la proyección de desgaste</h4>		
							</Col>
							<Col sm={6} className='text-center mb-2'>
								<h5>Fecha de última medición {lastDateProjection}</h5>		
							</Col>
							<Col sm={12} className='mb-2'>
								<FormProjection
									onSubmit={handleSubmitProjection}
									textButtonSubmit={"Simular proyección"}
									lastDateProjection = {lastDateProjection}
								/>
						</Col>
						</>
					}
				</>)
			}
		</BaseContentView>		
	</>);
};
