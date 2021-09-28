import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Col } from 'react-bootstrap';

import { BaseContentView } from '../../Common/BaseContentView';
import { useApi } from "../../../Common/Hooks/useApi";
import FormProjection, { IdataFormProjection, IDatesLastProjection } from '../../../Components/views/Home/Projection/FormProjection';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { $m, $j } from '../../../Common/Utils/Reimports';
import { DateUtils } from '../../../Common/Utils/DateUtils';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';

export const IndexProjection = () => {
	const EQUIPO_ID = "1";

	/*CONST */
	const maxDaysToProjection = 35;
	const countDaysToProjection = maxDaysToProjection - 5;

	/*STATES*/
	const [loadingData, setLoadingData] = useState(true);
	const [tittleModule, setTittleModule] = useState<string>();
	const [errorMessageModule, setErrorMessageModule] = useState<string[]>([]);
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
		const type_projection_value: { [key: string]: any } = JSON.parse(JSON.stringify(data.type_projection));
		setDataForm(data);
		data.type_projection = type_projection_value['value'];
		data.dates_last_projection = datesLastProjection;
		data.last_date_measurement = lastDateProjection;
		await api.post("service_render/projection_operational_var", data)
			.success((response) => { setStatusService('EN PROCESO') })
			.fail("No se pudo consumir el servicio", null, () => { setLoading(false); });
	};

	const onChangeDate = (dateFill: string) => {
		setDateFillEnd(dateFill);
	};

	/*EFFECTS */
	/*OBTENER DATOS ASOCIADOS A LA PROYECCION */
	useEffect(() => {
		const getLastDataSimulated = async () => {
			interface responseInfoRender {
				historial_data_render: IDatesLastProjection,
				info_medicion: { fecha_medicion: string }
			}

			const errors : string[] = [];

			await api.get<responseInfoRender>($j("service_render/get_last_data_simulated",EQUIPO_ID))
				.success((response) => {
		
					response.info_medicion === null
						? errors.push('No se ha encontrado información de la medición 3D') 
						: setLastDateProjection($m(response.info_medicion.fecha_medicion, 'YYYY-MM-DD').format('DD-MM-YYYY'));
					
					response.historial_data_render === null 
						? errors.push('No se han encontrado datos operacionales')
						: setDatesLastProjection(response.historial_data_render)
				})
				.fail("Error al consultar los datos de simulación", () => { setLastDateProjection(undefined) })
				.finally(()=>{
					setLoadingData(false)
					setErrorMessageModule(errors);
				});
		};

		getLastDataSimulated()
	}, []);

	/*OBTENER ESTATUS DEL SERVICIO */
	useEffect(() => {
		const checkStatusService = async () => {
			await api.get<{ status: string, message: string }>($j("service_render/get_status_last_projection_operational",EQUIPO_ID))
				.success((response) => {
					const statusServiceResponse = response.status;
					setStatusService(statusServiceResponse)
					if (statusServiceResponse === 'EN PROCESO' || statusServiceResponse === 'PENDIENTE') {
						const timer = setTimeout(() => checkStatusService(), 30000);
						return () => clearTimeout(timer);
					} else {
						setLoading(false);
						statusServiceResponse === 'ERROR' && addToast('ERROR: ' + response.message, {
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

		(statusService === 'PENDIENTE' ||  statusService === 'EN PROCESO') && checkStatusService()
	}, [statusService]);

	/*TITULO DE MODULO */
	useEffect(() => {
		if (statusService === 'SUCCESS') {
			setTittleModule('Simulación de desgaste')
		} else {
			{ setTittleModule('titles:projection_variable') }
		}
	}, [statusService]);

	/*CALCULAR EL NUMERO DE DIAS A PROYECTAR */
	useEffect(() => {
		if (lastDateProjection !== undefined && dateFillEnd !== undefined) {
			setDaysProjection((DateUtils.differenceBetweenDates(lastDateProjection, dateFillEnd)).toString())
		}
	}, [dateFillEnd]);

	/*ACTUALIZAR FECHA A PROYECTAR */
	useEffect(() => {
		(lastDateProjection !== null && lastDateProjection !== undefined) && 
			setDateFillEnd(($m(lastDateProjection, 'DD-MM-YYYY').add(countDaysToProjection, 'days')).format('DD-MM-YYYY'))
	}, [lastDateProjection])


	const simulacionGrafica: JSX.Element = (<>
		<SimulacionGrafica
			resourceData='service_render/data_projection_operational_var'
			dataForm={dataForm}
			dateStart={lastDateProjection}
			dateEnd={dateFillEnd}
			returnFunction={() => { setStatusService(undefined) }}
		/>
	</>)

	const simulacionForm: JSX.Element = (<>
		<Col sm={6} className='text-left mb-2'>
			<h4>Periodo a considerar para la proyección de desgaste</h4>
		</Col>
		<Col sm={6} className='text-center mb-2'>
			<h5>Fecha de última medición: {lastDateProjection}</h5>
		</Col>
		<Col sm={12} className='mb-2'>
			<FormProjection
				onSubmit={handleSubmitProjection}
				textButtonSubmit={"Simular proyección"}
				lastDateProjection={lastDateProjection}
				dateFillEnd={dateFillEnd}
				daysProjection={daysProjection}
				onChangeDate={onChangeDate}
				dataInitialForm={dataForm}
			/>
		</Col>
	</>)

	const componentShowInModule: JSX.Element = (<>
		{errorMessageModule.length > 0 ? <ShowMessageInModule message = {errorMessageModule}/> : 
			statusService === 'SUCCESS'
				? simulacionGrafica
				: simulacionForm
		}
	</>)

	return (<>
		<BaseContentView title={tittleModule}>
			{ loadingData ? <LoadingSpinner /> : componentShowInModule}
		</BaseContentView>
	</>);
};
