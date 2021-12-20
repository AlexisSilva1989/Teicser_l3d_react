import React, { useState, useRef, useEffect } from 'react';
import { Col, Button, Row, Modal } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { RadioSelect } from '.././../../Components/Forms/RadioSelect';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { FileInputWithDescription } from './../../../Components/Forms/FileInputWithDescription';
import { FileUtils } from './../../../Common/Utils/FileUtils';
import { $u, $j, $d, $m } from '../../../Common/Utils/Reimports';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { SearchBar } from '../../../Components/Forms/SearchBar';
import { BounceLoader } from 'react-spinners';
import { useSearch } from '../../../Common/Hooks/useSearch';
import { useReload } from '../../../Common/Hooks/useReload';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useToasts } from 'react-toast-notifications';
import { LoadingSpinner } from '../../../Components/Common/LoadingSpinner';
import { ShowMessageInModule } from '../../../Components/Common/ShowMessageInModule';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { Equipo } from '../../../Data/Models/Equipo/Equipo';
import { IVariables, OperationalColumns, OperationalDataImport } from '../../../Data/Models/Render/OperationalData';

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

	/*STATES */
	const [display, setDisplay] = useState<string>();
	const [operationalData, setOperationalData] = useState<OperationalDataImport[]>([]);
	const [variable, setVariables] = useState<IVariables>(inicialVariable);
	const [loadingg, setLoadingg] = useState(false);
	const [isVariable, setIsVariable] = useState(true);
	const [search, doSearch] = useSearch();
	const [reloadTable, doReloadTable] = useReload();
	const [loadingData, setLoadingData] = useState(false);
	const [errorMessageModule, setErrorMessageModule] = useState<string[]>([]);
	const [statusService, setStatusService] = useState<string>();
	const [idEquipoSelected, setIdEquipoSelected] = useState<string>();

	/*HANDLES */
	const handleChangeFile = async (file: File | null) => {
		setLoadingg(() => true);
		let dataDocument: OperationalDataImport[] = [];
		if (file) {
			dataDocument = await FileUtils.readFileToArray<OperationalDataImport>(
				file,
				0,
				'A:AE10000',
				[
					'TIMESTAMP',
					'MIN_PROC_TPH',
					'TRAT_SAG_1011',
					'ENE_CONSU_KWH',
					'POT_KW',
					'VEL_RPM',
					'ESTADO',
					'SENT',
					'PRES_DESC_PSI',
					'CON_AGUA',
					'SOLIDOS',
					'PEBBLES',
					'BOLAS_TON',
					'RUIDO_N',
					'RUIDO_S',
					'CAL_S',
					'CAL_N',
					'PAS_125',
					'PAS_200',
					'PAS_400',
					'DWI',
					'BWI',
					'POR_SOL',
					'LEY_CUT',
					'LEY_CUSC',
					'PPM_MO',
					'LEY_FET',
					'LEY_AS',
					'TON_ACUM_CAMP',
					'AREA_CAMP',
					'CAMP_DAY',
				]
			);
		}
		const dataFilter = mappedDataForDate(dataDocument)

		if (dataDocument.length > 0) {
			setIsVariable(() => false)
		} else {
			setIsVariable(() => true)
		}

		setOperationalData(dataFilter)
		doReloadTable()
		setVariables(state => $u(state, {
			csv_import: { $set: file },
		}))
		setLoadingg(() => false);
	}

	const mappedDataForDate = (FileReception: OperationalDataImport[]) => {
		return FileReception.map((FileReception, index) => { return ExcelDateToJSDate(FileReception, index) }).filter(x => x.TIMESTAMP > 0);
	}

	function ExcelDateToJSDate(data: OperationalDataImport, index: number) {
		var dt = new Date (1900,0,0);
		dt.setDate (dt.getDate () + data.TIMESTAMP);
		const date = $m(dt).format('YYYY-MM-DD');
		
		const initial = {
			TIMESTAMP: data.TIMESTAMP,
			TIMESTAMP_NEW: date,
			MIN_PROC_TPH: data.MIN_PROC_TPH,
			TRAT_SAG_1011: data.TRAT_SAG_1011,
			ENE_CONSU_KWH: data.ENE_CONSU_KWH,
			POT_KW: data.POT_KW,
			VEL_RPM: data.VEL_RPM,
			POR_SOL: data.POR_SOL,
			ESTADO: data.ESTADO,
			SENT: data.SENT,
			PRES_DESC_PSI: data.PRES_DESC_PSI,
			CON_AGUA: data.CON_AGUA,
			SOLIDOS: data.SOLIDOS,
			PEBBLES: data.PEBBLES,
			BOLAS_TON: data.BOLAS_TON,
			RUIDO_N: data.RUIDO_N,
			RUIDO_S: data.RUIDO_S,
			CAL_S: data.CAL_S,
			CAL_N: data.CAL_N,
			PAS_125: data.PAS_125,
			PAS_200: data.PAS_200,
			PAS_400: data.PAS_400,
			DWI: data.DWI,
			BWI: data.BWI,
			LEY_CUT: data.LEY_CUT,
			LEY_CUSC: data.LEY_CUSC,
			PPM_MO: data.PPM_MO,
			LEY_FET: data.LEY_FET,
			LEY_AS: data.LEY_AS,
			TON_ACUM_CAMP: data.TON_ACUM_CAMP,
			AREA_CAMP: data.AREA_CAMP,
			CAMP_DAY: data.CAMP_DAY,
		};
		return initial;
	}

	const handleChangeDisplay = (display: string | undefined) => {
		setDisplay(state => $u(state, { $set: display }));
	}

	/* Handlers */
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


		setVariables(state => $u(state, {
			fillDatesStart: { $set: $m(fechaMaxima).add(1, "day").format('DD-MM-YYYY') },
			fillDatesEnd: { $set: $m(fechaMaxima).add(30, "days").format('DD-MM-YYYY') },
			samplingDatesStart: { $set: $m(fechaMaxima).subtract(30, "days").format('DD-MM-YYYY')},
			samplingDatesEnd: { $set: $m(fechaMaxima).format('DD-MM-YYYY')},
		}))

		
	}, [operationalData])

	/*RENDER SIMULATION */
	const onSimulateProjection = async () => {
		const formData = new FormData();
		const headers = { headers: { "Content-Type": "multipart/form-data" } };

		for (const property in variable) {
			let index: keyof IVariables = property as keyof IVariables;
			formData.append(property, variable[index]);
		}

		idEquipoSelected !== undefined && formData.append('equipoId',idEquipoSelected);

		setLoading(true);
		await api.post("service_render/render_data", formData, headers)
			.success((response) => {
				setStatusService('EN PROCESO')
			})
			.fail("No se pudo consumir el servicio");
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

	/*EFFECTS */
	/*OBTENER DATOS ASOCIADOS A LA PROYECCION */
	useEffect(() => {
		const getLastDataSimulated = async () => {
			console.log('idEquipoSelected: ', idEquipoSelected);
			if (idEquipoSelected == undefined){return}
			interface responseInfoRender {
				info_medicion: { fecha_medicion: string }
			}

			const errors: string[] = [];
			
			await api.get<responseInfoRender>($j("service_render/data_last_file_medicion_var",idEquipoSelected))
				.success((response) => {

					response.info_medicion === null
						? errors.push('No se ha encontrado información de la medición 3D')
						: 	setVariables(state => $u(state, {
								measurementDate : { $set: $m(response.info_medicion.fecha_medicion, 'YYYY-MM-DD').format('DD-MM-YYYY') },
								xampleDateStart : { $set: $m(response.info_medicion.fecha_medicion, 'YYYY-MM-DD').format('DD-MM-YYYY') },
								xampleDateEnd : { $set: $m(response.info_medicion.fecha_medicion, 'YYYY-MM-DD')
									.add(30, "days").format('DD-MM-YYYY') }
							}))
				})
				.fail("Error al consultar los datos de simulación")
				.finally(() => {
					setLoadingData(false)
					setErrorMessageModule(errors);
				});
		};
		setLoadingData(true);
		getLastDataSimulated()
	}, [idEquipoSelected]);

	/*OBTENER ESTATUS DEL SERVICIO */
	useEffect(() => {
		if (idEquipoSelected == undefined){return}
		const checkStatusService = async () => {
			await api.get<{ status: string, message: string }>($j("service_render/statusLastDataRender",idEquipoSelected))
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

	/*CAMPOS PARA RELLENO DE FECHAS */
	const fieldsFillDates: JSX.Element = <>
		<Row className="mb-3">
			<Col sm={6}>
				<Datepicker
					label='Fill date start'
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
					label='Fill date end'
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
		<hr />

		<Row className="mb-3">
			<Col sm={6}>
				<Datepicker
					label='Sampling date start'
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
					label='Sampling Date end'
					value={variable.samplingDatesEnd}
					onChange={value => {
						setVariables(state => $u(state, {
							samplingDatesEnd: { $set: value }
						}))
					}}
				/>
			</Col>
		</Row>


		{/* ---------------------------- */}
		<hr />
	</>

	/*MODAL PARA FORMULARIO DE VARIABLES */
	const modalFormVariables: JSX.Element = <>
		<Modal show={modalVariable.visible} onHide={modalVariable.hide}>
			<Modal.Header closeButton>
				<b>Variables de operación</b>
			</Modal.Header>
			<Modal.Body>
				<Row className="mb-3">
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
				</Row>

				{variable.isRandomSampling === 'true' && fieldsFillDates}

				<Row className="mb-3">
					<Col sm={6}>
						<Datepicker
							label='Date start'
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
							label='Date end'
							value={variable.xampleDateEnd}
							onChange={value => {
								setVariables(state => $u(state, {
									xampleDateEnd: { $set: value }
								}))
							}}
						/>
					</Col>
				</Row>

				{/* ---------------------------- */}
				<hr />

				<Row className="mb-3">
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
				</Row>

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
			<FileInputWithDescription
				id={"inputFile"}
				onChange={handleChangeFile}
				onChangeDisplay={handleChangeDisplay}
				display={display}
				accept={["csv"]}
			/>
		</Col>
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
		<Col sm={2}>
			<Button variant="outline-primary" className='d-flex justify-content-start mr-3 btn-outline-primary' onClick={descargarEjemplo} >
				Descargar ejemplo
			</Button>
		</Col>

		<Col sm={12} className="text-right">
			<Col className="col-lg-3 col-md-3 col-sm-6" style={{verticalAlign:'bottom'}}>
				<h5>Fecha a proyectar: { variable.xampleDateStart+" / "+variable.xampleDateEnd}</h5>
			</Col>
			<Col className="col-lg-3 col-md-3 col-sm-6" style={{verticalAlign:'bottom'}}>
				<SearchBar onChange={doSearch} outerClassName={"mb-2"}/>
			</Col>
		</Col>
		<Col sm={12}>
			{loadingg ? (
				<BounceLoader css={{ margin: '2.25rem auto' } as any} color='var(--primary)' />
			) : (
				<ApiTable<OperationalDataImport>
					columns={OperationalColumns(intl)}
					source={operationalData ?? []}
					search={search}
					// onSelect={e => goto.relative('meta.details', { cotizacion: e })}
					reload={reloadTable}
				/>
			)}
		</Col>

		<Col sm={2}>
			<Button className='d-flex justify-content-start btn-primary mr-3 mt-5' onClick={()=>{modalVariable.show()}} disabled={isVariable}>
				Ver variables de operación
			</Button>
		</Col>
		<Col sm={2} className="offset-8">
			<Button className='d-flex justify-content-start btn-primary mr-3 mt-5' onClick={onSimulateProjection} disabled={isVariable}>
				Simular proyección
			</Button>
		</Col>

		<div>
			{modalFormVariables}
		</div>
	</>

	return (
		<BaseContentView title='titles:operational_data'>
			{loadingData ? <LoadingSpinner /> : 
				errorMessageModule.length > 0 ? <ShowMessageInModule message = {errorMessageModule}/> : componentShowInModule
			}
		</BaseContentView>
	);
};
