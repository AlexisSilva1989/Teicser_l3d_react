import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';

import { BaseContentView } from '../../Common/BaseContentView';
import { useApi } from "../../../Common/Hooks/useApi";
import FormProjection, { IdataFormProjection, IDataPromedio, IDatesLastProjection } from '../../../Components/views/Home/Projection/FormProjection';
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { $m, $j, $u } from '../../../Common/Utils/Reimports';
import { DateUtils } from '../../../Common/Utils/DateUtils';
import { Buttons } from '../../../Components/Common/Buttons';
import { useCommonRoutes } from '../../../Common/Hooks/useCommonRoutes';

interface responseInfoRender {
	historial_data_render: IDatesLastProjection,
	data_promedio: IDataPromedio
	dates_sampling: {start: string , end:string}
}

export const AddProjection = () => {
	// const EQUIPO_ID = "1";

	/*CONST */
	const maxDaysToProjection = 35;
	const countDaysToProjection = maxDaysToProjection - 5;

	/*STATES*/
	const [loadingData, setLoadingData] = useState(false);
	const [errorMessageModule, setErrorMessageModule] = useState<string[]>([]);
	const [datesLastProjection, setDatesLastProjection] = useState<IDatesLastProjection>();
	const [lastDateProjection, setLastDateProjection] = useState<string>();
	const [dataForm, setDataForm] = useState<IdataFormProjection>();
	const [daysProjection, setDaysProjection] = useState<string>(countDaysToProjection.toString())
	const [dateFillEnd, setDateFillEnd] = useState<string>()
	const [typeProjection, setTypeProjection] = useState<string>('projection30Days')
	const [dataPromedio, setDataPromedio] = useState<IDataPromedio>()
	const [idEquipoSelected, setIdEquipoSelected] = useState<string>();
	const [idComponentSelected, setIdComponentSelected] = useState<string>();
	const [datesSampling, setDatesSampling] = useState<{start: string|undefined , end:string|undefined}>(
		{start: undefined , end:undefined}
	);

	/*HOOKS */
	const api = useApi();
	const { setLoading } = useDashboard();
	const { goBack } = useCommonRoutes();

	/*HANDLES */
	/*EJECUTAR EL SERVICIO DE PROYECCION DE VARIABLES OPERACIONALES */
	const handleSubmitProjection = async (data: IdataFormProjection) => {
		setLoading(true);

		data.type_projection = typeProjection;
		data.date_start_scaling = datesLastProjection?.fecha_start_scaling;
		data.date_end_scaling = datesLastProjection?.fecha_end_scaling;
		data.date_start_fill = datesLastProjection?.fecha_start_fill;
		
		setDataForm(data);

		if(data.tonsForChange){
			data.tonsForChange = data.tonsForChange.replace(/,/g, "");
		}
		await api.post("service_render/projection_operational_var", data)
			.success((response) => {
				goBack();
				setLoading(false);
			})
			.fail("No se pudo consumir el servicio", null, () => { setLoading(false); });
	};

	const onChangeDate = (dateFill: string) => {
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
						: updateLastDataSimulate(response.historial_data_render);
					
					response.historial_data_render && response.historial_data_render.status === "ERROR" && errors.push('Ha ocurrido un error en el último registro de carga de variables operacionales para este componente, por favor realice nuevamente la carga de datos operacionales') 
						
					response.historial_data_render && 
						(response.historial_data_render.status === "PENDIENTE" || response.historial_data_render.status === "EN PROCESO") 
						&& errors.push('La carga de variables operacionales del componente esta pendiente, por favor espere que termine ')
					
					response.data_promedio === null
						? errors.push('No se ha obtenido la data promedio')
						: setDataPromedio(response.data_promedio)
					
					response.dates_sampling.start === null
						? (errors.push('No se ha encontrado fecha de sampling inicial') && setDatesSampling(( state => 
							$u( state, { start: { $set: undefined }
						}))))
						: setDatesSampling(( state => $u( state, { 
							start: { $set: $m(response.dates_sampling.start, 'YYYY-MM-DD').format('DD-MM-YYYY') }
						})))
					
					response.dates_sampling.end === null
						? (errors.push('No se ha encontrado fecha de sampling final') && setDatesSampling(( state => 
							$u( state, { end: { $set: undefined }
						}))))
						: setDatesSampling(( state => $u( state, { 
							end: { $set: $m(response.dates_sampling.end, 'YYYY-MM-DD').format('DD-MM-YYYY')  }
						})))
					
						
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
					errorMessageModule={errorMessageModule}
					datesSampling={datesSampling}
				/>
			</Col>
		</BaseContentView>
	</>);
};
