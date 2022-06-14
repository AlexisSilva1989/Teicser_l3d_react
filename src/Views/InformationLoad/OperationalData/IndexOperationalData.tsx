import React, { useState, useRef, useEffect } from 'react';
import { Col, Button, Row, Modal } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { AxiosError } from 'axios';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { $u, $j, $d, $m } from '../../../Common/Utils/Reimports';
import { SearchBar } from '../../../Components/Forms/SearchBar';
import { BounceLoader } from 'react-spinners';
import { BaseContentView } from '../../Common/BaseContentView';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { RadioSelect } from '.././../../Components/Forms/RadioSelect';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { FileInputWithDescription } from './../../../Components/Forms/FileInputWithDescription';
import { FileUtils } from './../../../Common/Utils/FileUtils';
import { useSearch } from '../../../Common/Hooks/useSearch';
import { useReload } from '../../../Common/Hooks/useReload';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { EquipoTipo } from '../../../Data/Models/Equipo/Equipo';
import { IVariables, SagOperationalColumns, SagOperationalDataImport } from '../../../Data/Models/Render/SagOperationalData';
import { mobo_data_structure, sag_data_structure } from './estructuras/estructuras';
import { IComponente } from '../../../Data/Models/Componentes/Componentes';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { MoboOperationalColumns, MoboOperationalDataImport } from '../../../Data/Models/Render/MoboOperationalData';
import { useNavigation } from '../../../Common/Hooks/useNavigation';

const inicialVariable: IVariables = {
	fillDatesStart: "",
	fillDatesEnd: "",
	samplingDatesStart: "",
	samplingDatesEnd: "",
	xampleDateStart: "",
	xampleDateEnd: "",
	scalingDateStart: "05-10-2018",
	scalingDateEnd: "01-03-2021",
	isRandomSampling: "true",
	csv_import: undefined
}

const options = [
	{
		label: "si",
		value: "true"
	},
	{
		label: "no",
		value: "false"
	}
]

export const IndexOperationalData = () => {
	const inputFile = useRef<HTMLInputElement>(null);

	/*HOOOKS */
	const api = useApi();
	const modalVariable = useShortModal();
	const { capitalize: caps, intl } = useFullIntl();
	const { setLoading } = useDashboard();
	const { addToast } = useToasts();
	const { goto } = useNavigation();

	/*STATES */
	const [display, setDisplay] = useState<string>();
	const [operationalData, setOperationalData] = useState<(SagOperationalDataImport | MoboOperationalDataImport)[]>([]);
	const [variable, setVariables] = useState<IVariables>(inicialVariable);
	const [loadingg, setLoadingg] = useState(false);
	const [isVariable, setIsVariable] = useState(true);
	const [search, doSearch] = useSearch();
	const [reloadTable, doReloadTable] = useReload();
	const [loadingData, setLoadingData] = useState(false);
	const [errorMessageModule, setErrorMessageModule] = useState<string[]>([]);
	// const [statusService, setStatusService] = useState<string>();
	const [idEquipoSelected, setIdEquipoSelected] = useState<string | undefined>();
	const [idComponentSelected, setIdComponentSelected] = useState<string | undefined>(undefined);
	const [tipoEquipoSelected, setTipoEquipoSelected] = useState<string | undefined>(undefined);
	const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([]);
	const [errorsInStructureFile, setErrorsInStructureFile] = useState<string[]>([]);


	/*HANDLES */
	const handleChangeFile = async (file: File | null) => {
		setLoadingg(() => true);
		let dataDocument: (SagOperationalDataImport | MoboOperationalDataImport)[] = [];
		setErrorsInStructureFile([])
		if (file) {
			dataDocument = await FileUtils.readFileToArray<SagOperationalDataImport | MoboOperationalDataImport>(
				file,
				0,
				'A:AE10000',
				getStructureEquipo()
			);
			validateStructureFile(Object.values(dataDocument[0]))
		} else {
			setVariables(state => $u(state, {
				fillDatesStart: { $set: undefined },
				fillDatesEnd: { $set: undefined },
				samplingDatesStart: { $set: undefined },
				samplingDatesEnd: { $set: undefined },
				xampleDateStart: { $set: undefined },
				xampleDateEnd: { $set: undefined },
			}))
		}
		const dataFilter = mappedDataForDate(dataDocument)

		if (dataDocument.length > 0) { setIsVariable(() => false) }
		else { setIsVariable(() => true) }

		setOperationalData(dataFilter)
		doReloadTable()
		setVariables(state => $u(state, { csv_import: { $set: file } }))
		setLoadingg(() => false);
	}

	const getStructureEquipo = () => {
		return tipoEquipoSelected == "SAG" ? sag_data_structure : mobo_data_structure
	}

	const validateStructureFile = (header: string[]) => {
		const errosInStructureFile: string[] = []
		const structureFile = getStructureEquipo()

		structureFile.forEach((key, index) => {
			if (typeof header[index] === 'string') {
				if (header[index].toUpperCase() !== key.toUpperCase()) {
					errosInStructureFile.push(`Columna N° ${index + 1} debe ser ${key}`)
				}
			} else {
				errosInStructureFile.push(`Columna N° ${index + 1} debe ser ${key}`)
			}

		})
		setErrorsInStructureFile(errosInStructureFile.length > 0 ? [errosInStructureFile.join(', ')] : [])
	}

	const mappedDataForDate = (FileReception: (SagOperationalDataImport | MoboOperationalDataImport)[]) => {
		return FileReception.map((FileReception, index) => {
			return ExcelDateToJSDate(FileReception, index)
		}
		).filter(x => x.TIMESTAMP > 0);
	}

	const ExcelDateToJSDate = (data: SagOperationalDataImport | MoboOperationalDataImport, index: number) => {
		const dt = new Date(1900, 0, 0);
		dt.setDate(dt.getDate() + data.TIMESTAMP);
		const date = $m(dt).format('YYYY-MM-DD');

		let initial: SagOperationalDataImport | MoboOperationalDataImport

		if (tipoEquipoSelected == "SAG") {
			data = data as SagOperationalDataImport
			initial = {
				TIMESTAMP: data.TIMESTAMP,
				TIMESTAMP_NEW: date,
				EQUIPO: data.EQUIPO,
				TON_ALIM: data.TON_ALIM,
				TRAT_MOLINO: data.TRAT_MOLINO,
				ENERGIA: data.ENERGIA,
				POTENCIA: data.POTENCIA,
				VEL_RPM: data.VEL_RPM,
				ESTADO: data.ESTADO,
				SENTIDO: data.SENTIDO,
				PRES_DESC_1: data.PRES_DESC_1,
				PRES_DESC_2: data.PRES_DESC_2,
				AGUA_PROC: data.AGUA_PROC,
				SOLIDOS: data.SOLIDOS,
				PEBBLES: data.PEBBLES,
				PAS125: data.PAS125,
				PAS200: data.PAS200,
				PAS400: data.PAS400,
				BOLAS_TON: data.BOLAS_TON,
				DWI: data.DWI,
				BWI: data.BWI,
				PH: data.PH,
				AI: data.AI,
				CUT: data.CUT,
				MO: data.MO,
				FET: data.FET,
				AS: data.AS,
				VEL_SENTIDO: data.VEL_SENTIDO,
				TON_ACUM_CAMP: data.TON_ACUM_CAMP,
				DIAS_ACUM_CAMP: data.DIAS_ACUM_CAMP
			};
		} else {
			data = data as MoboOperationalDataImport
			initial = {
				TIMESTAMP: data.TIMESTAMP,
				TIMESTAMP_NEW: date,
				EQUIPO: data.EQUIPO,
				TRAT_MOLINO: data.TRAT_MOLINO,
				ENERGIA: data.ENERGIA,
				BOMBAS: data.BOMBAS,
				AGUA_PROC: data.AGUA_PROC,
				BOLAS_TON: data.BOLAS_TON,
				SOLIDOS: data.SOLIDOS,
				POTENCIA: data.POTENCIA,
				ESTADO: data.ESTADO,
				DWI: data.DWI,
				BWI: data.BWI,
				PH: data.PH,
				AI: data.AI,
				CUT: data.CUT,
				MO: data.MO,
				FET: data.FET,
				AS: data.AS,
				TON_ACUM_CAMP: data.TON_ACUM_CAMP,
				DIAS_ACUM_CAMP: data.DIAS_ACUM_CAMP
			};
		}
		return initial;
	}

	const handleChangeDisplay = (display: string | undefined) => {
		setDisplay(state => $u(state, { $set: display }));
	}

	/* Handlers */
	/*RENDER SIMULATION */
	const onSimulateProjection = async () => {
		const formData = new FormData();
		const headers = { headers: { "Content-Type": "multipart/form-data" } };

		for (const property in variable) {
			let index: keyof IVariables = property as keyof IVariables;
			formData.append(property, variable[index]);
		}

		idEquipoSelected !== undefined && formData.append('equipoId', idEquipoSelected);
		idComponentSelected !== undefined && formData.append('componenteId', idComponentSelected);

		setLoading(true);
		await api.post("service_render/render_data", formData, headers)
			.success((response) => {
				goto.absolute('base.simulation_days')
			})
			.fail("No se pudo consumir el servicio")
			.finally(() => {
				setLoading(false);
			});
	}

	const descargarEjemplo = () => {
		setLoading(true);
		api.get<string | Blob | File>($j('ejemplo_variables'), { responseType: 'blob' }).success(e => {
			$d(e, 'carga_variables_ejemplo.csv');
			setLoading(false);
			addToast(caps('success:base.success'), {
				appearance: 'success',
				autoDismiss: true,
			});
		}).fail('base.post');
	}

	const updateComponentes = async (equipoId: string) => {
		await ax.get<IComponente[]>('service_render/equipos/componentes_entrenados', { params: { equipo_id: equipoId } })
			.then((response) => {
				setComponentsForTraining(response.data);
				setIdComponentSelected(response.data.length > 0 ? response.data[0].id : undefined);
			})
			.catch((e: AxiosError) => {
				if (e.response) {
					addToast(caps('errors:base.load', { element: "componentes" }), {
						appearance: 'error',
						autoDismiss: true,
					});
				}
			}).finally(() => {
				setLoadingData(false);
			});
	}

	/*EFFECTS */

	useEffect(() => {
		const fechaMaxima = operationalData.reduce((accumulator, currentValue) => {

			if (accumulator == "") {
				accumulator = currentValue.TIMESTAMP_NEW
			}

			var f1 = new Date(accumulator);
			var f2 = new Date(currentValue.TIMESTAMP_NEW);


			if (f2 > f1) {
				accumulator = currentValue.TIMESTAMP_NEW
			}
			return accumulator;
		}
			, "");

		if ($m(fechaMaxima).isValid()) {
			setVariables(state => $u(state, {
				fillDatesStart: { $set: $m(fechaMaxima).add(1, "day").format('DD-MM-YYYY') },
				fillDatesEnd: { $set: $m(fechaMaxima).add(30, "days").format('DD-MM-YYYY') },
				samplingDatesStart: { $set: $m(fechaMaxima).subtract(30, "days").format('DD-MM-YYYY') },
				samplingDatesEnd: { $set: $m(fechaMaxima).format('DD-MM-YYYY') },
				xampleDateStart: { $set: $m(fechaMaxima).format('DD-MM-YYYY') },
				xampleDateEnd: { $set: $m(fechaMaxima).add(30, "days").format('DD-MM-YYYY') },
				measurementDate: { $set: $m(fechaMaxima).format('DD-MM-YYYY') }
			}))
		}
	}, [operationalData])

	/*OBTENER DATOS ASOCIADOS A LA PROYECCION */
	useEffect(() => {
		if (idEquipoSelected == undefined) { return }
		setLoadingData(true);
		updateComponentes(idEquipoSelected);
	}, [idEquipoSelected]);

	// /*OBTENER ESTATUS DEL SERVICIO */
	// useEffect(() => {
	// 	if (idEquipoSelected == undefined) { return }
	// 	const checkStatusService = async () => {
	// 		await api.get<{ status: string, message: string }>($j("service_render/statusLastDataRender", idEquipoSelected))
	// 			.success((response) => {
	// 				const statusServiceResponse = response.status;
	// 				setStatusService(statusServiceResponse)
	// 				if (statusServiceResponse === 'EN PROCESO' || statusServiceResponse === 'PENDIENTE') {
	// 					const timer = setTimeout(() => checkStatusService(), 30000);
	// 					return () => clearTimeout(timer);
	// 				} else {
	// 					setLoading(false);
	// 					statusServiceResponse === 'ERROR' && addToast('ERROR: ' + response.message, {
	// 						appearance: 'error',
	// 						autoDismiss: false,
	// 					});
	// 				}
	// 			})
	// 			.fail(
	// 				"Error al consultar status del servicio",
	// 				() => {
	// 					setStatusService('ERROR');
	// 					setLoading(false);
	// 				}
	// 			);
	// 	};

	// 	(statusService === 'PENDIENTE' || statusService === 'EN PROCESO') && checkStatusService()
	// }, [statusService]);

	useEffect(() => {
		((variable.csv_import !== null) && (variable.csv_import !== undefined)) && handleChangeFile(variable.csv_import)
	}, [tipoEquipoSelected])

	/*Componentes */
	/*CAMPOS PARA RELLENO DE FECHAS */
	const fieldsFillDates: JSX.Element = <>
		<hr />
		<Row className="mb-3">
			<Col sm={6}>
				<Datepicker
					label='Fecha inicial de relleno'
					value={variable.fillDatesStart}
					onChange={value => {
						setVariables(state => $u(state, {
							fillDatesStart: { $set: value }
						}))
					}}
				/>
			</Col>
			<Col sm={6}>
				<Datepicker
					label='Fecha final de relleno'
					value={variable.fillDatesEnd}
					onChange={value => {
						setVariables(state => $u(state, {
							fillDatesEnd: { $set: value }
						}))
					}}
				/>
			</Col>
		</Row>

		{/* ---------------------------- */}

		<Row className="mb-3">
			<Col sm={6}>
				<Datepicker
					label='Fecha inicial de entrenamiento'
					value={variable.samplingDatesStart}
					onChange={value => {
						setVariables(state => $u(state, {
							samplingDatesStart: { $set: value }
						}))
					}}
				/>
			</Col>
			<Col sm={6}>
				<Datepicker
					label='Fecha final de entrenamiento'
					value={variable.samplingDatesEnd}
					onChange={value => {
						setVariables(state => $u(state, {
							samplingDatesEnd: { $set: value }
						}))
					}}
				/>
			</Col>
			<Col sm={12}>
				<Col className="alert alert-info mt-2">
					<i className="fa fa-info mr-2" aria-hidden="true" />Fechas (sampling) que seran tomadas en cuenta para el entrenamiento
				</Col>
			</Col>
		</Row>


		{/* ---------------------------- */}
	</>

	/*MODAL PARA FORMULARIO DE VARIABLES */
	const modalFormVariables: JSX.Element = <>
		<Modal show={modalVariable.visible} onHide={modalVariable.hide}>
			<Modal.Header closeButton>
				<b>Variables de operación</b>
			</Modal.Header>
			<Modal.Body>
				{/* <Row className="mb-3">
					<Col sm={4}>
						<label><b>Fill dates:</b></label><br></br>
						<RadioSelect
							style={{ display: "inline" }}
							name='pay_total_quoted'
							options={options}
							value={variable.isRandomSampling}
							onChange={e => setVariables(s => $u(s, { isRandomSampling: { $set: e } }))}
						/>
					</Col>
				</Row> */}
				<Row className="mb-3">
					<Col sm={6}>
						<Datepicker
							label='Fecha inicial de proyección'
							value={variable.xampleDateStart}
							onChange={value => {
								setVariables(state => $u(state, {
									xampleDateStart: { $set: value }
								}))
							}}
						/>
					</Col>
					<Col sm={6}>
						<Datepicker
							label='Fecha final de proyección'
							value={variable.xampleDateEnd}
							onChange={value => {
								setVariables(state => $u(state, {
									xampleDateEnd: { $set: value }
								}))
							}}
						/>
					</Col>
					<Col sm={12}>
						<Col className="alert alert-info mt-2">
							<i className="fa fa-info mr-2" aria-hidden="true" />Representan el rango de fechas que serán proyectados.
						</Col>
					</Col>

				</Row>

				{variable.isRandomSampling === 'true' && fieldsFillDates}

				{/* ---------------------------- */}
				{/* <hr /> */}

				{/* <Row className="mb-3">
					<Col sm={6}>
						<Datepicker
							label='Scale start'
							value={variable.scalingDateStart}
							onChange={value => {
								setVariables(state => $u(state, {
									samplingDatesStart: { $set: value }
								}))
							}}
						/>
					</Col>
					<Col sm={6}>
						<Datepicker
							label='Scale end'
							value={variable.scalingDateEnd}
							onChange={value => {
								setVariables(state => $u(state, {
									samplingDatesEnd: { $set: value }
								}))
							}}
						/>
					</Col>
				</Row> */}

				{/* ---------------------------- */}

				{/* <Col sm={2} className="offset-8">
					<Button className='d-flex justify-content-start btn-primary mr-3 mt-5' onClick={()=>{modalVariable.hide()}}>
						Guardar
					</Button>
				</Col> */}

			</Modal.Body>
		</Modal>
	</>

	/*ELEMENTOS DEL MODULO */
	const componentShowInModule: JSX.Element = <>

		<Col sm={3}>
			<ApiSelect<EquipoTipo>
				label='Equipo'
				name='equipo_select'
				placeholder='Seleccione equipo'
				source={'service_render/equipos'}
				value={idEquipoSelected}
				selector={(option: EquipoTipo) => {
					return { label: option.nombre, value: option.id.toString(), tipo: option.equipo_tipo.nombre_corto };
				}}
				valueInObject={true}
				onChange={(data) => {
					setTipoEquipoSelected(data.tipo)
					setIdEquipoSelected(data.value)
				}}
			/>
		</Col>

		<Col sm={3}>
			<ApiSelect<IComponente>
				name='componente'
				label='Componente'
				placeholder='Seleccione componente'
				source={componentsForTraining}
				value={idComponentSelected}
				selector={(option: IComponente) => {
					return { label: option.nombre, value: option.id.toString() };
				}}
				onChange={(data) => {
					setIdComponentSelected(data);
				}}
				isLoading={loadingData}
				isDisabled={loadingData}
				errors={componentsForTraining.length == 0 ? ['El equipo seleccionado no tiene componentes entrenados'] : []}
			/>
		</Col>

		<Col sm={3}>
			<FileInputWithDescription
				label='Archivo con variables operacionales'
				id={"inputFile"}
				onChange={handleChangeFile}
				onChangeDisplay={handleChangeDisplay}
				display={display}
				accept={["csv"]}
			/>
		</Col>

		<Col sm={3} className='d-flex justify-content-end align-items-center '>
			<Button variant="outline-primary" className='btn-outline-primary' onClick={descargarEjemplo} >
				Descargar ejemplo
			</Button>
		</Col>

		<Col className={"pl-0 pr-0"}>

			{loadingData ? <Col sm={12}> <LoadingSpinner /> </Col> : errorMessageModule.length > 0
				? <ShowMessageInModule message={errorMessageModule} />
				: (<>

					<Col className='d-flex justify-content-between align-items-end pr-0 pl-0'>
						<Col sm={6}>
							<h5>{tipoEquipoSelected && (`Molino tipo: ${tipoEquipoSelected}`)}</h5>
							<h5>{variable.xampleDateStart && (
								` Fecha a proyectar: ${variable.xampleDateStart} / ${variable.xampleDateEnd}`)
							}
							</h5>
						</Col>
						<Col className='col-lg-3 col-md-3 col-sm-6'>
							<SearchBar onChange={doSearch} outerClassName={"mb-2"} />
						</Col>
					</Col>

					<Col sm={12}>
						{loadingg ? (
							<BounceLoader css={{ margin: '2.25rem auto' } as any} color='var(--primary)' />
						) : (
							errorsInStructureFile.length > 0
								? (
									<Col className="alert alert-warning mt-3 text-center">
										<i className="fa fa-exclamation-triangle fa-4x m-3" aria-hidden="true" />
										<h3>Error en estructura de archivo</h3>
										<h5>El archivo que ha sido cargado no cumple con la estructura esperada,
											por favor verifique las siguientes posiciones en la cabecera: </h5>

										{errorsInStructureFile.map((error, index) => <span key={`structure-error-${index}`}>{error}</span>)}

									</Col>
								)
								: (<ApiTable<any>
									columns={tipoEquipoSelected === 'SAG'
										? SagOperationalColumns(intl)
										: MoboOperationalColumns(intl)
									}

									source={operationalData
										? tipoEquipoSelected === 'SAG'
											? operationalData as SagOperationalDataImport[]
											: operationalData as MoboOperationalDataImport[]
										: []
									}
									search={search}
									reload={reloadTable}
								/>)
						)}
					</Col>

					<Col sm={12} className='d-flex justify-content-between mt-5'>
						<Button onClick={() => { modalVariable.show() }} disabled={isVariable}>
							Ver variables de operación
						</Button>
						<Button onClick={onSimulateProjection}
							disabled={(idComponentSelected === undefined || isVariable || errorsInStructureFile.length > 0)}>
							Simular proyección
						</Button>
					</Col>

					<div>
						{modalFormVariables}
					</div>
				</>)
			}
		</Col>
	</>

	return (
		<BaseContentView title='titles:operational_data'>
			{componentShowInModule}
		</BaseContentView>
	);
};
