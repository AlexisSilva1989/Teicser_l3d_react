import React, { useEffect, useState, useRef, ReactNode, Fragment, useCallback } from 'react';
import { Textbox } from './Textbox';
import { $u, IMoment, $val, $j } from '../../Common/Utils/Reimports';
import { Buttons } from '../Common/Buttons';
import { IDataTableColumn } from 'react-data-table-component';
import { ApiSelectModal } from '../Api/ApiSelectModal';
import { Datepicker } from './Datepicker';
import { Timepicker } from './Timepicker';
import { TextArea } from './TextArea';
import { ApiSelect } from '../Api/ApiSelect';
import { usePrevious } from '../../Common/Hooks/usePrevious';
import { BounceLoader } from 'react-spinners';
import { FileSelect } from './FileSelect';
import { RadioSelect } from './RadioSelect';
import PasswordBox from './PasswordBox';
import { Modal } from '../../Components/Common/Modal';
import { FileInputWithPreviewImage, acceptedFormat } from './FileInputWithPreviewImage';
import { SelectWithAdd } from '../Forms/SelectWithAdd';
import { SelectAdd } from '../Forms/SelectAdd';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';

import { ax } from '../../Common/Utils/AxiosCustom';

export const SELECT = 'SELECT';
export const TEXTBOX = 'TEXTBOX';
export const RADIOBOX = 'RADIOBOX';
export const EMBEDDED = 'EMBEDDED';
export const TEXTAREA = 'TEXTAREA';
export const TIMEPICKER = 'TIMEPICKER';
export const DATEPICKER = 'DATEPICKER';
export const SELECT_MODAL = 'SELECT_MODAL';
export const FILE_INPUT = 'FILE_INPUT';
export const FILE_INPUT_PREVIEW = 'FILE_INPUT_PREVIEW';
export const PASSWORD = 'PASSWORD';

export const SELECT_WITH_ADD = 'SELECT_WITH_ADD';
export const SELECT_ADD = 'SELECT_ADD';

type OptionType = {
  value: string;
  label: string;
};


interface Common<T> {
	type: string
	name?: string
	span?: number
	outerClassName?: string
	label?: string
	className?: string
	reset?: boolean
	readonly?: boolean
	discard?: boolean
	value?: T
	onChange?: (value: T) => void
	disabled?: boolean
	
}

interface Textbox extends Common<string | undefined> {
	type: typeof TEXTBOX
	placeholder?: string
	//filterPattern?:RegExp
	hidden?:boolean
	onlyNumber?:boolean
	isValidateRut?:boolean
}

interface RadioBox extends Common<string | undefined>{
	type: typeof RADIOBOX
	placeholder?: string
	options?: {
		label: string,
		value: string
	}[]
	value?: any
	style?: React.CSSProperties
}

interface PasswordBox extends Common<string | undefined> {
	type: typeof PASSWORD
	placeholder?: string
}

interface SelectModal extends Common<any> {
	type: typeof SELECT_MODAL

	initialValue?: string
	source: string
	columns: IDataTableColumn<any>[]
	selectValue: (value: any) => string
	preload?: boolean
	searchByInput?: boolean
	pathToSearchByInput?: string
	queryParams?: any
	onOpen?: () => void
	onClear?: () => void
	size?: 'sm' | 'lg' | 'xl'
	customFilter?: (row: any) => boolean
}

interface Embedded extends Common<null> {
	type: typeof EMBEDDED
	element: ReactNode
}

interface Datepicker extends Common<string> {
	type: typeof DATEPICKER
}

interface Timepicker extends Common<IMoment> {
	type: typeof TIMEPICKER
	step?: number
}

interface Select extends Common<string> {
	type: typeof SELECT
	source: string | any[]
	queryParams?: any
	showNone?: boolean
	placeholder?: string
	selectValue: (value: any) => string
	selectDisplay: (value: any) => string
	isDisabled?: boolean
}


/*nuevo select*/
interface SelectWithAdd extends Common<string> {
	type: typeof SELECT_WITH_ADD
	urlGet: string
	urlAdd: string
	queryParams?: any
	showNone?: boolean
	placeholder?: string
	selectValue: (value: any) => string
	selectDisplay: (value: any) => string
}

interface ISelectAdd extends Common<string>{
	type: typeof SELECT_ADD
	source: string | any[]
	queryParams?: any
	showNone?: boolean
	placeholder?: string
	selectValue: (value: any) => string
	selectDisplay: (value: any) => string
	isDisabled?: boolean
	isLoading?: boolean
  placeholderAddElement?: string 
  onCreateOption?: (inputValue: string) => void
}

interface TextArea extends Common<string> {
	type: typeof TEXTAREA

	rows?: number
	placeholder?: string
}

interface FileInput extends Common<FileList | null> {
	type: typeof FILE_INPUT
	accept?: string
	multiple?: boolean
}

interface FileInputPreview extends Common<FileList | null> {
	type: typeof FILE_INPUT_PREVIEW
	accept?: acceptedFormat[]
	multiple?: boolean
	name?: string
	src?: string
}

export type ValidatedInput = SelectModal | Textbox | Embedded | Datepicker | Timepicker | Select | TextArea | FileInput | PasswordBox | RadioBox | FileInputPreview | SelectWithAdd | ISelectAdd;
interface IValidations {
	presence?: boolean | {
		allowEmpty?: boolean
		message?: string
	}
	numericality?: boolean | {
		message?: string
		onlyInteger?: boolean
		notInteger?: string
		greaterThanOrEqualTo?: number
		notGreaterThanOrEqualTo?: string
		greaterThan?: number
		notGreaterThan?: string
		lessThan?: number
		notLessThan?: string
		noStrings?: boolean
	}
	lth?: boolean | {
		other?: IMoment
		message?: string
	}
	gth?: boolean | {
		other?: IMoment
		message?: string
	}
	length?: {
		minimum?: number
		maximum?: number
		tooShort?: string
		tooLong?: string
		is?: number
		wrongLength?: string
		message?: string
	}
	format?:{
		pattern?:RegExp, 
		message?:string
	}
	email?:{
		email?:string,
		message?:string
	}
	equality?:{
		equality : string,
		attribute : string,
		message? : string
	}
}

export type ValidationsType = { [key: string]: IValidations };

interface Props {
	unique?: string
	fields: ValidatedInput[]
	validations?: ValidationsType
	reset?: boolean
	path?: string
	nameLabel?: string
	onReset?: () => void
	serialize?: (e: any) => any
	onSubmit?: (e: any) => void
	submitIcon?: string
	submitLabel?: string
	buttonType?: 'button' | 'submit' | 'reset'
}

interface State {
	errors: any
	values: any
	data: any
	loading: boolean
	nodes: React.ReactNode[]
}

const initial: State = {
	errors: {},
	values: {},
	data: {},
	loading: true,
	nodes: [],
};

const useFetch = (url: string, initialState = {}) => {
	const [data, setData] = useState(initialState)

	useEffect(() => {
		setData(initialState)
		if (url.length > 0) {
			fetch();
			async function fetch() {
				await ax
					.get(url)
					.then((e) => e.data != false ? setData(e.data) : setData({}));
			}
		}
	}, [url])

	return [
		data
	]

}

export const ValidatedForm = (props: Props) => {
	const { capitalize: caps } = useFullIntl();
	const [errors, setErrors] = useState(initial.errors);
	const [values, setValues] = useState(initial.values);
	const [nodes, setNodes] = useState(initial.nodes);
	const [loading, setLoading] = useState(initial.loading);
	const [search, setSearch] = useState("");
	const [url, setUrl] = useState("");
	var [data] = useFetch(url, initial.data)
	const form = useRef<HTMLFormElement>(null);
	const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);
	const addModalConfirm = useRef<HTMLDivElement>(null);
	const prevValues = usePrevious<any>(values);

	const { onReset } = props;
	const invalidateAllCallback = useCallback(invalidateAll, []);
	useEffect(() => {
		const timer = setTimeout(() => {
			if (search != "" && search.length > 2) {
				setUrl($j(props.path + "/search/") + search)
			}
		}, 2000)
		return () => clearTimeout(timer);
	}, [])
 

	useEffect(() => {
		setLoading(() => true);

		if ($(addModalConfirm.current!).is(':visible')) {
			$(addModalConfirm.current!).modal('hide')
		} else {
			if (JSON.stringify(data) != '{}' && search != "") {
				$(addModalConfirm.current!).modal('show')
			}
		}

		props.fields.forEach((x) => {
			if (x.value != null && x.name != null) {
				const shouldSet: boolean = (
					prevValues === undefined || 
					prevValues[x.name] === undefined || 
					(
						props.reset === true && 
						x.reset === true
					)
				) && 
				x.type !== EMBEDDED;
				if (!shouldSet) {
					return;
				}
				setValues((s: any) => $u(s, { [x.name!]: { $set: x.value } }));
				
			}
		});
		if (props.reset && onReset != null) {
			onReset();
		}


		const onChange = (index: string, value: any) => {
			if (props.unique == index) {
				setSearch(value)
			}
			setValidate(index, value)
		};

		const elements: React.ReactNode[] = props.fields.map((x, i) => {
			let el: React.ReactNode;
			switch (x.type) {
				case TEXTBOX:
					el = (

						<Textbox
							name={x.name}
							className={x.className}
							onChange={x.name == null ? undefined : (e) => onChange(x.name!, e)}						
							placeholder={x.placeholder}
							label={x.label}
							onlyNumber={x.onlyNumber}
							isValidateRut={x.isValidateRut}
							//filterPattern={x.filterPattern}
							readonly={x.readonly}
							value={x.name == null ? undefined : values[x.name]}
							errors={x.name == null ? undefined : errors[x.name]}
							hidden={x.hidden}
						/>	
					);
					break;
				case RADIOBOX:	
					el = (
						<>
							<strong className={"mb-2"} style={{display: "block"}}>
								{x.label ? <b>{caps(x.label)}</b> : <b>Estatus:</b>}
							</strong>
							<RadioSelect
								name = { x.name }
								options = { x.options }
								onChange = { x.name == null ? undefined : (e) => onChange(x.name!, e) }
								value = { values[ (x.name) ? x.name : "" ] }
								style={x.style}
							/>
						</>
					);
					break;
				case PASSWORD:
					el = (
						<PasswordBox
							name={x.name}
							className={x.className}
							onChange={x.name == null ? undefined : (e) => onChange(x.name!, e)}
							placeholder={x.placeholder}
							label={x.label}
							readonly={x.readonly}
							value={x.name == null ? undefined : values[x.name]}
							errors={x.name == null ? undefined : errors[x.name]}
						/>
					);
					break;
				case SELECT_MODAL:
					el = (
						<ApiSelectModal
							columns={x.columns}
							label={x.label}
							className={x.className}
							selector={x.selectValue}
							source={x.source}
							name={x.name}
							initialValue={x.initialValue}
							searchByInput={x.searchByInput}
							pathToSearchByInput={x.pathToSearchByInput}
							onChange={x.name == null ? undefined : (e) => onChange(x.name!, e)}
							onClear={
								x.name == null
									? undefined
									: () => {
										if (x.onClear != null) {
											x.onClear();
										}
										onChange(x.name!, null);
									}
							}
							size={x.size}
							onOpen={x.onOpen}
							queryParams={x.queryParams}
							value={x.name == null ? undefined : values[x.name]}
							errors={x.name == null ? undefined : errors[x.name]}
							preload={x.preload}
						/>
					);
					break;
				case EMBEDDED:
					return x.element;
				case DATEPICKER:
					el = (
						<Datepicker
							label={x.label}
							className={x.className}
							value={x.name == null ? undefined : values[x.name]}
							errors={x.name == null ? undefined : errors[x.name]}
							name={x.name}
							onChange={x.name == null ? undefined : (e: any) => onChange(x.name!, e)}
							readonly={x.readonly}
							disabled={x.disabled}
						/>
					);
					break;
				case TIMEPICKER:
					el = (
						<Timepicker
							label={x.label}
							className={x.className}
							name={x.name}
							onChange={x.name == null ? undefined : (e) => onChange(x.name!, e)}
							step={x.step}
							value={x.name == null ? undefined : values[x.name]}
							errors={x.name == null ? undefined : errors[x.name]}
						/>
					);
					break;
				case SELECT:
					el = (
						<ApiSelect
							isDisabled={x.isDisabled}
							label={x.label}
							className={x.className}
							source={x.source}
							placeholder={x.placeholder}
							name={x.name}
							onChange={x.name == null ? undefined : (e: any) => onChange(x.name!, e)}
							queryParams={x.queryParams}
							errors={x.name == null ? undefined : errors[x.name]}
							showNone={x.showNone}
							selector={(e: any) => {
								return { label: x.selectDisplay(e), value: x.selectValue(e) };
							}}
							value={x.name == null ? undefined : values[x.name]}
						/>
					);
					break;
				case SELECT_ADD:
					el = (
						<SelectAdd
							name={x.name}
							label={x.label}
							source={x.source}
							value={x.value}
							onChange={x.onChange}
							placeholderAddElement={x.placeholderAddElement} 
							onCreateOption={x.onCreateOption}
							queryParams={x.queryParams}
							showNone={x.showNone}
							placeholder={x.placeholder}
							isLoading={x.isLoading}
							selector={(e: any) => {
							return { display: x.selectDisplay(e), value: x.selectValue(e) };
							}}
							isDisabled={x.isDisabled} 
							errors={x.name == null ? undefined : errors[x.name]}
						/>
					);
					break;
				case SELECT_WITH_ADD:
					el = (
						<SelectWithAdd
                            label={x.label}							
							urlGet={x.urlGet}
					        urlAdd={x.urlAdd}
							name={x.name}
							onChange={x.name == null ? undefined : (e: any) => onChange(x.name!, e)}
							value={x.name == null ? undefined : values[x.name]}
						/>
					);
					break;
				case TEXTAREA:
					el = (
						<TextArea
							label={x.label}
							className={x.className}
							name={x.name}
							value={x.name == null ? undefined : values[x.name]}
							readonly={x.readonly}
							rows={x.rows}
							errors={x.name == null ? undefined : errors[x.name]}
							placeholder={x.placeholder}
							onChange={
								x.name == null
									? undefined
									: (e) => {
										const val = e.currentTarget.value;
										onChange(x.name!, val);
									}
							}
						/>
					);
					break;
				case FILE_INPUT:
					el = (
						<FileSelect
							accept={x.accept}
							errors={x.name == null ? undefined : errors[x.name]}
							label={x.label}
							multiple={x.multiple}
							onChange={x.name == null ? undefined : (e) => onChange(x.name!, e)}
						/>
					);
					break;
					
				case FILE_INPUT_PREVIEW:
					el = (
						<FileInputWithPreviewImage
							accept={x.accept}
							errors={x.name == null ? undefined : errors[x.name]}
							label={x.label}
							src={x.src}
							multiple={x.multiple}
							onChange={x.name == null ? undefined : (e) => onChange(x.name!, !e?.length ? "" :  e[0])}
							id={x.name as string}
							name={x.name}
						/>
					);
					break;
			}
			return (
				<div key={i} className={`form-group ${x.span == null ? 'col-12' : 'col-' + x.span} ${x.outerClassName ?? ''}`}>
					{el}
				</div>
			);
		});
		if (props.reset) {
			invalidateAllCallback();
		}
		setNodes((s) => $u(s, { $set: elements }));
		setLoading(() => false);
	}, [props.fields, errors, values, prevValues, props.reset, onReset, invalidateAllCallback, data]);

	function handleAddData() {
		Object.entries(data).forEach((x) => {
			if (x[0] != props.unique && search != "") {
				var name = x[0]
				var data = x[1]

				if (data != "null") {
					$(form.current!).find(`[name="${name}"]`).val(`${data}`)
				} else {
					$(form.current!).find(`[name="${name}"]`).val("")
				}
				setValidate(x[0], x[1])
			}
		});
		setUrl("")
		setSearch("")
		$(addModalConfirm.current!).modal('hide');

	}

	function handleAddDataNot() {
		$(form.current!).find(`[name="${props.unique}"]`).val("")
		$(addModalConfirm.current!).modal('hide');
	}

	async function setValidate(index: string, value: any) {
		setValues((state: any) => $u(state, { [index]: { $set: value } }));
		const field = props.fields.find((x) => x.name === index);
		if (field != null && field.onChange != null) {
			field.onChange(value);
		}
	}

	function invalidateAll() {
		let inputs: Element[] = [];
		for (const el of props.fields) {
			inputs.push($(form.current!).find(`[name="${el.name}"]`)[0]);
		}

		inputs = inputs.filter((x) => x != null && props.validations![$(x).attr('name')!] != null);
		for (const i of inputs) {
			$(i).removeClass('is-valid');
			$(i).removeClass('is-invalid');
		}
	}

	function validate() {
		setErrors((s: any) => $u(s, { $set: {} }));
		let inputs: Element[] = [];
		for (const el of props.fields) {
			inputs.push($(form.current!).find(`[name="${el.name}"]`)[0]);
		}

		inputs = inputs.filter((x) => x != null && props.validations![$(x).attr('name')!] != null);
		for (const i of inputs) {
			$(i).removeClass('is-valid');
			$(i).removeClass('is-invalid');
		}

		const valErrors = $val(values, props.validations, { fullMessages: false });
		if (valErrors == null) {
			$(inputs).addClass('is-valid');
			return true;
		}

		for (const i of inputs) {
			if (valErrors[$(i).attr('name')!] != null) {
				$(i).addClass('is-invalid');
				$(i).focus();
			} else {
				$(i).addClass('is-valid');
			}
		}
		console.log("valErrors", valErrors)
		setErrors((s: any) => $u(s, { $set: valErrors ?? {} }));
		return false;
	}

	async function onSubmit(e: React.FormEvent<HTMLFormElement> | undefined) {
		if (e != null) {
			e.preventDefault();
		}
		if (validate()) {
			const data = props.serialize == null ? values : props.serialize(values);
			const mapped: any = {};
			Object.entries(data).forEach((x) => {
				const f = props.fields.find((y) => y.name === x[0]);
				if (f != null && !f.discard) {
					mapped[x[0]] = x[1];
				}
			});
			
			if (props.onSubmit != null) {
				setDisabledSubmit(true);
				await props.onSubmit(mapped);
				setDisabledSubmit(false);
			}
		} else {
			console.log('fallo validación');
		}

	}

	return (
		<div>
			<form className='row' ref={form} onSubmit={disabledSubmit ? undefined : onSubmit}>
				{loading ? <BounceLoader css={{ margin: '1.25rem auto' } as any} color='var(--primary)' size={32} /> :
					<Fragment>
						{nodes.map((x, i) => <Fragment key={i}>{x}</Fragment>)}
						{props.onSubmit != null && <div className={'text-right mt-3 ' + (props.fields.length > 0 && props.fields[props.fields.length - 1].type === EMBEDDED ? 'col' : 'col-12')}>
							{
								<Buttons.Submit
									disabled={disabledSubmit}
									onClick={props.buttonType === 'button' ? () => onSubmit(undefined) : undefined}
									type={props.buttonType}
									label={props.submitLabel || 'labels:meta.save'}
									icon={props.submitIcon ?? 'fas fa-save'} />
							}
						</div>}
					</Fragment>}
			</form>

			<Modal title='Metalsigma informa' ref={addModalConfirm}>
				<div className='modal-body'>
					<div className='row'>
						<div className='col-6 form-group'>
							El codigo {search} se encuenta en uso , desea editarlo ?
				</div>

					</div>
				</div>
				<div className='modal-footer text-right'>
					<button className='btn btn-primary' onClick={handleAddData} >
						Usar Código
			</button>
				</div>
			</Modal>
		</div>
	);
};


