import React, { useState, useRef, Fragment, useEffect, useMemo } from 'react';
import { IDataTableColumn } from 'react-data-table-component';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { $u } from '../../Common/Utils/Reimports';
import { Modal } from '../Common/Modal';
import { SearchBar } from '../Forms/SearchBar';
import { ApiTable } from './ApiTable';
import { ax } from '../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';

interface Props<T> {
	source: string | T[]
	columns: IDataTableColumn<T>[]

	value?: T
	preload?: boolean
	initialValue?: string
	name?: string
	label?: string
	errors?: string[]
	queryParams?: any
	className?: string
	onOpen?: () => void
	onClear?: () => void
	size?: 'sm' | 'lg' | 'xl'
	onChange?: (row: T | null) => void
	selector: (value: T) => string
	customFilter?: (row: T) => boolean
	placeholder?: string
	disabled?: boolean
	searchByInput?: boolean
	pathToSearchByInput?: string
	showModalOnStartup?: boolean
}

interface State<T> {
	search: string
	load: boolean
	value?: T | null
	display?: string
}

export const ApiSelectModal = <T extends unknown>(props: Props<T>) => {
	const state = useMemo((): State<T> => {
		return {
			search: '',
			load: props.preload ?? false
		};
	}, [props.preload]);
	const [load, setLoad] = useState(state.load);
	const [search, setSearch] = useState(state.search);
	const [value, setValue] = useState(state.value);
	const [display, setDisplay] = useState(state.display);
	const { capitalize: caps } = useFullIntl();
	const [searchValue, setSearchValue] = useState("");
	const [messageError, setMessageError] = useState("");
	const [loadData, setLoadData] = useState<boolean>(false);
	const modal = useRef<HTMLDivElement>(null);

	useEffect( () => {
		if (props.showModalOnStartup) {
			loadModal();
		}
	}, []);

	useEffect(() => {
		if (props.initialValue != null) {
			setDisplay(() => props.initialValue);
		}
	}, [props.initialValue]);

	function handleSearch(search: string) {
		setSearch((s) => $u(s, { $set: search }));
	}

	function loadModal() {
		setLoad((s) => $u(s, { $set: true }));
		$(modal.current!).modal('show');
	}

	function onChange(row: T) {
		setMessageError("");
		$(modal.current!).modal('hide');
		setValue((s) => $u(s, { $set: row }));
		if (props.onChange != null) {
			props.onChange(row);
		}
	}

	function handleClear() {
		setValue((s) => $u(s, { $set: null }));
		setDisplay(() => undefined);
		setSearchValue("");
		if (props.onChange != null) {
			props.onChange(null);
		}
		if (props.onClear != null) {
			props.onClear();
		}
	}

	const searchByValue = async () => {
		setMessageError("");
		if (props.pathToSearchByInput) {
			setLoadData(true);
			await ax.get(`${props.pathToSearchByInput}/${searchValue}`)
				.then((response) => {
					const data = response.data;
					const hasData = Object.keys(data).length > 0;
					if (data && hasData ) {
						setValue((s) => $u(s, { $set: data }));
						if (props.onChange != null) {
							props.onChange(data);
						}
					}else{
						setMessageError("No se encontraron coincidencias");
					}
				}).catch((e: AxiosError) => {
					setMessageError("ha ocurrido un error inesperado");
				});
				setLoadData(false);
		}
	}

	return <Fragment>
		{props.label && <label>
			<b>{caps(props.label)}:</b>
		</label>}
		<div className='input-group'>
			<div className='input-group-prepend border-left rounded-left'>
				<i 
					className='fas fa-search input-group-text' 
					style={{ cursor: 'pointer' }} 
					data-toggle='modal' 
					onClick={ () => {
						if (props.searchByInput && searchValue === "" || !props.searchByInput) {
							loadModal();
						}

						if (props.searchByInput && searchValue !== "") {
							searchByValue();
						}

					}} />
			</div>
			<input 
				placeholder={props.placeholder ? caps(props.placeholder) : undefined}
				className={`btn form-control bg-white border rounded ${props.className ?? ''}`}
				value={value == null ? display ?? undefined : props.selector(value)}
				readOnly={!props.searchByInput}
				name={props.name}
				data-toggle='modal'
				onClick={() => {
					if (!props.searchByInput) {
						loadModal();
					}
				}}
				disabled={props.disabled}
				onChange={ (event) => {
					const valueInput = event.target.value;
					setSearchValue(valueInput);
				}}
			/>
			{(value || display) && <div className='input-group-append' style={{ cursor: 'pointer' }}>
				<i className='far fa-lg fa-times-circle input-group-text bg-white text-danger' onClick={handleClear} />
			</div>}
		</div>
		{props.errors && <div>
			{props.errors.map((e: any, i: number) => <Fragment key={i}>
				<small className='text-danger'>{e}</small>
				<br />
			</Fragment>)}
		</div>}
		{messageError && (
			<div>
				<small className='text-danger'>{messageError}</small>
			</div>
		)}

		{loadData && (
			<div>
				<small>Buscando...</small>
			</div>
		)}
		<Modal ref={modal} size={props.size ?? 'xl'}>
			<div className='modal-body'>
				<div className='row p-2'>
					<div className='col-12'>
						<SearchBar onChange={handleSearch} />
					</div>
					<div className='col-12'>
						<ApiTable<T> search={search} customFilter={props.customFilter} queryParams={props.queryParams} load={load} columns={props.columns} source={props.source} onSelect={onChange} />
					</div>
				</div>
			</div>
		</Modal>
	</Fragment>;
};
