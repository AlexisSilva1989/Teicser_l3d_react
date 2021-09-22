import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Col } from 'react-bootstrap';

import { BaseContentView } from '../../Common/BaseContentView';
import { useApi } from "../../../Common/Hooks/useApi";
import FormProjection, { IdataFormProjection, IDatesLastProjection } from '../../../Components/views/Home/Projection/FormProjection';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { $m } from '../../../Common/Utils/Reimports';
import { DateUtils } from '../../../Common/Utils/DateUtils';

export const IndexProjection = () => {
	
	/*CONST */
	const maxDaysToProjection = 35;
	const countDaysToProjection = maxDaysToProjection - 5;

	/*STATES*/
	const [tittleModule, setTittleModule] = useState<string>();
	const [statusService, setStatusService] = useState<string>();
	const [datesLastProjection, setDatesLastProjection] = useState<IDatesLastProjection>();
	const [lastDateProjection, setLastDateProjection] = useState<string>();
	const [dataForm, setDataForm] = useState<IdataFormProjection>();
	const [daysProjection, setDaysProjection] = useState<string>(countDaysToProjection.toString())
	const [dateFillEnd, setDateFillEnd] = useState<string>()
	
	/*HOOKS */
	const api = useApi();
	const { setLoading } = useDashboard();
	const { addToast } = useToasts();

	/*HANDLES */
	/*EJECUTAR EL SERVICIO DE PROYECCION DE VARIABLES OPERACIONALES */
	const handleSubmitProjection = async (data: IdataFormProjection) => {
		setLoading(true); 
		const type_projection_value : {[key : string] : any} = JSON.parse(JSON.stringify(data.type_projection));
		setDataForm(data);
		data.type_projection = type_projection_value['value'];
		data.dates_last_projection = datesLastProjection;
		await api.post("service_render/projection_operational_var", data)
			.success((response) => {setStatusService('PENDIENTE')})
			.fail("No se pudo consumir el servicio",null, ()=> {setLoading(false);});
	};

	const onChangeDate = (dateFill: string) =>{
		setDateFillEnd(dateFill);
	};

	/*EFFECTS */
	/*OBTENER ESTATUS DEL SERVICIO */
	useEffect(() => {
		const getLastDataSimulated = async () => {
			await api.get<IDatesLastProjection>("service_render/get_last_data_simulated/1")
				.success((response) => {
					console.log('response: ', response);
					if (Object.entries(response).length === 0 && response.constructor === Object ){
						setLastDateProjection(undefined);
					}else{
						setLastDateProjection($m(response.fecha_start_fill,'YYYY-MM-DD').format('DD-MM-YYYY'))
						setDatesLastProjection(response)
					}
				})
				.fail(
					"Error al consultar los datos de simulación", 
					() => {setLastDateProjection(undefined)}
				);
		};

		getLastDataSimulated()
    }, []);

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

	/*TITULO DE MODULO */
	useEffect(() => {
		if(statusService === 'SUCCESS' ){
			setTittleModule('Simulación de desgaste')
		}else{
			{setTittleModule('titles:projection_variable')}
		}
	}, [statusService]);
	
	/*CALCULAR EL NUMERO DE DIAS A PROYECTAR */
	useEffect(() => {
		if(lastDateProjection !== undefined && dateFillEnd !== undefined){
			setDaysProjection((DateUtils.differenceBetweenDates(lastDateProjection,dateFillEnd)).toString())
		}
	}, [dateFillEnd]);

	/*ACTUALIZAR FECHA A PROYECTAR */
	useEffect(() => {
		lastDateProjection !== undefined && setDateFillEnd(
			($m(lastDateProjection,'DD-MM-YYYY').add(countDaysToProjection, 'days')).format('DD-MM-YYYY')
		)
	},[lastDateProjection])

	return (<>
		<BaseContentView title={tittleModule}>
			{ 
				(lastDateProjection === null || lastDateProjection === undefined)
				? <ShowMessageInModule message='No se han encotrado datos de simulación'/>
				: (<>
					{
						statusService === 'SUCCESS' 
						? <> 
							<SimulacionGrafica 
								resourceData='service_render/data_projection_operational_var'
								dataForm = {dataForm}
								returnFunction = {() => {setStatusService(undefined)}}
								lastDateProjection = {lastDateProjection}
							/> 
						</>
						: <>
							<Col sm={6} className='text-left mb-2'>
								<h4>Periodo a considerar para la proyección de desgaste</h4>		
							</Col>
							<Col sm={6} className='text-center mb-2'>
								<h5>Fecha de última medición: </h5>		
							</Col>
							<Col sm={12} className='mb-2'>
								<FormProjection
									onSubmit = {handleSubmitProjection}
									textButtonSubmit = {"Simular proyección"}
									lastDateProjection = {lastDateProjection}
									dateFillEnd = {dateFillEnd}
									daysProjection = {daysProjection}
									onChangeDate = {onChangeDate}
									dataInitialForm = {dataForm}
								/>
							</Col>
						</>
					}
				</>)
			}
		</BaseContentView>		
	</>);
};
