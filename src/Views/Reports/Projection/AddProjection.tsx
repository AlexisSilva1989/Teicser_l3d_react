import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Col } from 'react-bootstrap';

import { BaseContentView } from '../../Common/BaseContentView';
import { useApi } from "../../../Common/Hooks/useApi";
import FormProjection, { IdataFormProjection, IDataPromedio, IDatesLastProjection } from '../../../Components/views/Home/Projection/FormProjection';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import SimulacionGrafica from '../../../Components/views/Home/simulation/SimulacionGrafica';
import { $m, $j, $u } from '../../../Common/Utils/Reimports';
import { DateUtils } from '../../../Common/Utils/DateUtils';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { Buttons } from '../../../Components/Common/Buttons';
import { useCommonRoutes } from '../../../Common/Hooks/useCommonRoutes';

interface responseInfoRender {
	historial_data_render: IDatesLastProjection,
	data_promedio: IDataPromedio
}

export const AddProjection = () => {
	// const EQUIPO_ID = "1";

	/*CONST */
	const maxDaysToProjection = 35;
	const countDaysToProjection = maxDaysToProjection - 5;

	/*STATES*/
	const [loadingData, setLoadingData] = useState(false);
	const [errorMessageModule, setErrorMessageModule] = useState<string[]>([]);
	const [statusService, setStatusService] = useState<string>();
	const [datesLastProjection, setDatesLastProjection] = useState<IDatesLastProjection>();
	const [lastDateProjection, setLastDateProjection] = useState<string>();
	const [dataForm, setDataForm] = useState<IdataFormProjection>();
	const [daysProjection, setDaysProjection] = useState<string>(countDaysToProjection.toString())
	const [dateFillEnd, setDateFillEnd] = useState<string>()
	const [typeProjection, setTypeProjection] = useState<string>('projection30Days')
	const [dataPromedio, setDataPromedio] = useState<IDataPromedio>()
	const [idEquipoSelected, setIdEquipoSelected] = useState<string>();
	const [idComponentSelected, setIdComponentSelected] = useState<string>();

	/*HOOKS */
	const api = useApi();
	const { setLoading } = useDashboard();
	const { goBack } = useCommonRoutes();

	/*HANDLES */
	/*EJECUTAR EL SERVICIO DE PROYECCION DE VARIABLES OPERACIONALES */
	const handleSubmitProjection = async (data: IdataFormProjection) => {
		console.log('data: ', data);
		setLoading(true);
		const type_projection_value: { [key: string]: any } = JSON.parse(JSON.stringify(data.type_projection));
		setDataForm(data);
		data.type_projection = type_projection_value['value'];
		data.dates_last_projection = datesLastProjection;
		data.last_date_measurement = lastDateProjection;
		data.tonsForChange = data.tonsForChange.replace(/,/g, "");
		await api.post("service_render/projection_operational_var", data)
			.success((response) => {
				goBack();
				setLoading(false);
			})
			.fail("No se pudo consumir el servicio", null, () => { setLoading(false); });
	};

	const onChangeDate = (dateFill: string) => {
		console.log('dateFill: ', dateFill);
		setDateFillEnd(dateFill);
	};

	const onChangeTypeProjection = (typeProjection: string) => {
		if (dataForm) { dataForm.type_projection = typeProjection }
		setTypeProjection(typeProjection);
	};

	const onChangeEquipo = (equipoId: string) => {
		setIdComponentSelected(undefined);
		setIdEquipoSelected(equipoId);
	}

	const onChangComponent = (componentId: string | undefined) => {
		setIdComponentSelected(componentId);
	}

	const updateLastDataSimulate = (historial_data_render: IDatesLastProjection) => {
		setDatesLastProjection(historial_data_render);
		setLastDateProjection($m(historial_data_render.fecha_medicion, 'YYYY-MM-DD').format('DD-MM-YYYY'))
	}

	/*EFFECTS */
	/*OBTENER DATOS ASOCIADOS A LA PROYECCION */
	useEffect(() => {
		const getLastDataSimulated = async () => {
			if (idEquipoSelected == undefined || idComponentSelected == undefined || idComponentSelected == '-1') {
				return
			}
			
			setLoadingData(true);

			const errors: string[] = [];

			await api.get<responseInfoRender>($j("service_render/get_last_data_simulated"),
				{ params: {idEquipoSelected, typeProjection, idComponentSelected} } )
				.success((response) => {

					response.historial_data_render === null
						? errors.push('No se han encontrado datos operacionales')
						: updateLastDataSimulate(response.historial_data_render)

					response.data_promedio === null
						? errors.push('No se ha obtenido la data promedio')
						: setDataPromedio(response.data_promedio)
				})
				.fail("Error al consultar los datos de simulación", () => {
					setLastDateProjection(undefined)
					errors.push('Se ha producido un error obteniendo los datos asociados a la proyección')
				})
				.finally(() => {
					setLoadingData(false)
					setErrorMessageModule(errors);
				});
		};
		getLastDataSimulated()
	}, [typeProjection, idEquipoSelected, idComponentSelected]);

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



	const simulacionForm: JSX.Element = (<>
		{/* <Col sm={6} className='text-left mb-2'>
			<h5>Periodo a considerar para la proyección de desgaste</h5>
		</Col>
		<Col sm={6} className='text-center mb-2'>
			<h5>Fecha de última medición: {lastDateProjection}</h5>
		</Col> */}

	</>)

	return (<>
		<BaseContentView title={'titles:projection_variable'}>
			<Col sm={12} className="mb-4">
				<Buttons.Back />
			</Col>

			<Col sm={12} className='mb-2'>
				<FormProjection
					onSubmit={handleSubmitProjection}
					textButtonSubmit={"Simular proyección"}
					lastDateProjection={lastDateProjection}
					dateFillEnd={dateFillEnd}
					typeProjection={typeProjection}
					daysProjection={daysProjection}
					onChangeDate={onChangeDate}
					onChangeTypeProjection={onChangeTypeProjection}
					onChangeEquipo={onChangeEquipo}
					onChangeComponent={onChangComponent}
					idEquipoSelected={idEquipoSelected}
					idComponentSelected={idComponentSelected}
					dataInitialForm={dataForm}
					dataPromedio={dataPromedio}
					isLoadingData={loadingData}
				/>
			</Col>
		</BaseContentView>
	</>);
};
