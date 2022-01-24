import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataTable, { IDataTableColumn, IDataTableConditionalRowStyles, createTheme } from 'react-data-table-component';
import { BounceLoader } from 'react-spinners';
import { usePushError } from '../../Common/Hooks/usePushError';
import { ax } from '../../Common/Utils/AxiosCustom';
import { $u } from '../../Common/Utils/Reimports';
import { AxiosError } from 'axios';
import { useLocalization } from '../../Common/Hooks/useLocalization';
import { Col, Button } from 'react-bootstrap';
import { removeAccents } from '../../Common/Utils/Utils';
import { useDebounce } from 'use-debounce';
export interface MultiselectData<T> {
	allSelected: boolean
	selectedCount: number
	selectedRows: T[]
}

interface Props<T> {
	source: string | T[]
	columns: IDataTableColumn<T>[]
	load?: boolean
	reload?: boolean
	striped?: boolean
	queryParams?: any
	search?: string
	selectable?: boolean
	pagination?: boolean
	paginationServe?: boolean
	onChangePage?: (page: number, totalRows: number) => void
	onChangeRowsPerPage?: (totalRows: number) => void
	sortable?: boolean
	dense?: boolean
	className?: string
	onDataChange?: (data?: T[]) => void
	rowStyles?: IDataTableConditionalRowStyles<T>[]
	highlight?: boolean

	multiselect?: boolean
	clear?: boolean
	onMultiselect?: (x: MultiselectData<T>) => void

	customFilter?: (row: T) => boolean
	onSelect?: (row: T) => void
	onLoad?: () => void
	onReload?: () => void
	selectedCriteria?: (row: T) => boolean
	selectableCriteria?: (row: T) => boolean
	onClickIconInColumn?: (row: T) => void
	paginationTotalRows?: number
	currentPage?: number
	hasButtonAdd?: boolean
	onClickAdd?: () => void
	titleTable?: string
	isLoading?: boolean
	noRowsPerPage?: boolean
	filterServeParams?:object
	rowsPerPage?: number
}

interface State<T> {
	data: T[]
	filtered: T[]
	loading: boolean
	page: number
	rowsPerPage: number
	totalRows: number
}

createTheme('msig', {
	striped: {
		default: '#f2f2f2',
		text: 'rgba(0, 0, 0, 0.87)',
	},
	text: {
		primary: 'rgba(0, 0, 0, 0.75)'
	}
});

const tableStyles = {
	headRow: {
		denseStyle: {
			minHeight: '32px'
		}
	},
	headCells: {
		style: {
			fontWeight: 900
		}
	},
	rows: {
		denseStyle: {
			minHeight: '28px'
		}
	},
	pagination: {
		style: {
			minHeight: '32px',
			fontSize: '13px'
		},
		pageButtonsStyle: {
			height: '28px',
			width: '28px',
			padding: '0px'
		}
	}
};

export const ApiTable = <T extends unknown = any>(props: Props<T>) => {
	const initial: State<T> = {
		data: [],
		filtered: [],
		loading: true,
		page: 1,
		rowsPerPage: 10,
		totalRows: 0
	};

	const [init, setInit] = useState(false);
	const [state, setState] = useState(initial);
	const [valueSearch] = useDebounce(props.search, 1500);

	const { meta } = useLocalization();
	const { customFilter, onDataChange } = props;
	const { pushError } = usePushError();
	const { onLoad: onLoadProp, onReload: onReloadProp} = props;

	//CALLBACKS
	const onLoad = useCallback(() => {
		if (onLoadProp != null) {
			onLoadProp();
		}
	}, [onLoadProp]);
	
	const setLoading = useCallback(
		(loading: boolean) => {
			setState((s) => $u(s, { $merge: { loading } }));
			!loading && onLoad();
		},
		[onLoad]
	);

	const onReload = useCallback(() => {
		if (onReloadProp != null) {
			onReloadProp();
		}
	}, [onReloadProp]);

	//MEMOS
	const columnsWithSortableMemo = useMemo(() => {
		if (props.sortable == null || props.sortable) {
			return props.columns.map((x) => { return { ...x, sortable: x.sortable == null ? true : x.sortable }; });
		}
		return props.columns;
	}, [props.sortable, props.columns]);

	const columnsMemo = useMemo(() => {
		return columnsWithSortableMemo.map(column => {
			const canAddTitle = typeof column.selector === 'function' && column.cell == null;

			function titleCellFunction(row: T, rowIndex: number) {
				if (typeof column.selector === 'string') { return ''; }
				const selectorResult = column.selector!(row, rowIndex);
				var cadena = ""
				if (typeof selectorResult !== 'string') { return selectorResult; }
				if (selectorResult.length > 45) {
					cadena = selectorResult.substr(0, 45)
					cadena = cadena + "..."
				} else {
					cadena = selectorResult
				}

				if (column.width === '80%') {

					return <label title={selectorResult}>{selectorResult}</label>;
				}
				return <label style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={selectorResult}>{cadena}</label>;

			}

			if (canAddTitle) { return { ...column, cell: titleCellFunction }; }
			return column;
		});
	}, [columnsWithSortableMemo]);

	const noData = useMemo(() => <div className='text-center py-3'>
		<span className='text-secondary'>{meta('no_data_available')}</span>
	</div>, [meta]);

	const columnsSelectorsMemo = useMemo((): ((row: T) => string)[] => {
		return props.columns.map(column => column.selector as (row: T) => string);
	}, [props.columns]);

	//HANDLES
	//CAMBIAR DE PAGINA
	const handlePageChange = (page: number, totalRows: number) => {
		if (props.paginationServe) {
			setState((s) => $u(s, { $merge: { page: page } }));
		}
	}

	//CAMBIAR DE CANTIDAD DE FILAS
	const handleRowsPerPageChange = (totalRows: number, page: number) => {
		if (props.paginationServe) {
			setState((s) =>	$u(s, { $merge: { rowsPerPage: totalRows } }));
		}
	}

	//PARAMETROS PARA PETICION
	const getParamsToPaginateServer = ()=>{
		const paramsToPaginateServer = { 
			...props.queryParams, 
			...props.filterServeParams,
			totalRows: state.rowsPerPage, 
			page: state.page , 
			search: valueSearch === '' ? null : valueSearch, 
		}
		return paramsToPaginateServer;
	}

	//CONSULTAR DATOS
	const handleFecthData = async () => {
		// if (!init || (init && props.reload === true)) {
			setLoading(true);
			setInit(true);
			let dataResponse : any;
			
			if (typeof props.source === 'string') {

				let params = props.paginationServe
					? getParamsToPaginateServer()
					: props.queryParams;

				await ax.get<any>(props.source, { params: params }).then((e) => {
					dataResponse = props.paginationServe ? e.data.data : e.data;
					setState((s) =>
						$u(s, {
							$merge: {
								data: dataResponse ?? [],
								filtered: dataResponse ?? [],
								totalRows: e.data.pagination && e.data.pagination.total
							}
						})
					);
				}).catch((e: AxiosError) => {
					if (e.response) { pushError('errors:base.load_any', { code: e.response.status }); }
				});
			} else {

				const loader = props.isLoading ? props.isLoading : false;
				dataResponse = props.source as any;
				setState((s) =>	$u(s, { $merge: { data: dataResponse, filtered:dataResponse, loading: loader } }));
			}

			if (onDataChange != null) { onDataChange(dataResponse); }
			setLoading(false);
			onReload();
		// }
	}

	//EFFECTS
	//CONSULTAR DATOS
	useEffect(() => {
		const load = (props.load == null || props.load == undefined) ? true : props.load;
		if (((!init) ||  (init && props.reload )) || ( props.paginationServe && (init && load)) ) {
			handleFecthData();
		}
	}, [
		state.page,state.rowsPerPage, 
		props.source, props.load, props.queryParams, props.filterServeParams,
		props.reload, props.onReload, onReload, onDataChange
	]);

	//BUSQUEDA SIN PAGINACION
	useEffect(() => {
		if (props.paginationServe) {return};

		let search: string | undefined = props.search !== undefined ? removeAccents(props.search) : props.search;
		search = escape(search ?? '');
		const regex = new RegExp(search, 'i');

		const filtered = state.data.filter((row: any) => {
			return columnsSelectorsMemo.some(selector => {
				if (selector == null) { return false; }
				if (typeof selector === 'string') {
					const stringSelector = selector as string;
					let selected: string = (row)[selector] as string;
					if (typeof selected === 'string') {
						selected = removeAccents(selected);
					}
					return stringSelector in row && regex.test(escape(selected));
				}
				let selectedValue = selector(row);
				if (typeof selectedValue === 'string') {
					selectedValue = removeAccents(selectedValue);
				}

				return regex.test(escape(selectedValue as string));
			}) && (customFilter == null ? true : customFilter(row));
		}) ?? [];
	
		setState((s) => $u(s, { $merge: { filtered } }));
	
	}, [ state.data, props.search, customFilter, columnsSelectorsMemo]);

	//BUSQUEDA CON PAGINACION
	useEffect(()=>{
		if (!props.paginationServe) {return};
		init && handleFecthData();
	},[valueSearch])

	useEffect(()=>{
		props.isLoading && setLoading(props.isLoading);
	},[props.isLoading])

	return (
		<>
			{
				props.hasButtonAdd && (<>
					<Col sm={4} className={"mb-2"}>
						<Button	variant={"primary"} onClick={props.onClickAdd}>
							<i className={"fas fa-plus mr-1"} /> Agregar
						</Button>
					</Col>
					<Col sm={8} className={"mb-2"}>
						<b>{props.titleTable}</b>
					</Col>
				</>)
			}

			<DataTable conditionalRowStyles={props.rowStyles}
				className={['border rounded', props.className ?? ''].join(' ')}
				pagination={props.pagination == null ? true : props.pagination}
				noHeader
				theme='msig'
				paginationPerPage={props.rowsPerPage ?? state.rowsPerPage}
				paginationTotalRows={props.paginationTotalRows ?? (props.paginationServe ? state.totalRows : state.filtered.length)}
				striped={props.striped}
				noDataComponent={noData}
				dense={props.dense == null ? true : props.dense}
				paginationDefaultPage={props.currentPage}
				pointerOnHover={props.onSelect != null}
				highlightOnHover={props.onSelect != null}
				onRowClicked={props.onSelect ? props.onSelect : undefined}
				selectableRows={props.multiselect}
				onSelectedRowsChange={props.onMultiselect}
				selectableRowSelected={props.selectedCriteria}
				selectableRowDisabled={props.selectableCriteria != null ? e => !props.selectableCriteria!(e) : undefined}
				clearSelectedRows={props.reload || props.clear}
				columns={columnsMemo}
				data={state.filtered}
				progressPending={state.loading}
				selectableRowsHighlight={props.highlight}
				customStyles={tableStyles}
				progressComponent={<BounceLoader color='var(--primary)' css={{ margin: '2.5rem' } as any} />}
				paginationComponentOptions={{ noRowsPerPage: props.noRowsPerPage ?? false }}
				
				//pagination server
				paginationServer={props.paginationServe ?? false}
				onChangePage={props.onChangePage ?? handlePageChange}
				onChangeRowsPerPage={props.onChangeRowsPerPage ?? handleRowsPerPageChange}
				paginationServerOptions={{
					persistSelectedOnPageChange: props.paginationServe, 
					persistSelectedOnSort: true
				}}
			/>
		</>
	);
};
