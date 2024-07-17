import React, { ReactNode, useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { $d, $j, $m, $x } from '../../../Common/Utils/Reimports';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { BaseContentView } from '../../Common/BaseContentView';
import { ApiSelect } from '../../../Components/Api/ApiSelect';
import { EquipoTipo } from '../../../Data/Models/Equipo/Equipo';
import { IComponente } from '../../../Data/Models/Componentes/Componentes';
import { Datepicker } from '../../../Components/Forms/Datepicker';
import { JumpLabel } from '../../../Components/Common/JumpLabel';

interface IColumnsTable {
  key: string
  name: string
  selector: string | ((row: any[], rowIndex: number) => ReactNode)
  format?: any
  cell?: (row: any, index: number, column: any, id: any) => ReactNode
}

const estadoOptions = ['FUNCIONANDO', 'DETENIDO'];
const sentidoOptions = ['DIRECTO', 'INVERSO'];

export default function DataLake() {
	const { capitalize: caps } = useFullIntl();
	const { addToast } = useToasts();

	const [loadingData, setLoadingData] = useState(true);
	const [idEquipoSelected, setIdEquipoSelected] = useState<string | undefined>();
	const [nombreEquipoSelected, setNombreEquipoSelected] = useState<string | undefined>();
	const [tipoEquipoSelected, setTipoEquipoSelected] = useState<string | undefined>(undefined);
	const [idComponentSelected, setIdComponentSelected] = useState<string | undefined>(undefined);
	const [nombreComponentSelected, setNombreComponentSelected] = useState<string | undefined>(undefined);
	const [componentsForTraining, setComponentsForTraining] = useState<IComponente[]>([]);
	const [fechaInicial, setFechaInicial] = useState<string | undefined>();
	const [fechaFinal, setFechaFinal] = useState<string | undefined>();
	const [tableData, setTableData] = useState<Array<any>>([]);
	const [originalData, setOriginalData] = useState<Array<any>>([]);
	const [tableHeader, setTableHeader] = useState<IColumnsTable[]>([]);
	const [loadingDataTable, setLoadingDataTable] = useState(false);
	const [reloadTable, setReloadTable] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [tempValues, setTempValues] = useState<{ [key: string]: any }>({});

	const updateComponentes = async (equipoId: string) => {
		setIdComponentSelected(undefined);
		setLoadingData(true);
		await ax
			.get<IComponente[]>('service_render/equipos/componentes_asignados', { params: { equipo_id: equipoId } })
			.then((response) => {
				setComponentsForTraining(response.data);
				setIdComponentSelected(response.data.length > 0 ? response.data[0].id : undefined);
				setNombreComponentSelected(response.data.length > 0 ? response.data[0].nombre : undefined);
			})
			.catch((e) => {
				if (e.response) {
					addToast(
						caps('errors:base.load', {
							element: 'componentes',
						}),
						{
							appearance: 'error',
							autoDismiss: true,
						}
					);
				}
			})
			.finally(() => {
				setLoadingData(false);
			});
	};

	const getDatosOperacionales = useCallback(async () => {
		if (!fechaFinal) return; // No hacer nada si no hay fecha final
		setLoadingDataTable(true);
		const params = {
			equipoId: idEquipoSelected,
			componenteId: idComponentSelected,
			fecha_inicial: fechaInicial,
			fecha_final: fechaFinal,
			downloadable: false,
		};
		await ax
			.get($j('service_render', 'data_pi'), { params })
			.then((response) => {
				const columnsDataOperacional = response.data.header.map((name: string) => {
					return {
						key: name,
						name,
						selector: name,
						cell: (row: any, rowIndex: number) => {
							if (isEditing) {
								if (name === 'ESTADO') {
									return (
										<select defaultValue={row[name]} onChange={(e) => handleTempEdit(rowIndex, name, e.target.value)}>
											{estadoOptions.map((option) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
										</select>
									);
								} else if (name === 'SENTIDO') {
									return (
										<select defaultValue={row[name]} onChange={(e) => handleTempEdit(rowIndex, name, e.target.value)}>
											{sentidoOptions.map((option) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
										</select>
									);
								} else if (typeof row[name] === 'number') {
									const key = `${rowIndex}-${name}`;
									return (
										<input
											type='number'
											defaultValue={row[name]}
											onChange={(e) => handleTempEdit(rowIndex, name, parseFloat(e.target.value))}
										/>
									);
								}
							}
							return row[name];
						},
					};
				});
				setTableHeader(columnsDataOperacional);
				setTableData(response.data.data);
				setOriginalData(response.data.data); // Guardar datos originales
				setReloadTable(false); // Reset reloadTable here
			})
			.catch((e) => {
				if (e.response) {
					addToast('Error al consultar los datos operacionales', {
						appearance: 'error',
						autoDismiss: true,
					});
				}
			})
			.finally(() => {
				setLoadingDataTable(false);
			});
	}, [addToast, fechaFinal, idComponentSelected, idEquipoSelected, isEditing, fechaInicial]);

	const handleEditCell = (rowIndex: number, field: string, value: any) => {
		setTableData((prevData) => {
			const newData = [...prevData];
			newData[rowIndex][field] = value;
			return newData;
		});
	};

	const handleTempEdit = (rowIndex: number, field: string, value: any) => {
		setTempValues((prevValues) => ({
			...prevValues,
			[`${rowIndex}-${field}`]: value
		}));
	};

	const downloadExcel = async () => {
		const equipoNombre = nombreEquipoSelected?.replace(/\s+/g, '_');
		const componentNombre = nombreComponentSelected?.replace(/\s+/g, '_');
		const nombreArchivo = `${equipoNombre}_${componentNombre}_${$m().format('YYYYMMDDHHmmss')}.xlsx`;

		const worksheet = $x.utils.json_to_sheet(tableData);
		const workbook = $x.utils.book_new();
		$x.utils.book_append_sheet(workbook, worksheet, 'Data');
		const excelBuffer = $x.write(workbook, {
			bookType: 'xlsx',
			type: 'array',
		});
		const blob = new Blob([excelBuffer], {
			type: 'application/octet-stream',
		});
		$d(blob, nombreArchivo);
	};

	const uploadData = async () => {
		if (!idEquipoSelected || !idComponentSelected) {
			addToast('Seleccione equipo y componente', {
				appearance: 'warning',
				autoDismiss: true,
			});
			return;
		}
		const payload = {
			equipoId: idEquipoSelected,
			componenteId: idComponentSelected,
			downloadable: false,
			data: tableData,
		};
		await ax
			.post($j('service_render', 'data_pi'), payload)
			.then(() => {
				addToast('Datos cargados exitosamente', {
					appearance: 'success',
					autoDismiss: true,
				});
			})
			.catch((e) => {
				if (e.response) {
					addToast('Error al cargar los datos', {
						appearance: 'error',
						autoDismiss: true,
					});
				}
			});
	};

	useEffect(() => {
		if (idEquipoSelected == undefined) {
			return;
		}
		updateComponentes(idEquipoSelected);
	}, [idEquipoSelected]);

	useEffect(() => {
		if (fechaInicial && fechaFinal && idComponentSelected) {
			setReloadTable(true);
		}
	}, [fechaInicial, fechaFinal, idComponentSelected]);

	useEffect(() => {
		if (reloadTable) {
			getDatosOperacionales();
		}
	}, [getDatosOperacionales, reloadTable]);

	const toggleEditing = () => {
		if (isEditing) {
			// Save changes
			setTableData((prevData) => {
				const newData = [...prevData];
				for (const [key, value] of Object.entries(tempValues)) {
					const [rowIndex, field] = key.split('-');
					if (newData[Number(rowIndex)]) {
						newData[Number(rowIndex)][field] = value;
					}
				}
				return newData;
			});
			setTempValues({});
		}
		setIsEditing(!isEditing);
	};

	const handleChange = (rowIndex: number, key: string, value: any) => {
		setTableData((prevData) => {
			const newData = [...prevData];
			newData[rowIndex][key] = value;
			return newData;
		});
	};

	const columnsWithEdit = useMemo(() => {
		return tableHeader.map((column) => {
			if (isEditing) {
				return {
					...column,
					cell: (row: any, rowIndex: number) => {
						const key = `${rowIndex}-${column.name}`;
						if (['ESTADO', 'SENTIDO'].includes(column.name)) {
							const options = column.name === 'ESTADO' ? estadoOptions : sentidoOptions;
							return (
								<select defaultValue={row[column.name]} onChange={(e) => handleTempEdit(rowIndex, column.name, e.target.value)}>
									{options.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							);
						}
						if (column.name !== 'TIMESTAMP' && column.name !== 'EQUIPO' && typeof row[column.name] === 'number') {
							return (
								<input
									type='number'
									defaultValue={row[column.name]}
									onChange={(e) => handleTempEdit(rowIndex, column.name, parseFloat(e.target.value))}
								/>
							);
						}
						return row[column.name];
					},
				};
			}
			return column;
		});
	}, [isEditing, tableHeader]);

	return (
		<>
			<BaseContentView title='titles:data_lake'>
				<Row>
					<Col md={3}>
						<ApiSelect<EquipoTipo>
							label='Equipo'
							name='equipo_select'
							placeholder='Seleccione equipo'
							source={'service_render/equipos'}
							value={idEquipoSelected}
							selector={(option: EquipoTipo) => {
								return {
									label: option.nombre,
									value: option.id.toString(),
									tipo: option.equipo_tipo.nombre_corto,
								};
							}}
							valueInObject={true}
							onChange={(data) => {
								setTipoEquipoSelected(data.tipo);
								setIdEquipoSelected(data.value);
								setNombreEquipoSelected(data.label);
							}}
						/>
					</Col>

					<Col md={3}>
						<ApiSelect<IComponente>
							name='componente'
							label='Componente'
							placeholder='Seleccione componente'
							source={componentsForTraining}
							value={idComponentSelected}
							selector={(option: IComponente) => {
								return {
									label: option.nombre,
									value: option.id.toString(),
								};
							}}
							valueInObject={true}
							onChange={(data) => {
								setIdComponentSelected(data.value ?? data);
								data.label && setNombreComponentSelected(data.label);
							}}
							isLoading={loadingData}
							isDisabled={loadingData}
							errors={componentsForTraining.length === 0 && !loadingData ? ['El equipo seleccionado no tiene componentes entrenados'] : []}
						/>
					</Col>

					{idComponentSelected && (
						<>
							<Col md={2}>
								<Datepicker
									label='Fecha inicial'
									value={fechaInicial}
									onChange={(date) => {
										setFechaInicial(date);
									}}
								/>
							</Col>
							<Col md={2}>
								<Datepicker
									label='Fecha final'
									value={fechaFinal}
									minDate={fechaInicial}
									onChange={(date) => {
										setFechaFinal(date);
										setReloadTable(true);
									}}
									disabled={!fechaInicial} // Deshabilitar fecha final si no hay fecha inicial
								/>
							</Col>
						</>
					)}

					<Col md={2} className='pt-2'>
						<JumpLabel />
						<Button onClick={toggleEditing} disabled={tableData.length === 0} className='w-100 d-flex justify-content-center align-items-center'>
							<i className={'mx-2 fas fa-edit fa-lg'} />
							<span className='mx-2'>{isEditing ? 'Guardar' : 'Editar'}</span>
						</Button>
					</Col>

					<Col md={2} className='pt-2'>
						<JumpLabel />
						<Button onClick={downloadExcel} disabled={loadingData || componentsForTraining.length === 0 || tableData.length === 0} className='w-100 d-flex justify-content-center align-items-center'>
							<i className={'mx-2 fas fa-file-download fa-lg'} />
							<span className='mx-2'>Descargar</span>
						</Button>
					</Col>

					<Col md={2} className='pt-2'>
						<JumpLabel />
						<Button onClick={uploadData} disabled={loadingData || componentsForTraining.length === 0 || tableData.length === 0} className='w-100 d-flex justify-content-center align-items-center'>
							<i className={'mx-2 fas fa-upload fa-lg'} />
							<span className='mx-2'>Cargar</span>
						</Button>
					</Col>
				</Row>

				<Col sm={12} className='mt-3'>
					<ApiTable columns={columnsWithEdit} source={tableData} reload={reloadTable} isLoading={loadingDataTable} className='my-custom-datatable' key={isEditing ? 'editing' : 'viewing'} />
				</Col>
			</BaseContentView>
		</>
	);
}
