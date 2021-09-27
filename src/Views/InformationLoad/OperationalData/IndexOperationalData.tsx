import React, { useState, useRef } from 'react';
import { Col, Button, Row, Modal } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { useLocalization } from '../../../Common/Hooks/useLocalization';
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
import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { useShortModal } from '../../../Common/Hooks/useModal';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useToasts } from 'react-toast-notifications';

export interface OperationalDataImport {
	TIMESTAMP: number;
	TIMESTAMP_NEW: string;
	MIN_PROC_TPH: number;
	TRAT_SAG_1011: number;
	ENE_CONSU_KWH: number;
	POT_KW: number;
	VEL_RPM: number;
	POR_SOL: number;
	ESTADO: string;
	SENT: string;
	PRES_DESC_PSI: number;
	CON_AGUA: number;
	SOLIDOS: number;
	PEBBLES: number;
	BOLAS_TON: number;
	RUIDO_N: number;
	RUIDO_S: number;
	CAL_S: number;
	CAL_N: number;
	PAS_125: number;
	PAS_200: number;
	PAS_400: number;
	DWI: number;
	BWI: number;
	LEY_CUT: number;
	LEY_CUSC: number;
	PPM_MO: number;
	LEY_FET: number;
	LEY_AS: number;
	TON_ACUM_CAMP: number;
	AREA_CAMP: number;
	CAMP_DAY: number;
}

export interface IVariables {
	fillDatesStart: string
	fillDatesEnd: string
	samplingDatesStart: string
	samplingDatesEnd: string
	xampleDateStart: string
	xampleDateEnd: string
	scalingDateStart: string
	scalingDateEnd: string
	isRandomSampling: string
	csv_import?: any
}

const OperationalColumns: LocalizedColumnsCallback<OperationalDataImport> = () => [
	{ name: 'TIMESTAMP_NEW', selector: operation => operation.TIMESTAMP_NEW },
	{ name: 'MIN_PROC_TPH', selector: operation => operation.MIN_PROC_TPH },
	{ name: 'TRAT_SAG_1011', selector: operation => operation.TRAT_SAG_1011 },
	{ name: 'ENE_CONSU_KWH', selector: operation => operation.ENE_CONSU_KWH },
	{ name: 'POT_KW', selector: operation => operation.POT_KW },
	{ name: 'VEL_RPM', selector: operation => operation.VEL_RPM },
	{ name: 'POR_SOL', selector: operation => operation.POR_SOL },
	{ name: 'ESTADO', selector: operation => operation.ESTADO },
	{ name: 'SENT', selector: operation => operation.SENT },
	{ name: 'PRES_DESC_PSI', selector: operation => operation.PRES_DESC_PSI },

	{ name: 'CON_AGUA', selector: operation => operation.CON_AGUA },
	{ name: 'SOLIDOS', selector: operation => operation.SOLIDOS },
	{ name: 'PEBBLES', selector: operation => operation.PEBBLES },
	{ name: 'BOLAS_TON', selector: operation => operation.BOLAS_TON },
	{ name: 'RUIDO_N', selector: operation => operation.RUIDO_N },
	{ name: 'RUIDO_S', selector: operation => operation.RUIDO_S },
	{ name: 'CAL_S', selector: operation => operation.CAL_S },
	{ name: 'CAL_N', selector: operation => operation.CAL_N },
	{ name: 'PAS_125', selector: operation => operation.PAS_125 },
	{ name: 'PAS_200', selector: operation => operation.PAS_200 },

	{ name: 'PAS_400', selector: operation => operation.PAS_400 },
	{ name: 'DWI', selector: operation => operation.DWI },
	{ name: 'BWI', selector: operation => operation.BWI },
	{ name: 'LEY_CUT', selector: operation => operation.LEY_CUT },
	{ name: 'LEY_CUSC', selector: operation => operation.LEY_CUSC },
	{ name: 'PPM_MO', selector: operation => operation.PPM_MO },
	{ name: 'LEY_FET', selector: operation => operation.LEY_FET },
	{ name: 'LEY_AS', selector: operation => operation.LEY_AS },
	{ name: 'TON_ACUM_CAMP', selector: operation => operation.TON_ACUM_CAMP },
	{ name: 'AREA_CAMP', selector: operation => operation.AREA_CAMP },

	{ name: 'CAMP_DAY', selector: operation => operation.CAMP_DAY },


];

const inicialVariable: IVariables = {
	fillDatesStart: "",
	fillDatesEnd: "",
	samplingDatesStart: "",
	samplingDatesEnd: "",
	xampleDateStart: "18-12-2020",
	xampleDateEnd: "02-01-2021",
	scalingDateStart: "05-10-2018",
	scalingDateEnd: "01-03-2021",
	isRandomSampling: "false",
	csv_import: undefined
}

export const IndexOperationalData = () => {
	const { input, title } = useLocalization();
	const { capitalize: caps, intl } = useFullIntl();
	const inputFile = useRef<HTMLInputElement>(null);
	const [display, setDisplay] = useState<string>();
	const [operationalData, setOperationalData] = useState<OperationalDataImport[]>([]);
	const [variable, setVariables] = useState<IVariables>(inicialVariable);

	const [loadingg, setLoadingg] = useState(false);

	const [isVariable, setIsVariable] = useState(true);

	const [search, doSearch] = useSearch();
	const [reloadTable, doReloadTable] = useReload();
	const modalVariable = useShortModal();

	const { setLoading } = useDashboard();
	const api = useApi();
	const { addToast } = useToasts();


	// const OperationalColumnsTable = useLocalizedColumns(OperationalColumns);

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

		var monthIndex = [
			1, 2, 3,
			4, 5, 6,
			7, 8, 9,
			10, 11, 12
		];

		var utc_days = Math.floor(data.TIMESTAMP - 25568);
		var utc_value = utc_days * 86400;
		var date_info = new Date(utc_value * 1000);

		const date = date_info.getFullYear() + "/" + monthIndex[date_info.getMonth()] + "/" + date_info.getDate()

		// setOperationalData(s => $u(s, { [index]: { TIMESTAMP_NEW: { $set: date } } }));

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
	function onClickEnviar() {

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
			samplingDatesStart: { $set: $m(fechaMaxima).format('DD-MM-YYYY') },
			samplingDatesEnd: { $set: $m(fechaMaxima).subtract(30, "days").format('DD-MM-YYYY') },
		}))

		modalVariable.show();

	}

	const onSimulateProjection = async () => {
		const formData = new FormData();
		const headers = { headers: { "Content-Type": "multipart/form-data" } };
		
		for (const property in variable) {
			let index :  keyof IVariables = property as keyof IVariables;
			formData.append(property, variable[index] );
		}

		setLoading(true);
		await api.post("service_render/render_data", formData , headers)
			.success((response) => {

			})
			.fail("No se pudo consumir el servicio")
			.finally(() => { setLoading(false); });
		console.log(variable)
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

	const descargarEjemplo = () => {
		setLoading(true);
		api.get<string | Blob | File>($j('ejemplo_variables'), { responseType: 'blob' }).success(e => {
			$d(e, 'ejemplo_carga_variables.xlsx');
			setLoading(false);
			addToast(caps('success:base.success'), {
				appearance: 'success',
				autoDismiss: true,
			});
		}).fail('base.post');
	}



	const onSubmitVariables = () => {
		modalVariable.hide()
	}

	/*CAMPOS PARA RELLENO DE FECHAS */
	const fieldsFillDates: JSX.Element = <>
		<Row className="mb-3">
			<Col sm={6}>
				<Datepicker
					label='Fill Dates Start'
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
					label='Fill Dates end'
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
					label='Sampling dates start'
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
					label='Sampling Data end'
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
	
	return (
		<>
			<BaseContentView title='titles:operational_data'>
				<Col sm={2} className='text-left mb-2 offset-10'>
					<label><b>{input('date_project')}:</b></label>
					<Datepicker
						name={'start_date'} />
				</Col>
				<Col sm={3}>
					<FileInputWithDescription
						id={"inputFile"}
						onChange={handleChangeFile}
						onChangeDisplay={handleChangeDisplay}
						display={display}
						accept={["csv"]}
					/>
				</Col>
				<Col sm={2}>
					<Button variant="outline-primary" className='d-flex justify-content-start mr-3 btn-outline-primary' onClick={descargarEjemplo} >
						Descargar ejemplo
					</Button>
				</Col>

				<Col sm={3} className="offset-4">
					<SearchBar onChange={doSearch} />
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
					<Button className='d-flex justify-content-start btn-primary mr-3 mt-5' onClick={onClickEnviar} disabled={isVariable}>
						Ver variables de operación
					</Button>
				</Col>
				<Col sm={2} className="offset-8">
					<Button className='d-flex justify-content-start btn-primary mr-3 mt-5' onClick={onSimulateProjection} disabled={isVariable}>
						Simular proyección
					</Button>
				</Col>


				<div>
					<Modal show={modalVariable.visible} onHide={modalVariable.hide}>
						<Modal.Header closeButton>
							<b>Variables de operación</b>
						</Modal.Header>
						<Modal.Body>
							<Row className="mb-3">
								<Col sm={4}>
									<label><b>Ejecutar fill dates:</b></label><br></br>
									<RadioSelect
										style={{ display: "inline" }}
										name='pay_total_quoted'
										options={options}
										value={variable.isRandomSampling}
										onChange={e => setVariables(s => $u(s, { isRandomSampling: { $set: e } }))}
									/>
								</Col>
							</Row>

							{ variable.isRandomSampling === 'true' && fieldsFillDates}

							<Row className="mb-3">
								<Col sm={6}>
									<Datepicker
										label='Data start'
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
										label='Data end'
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
										label='Scaling Date start'
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
										label='Scaling data end'
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

							<Col sm={2} className="offset-8">
								<Button className='d-flex justify-content-start btn-primary mr-3 mt-5' onClick={onSubmitVariables}>
									Guardar
								</Button>
							</Col>

						</Modal.Body>
					</Modal>
				</div>


			</BaseContentView>
		</>
	);
};
