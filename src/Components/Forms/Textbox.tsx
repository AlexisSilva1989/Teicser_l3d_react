import { Fragment, useState, useEffect, ChangeEvent } from 'react';
import React from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useRut  } from '../../Common/Hooks/useRut';
import { ONLY_NUMBER } from '../../Enums';
import { Format } from '../../Dtos/Utils';
import { FieldError } from 'react-hook-form';

interface Props {
	label?: string
	id?: string
	name?: string
	value?: string
	errors?: string[]
	className?: string
	readonly?: boolean
	onlyNumber?:boolean
	isValidateRut?: boolean
	//filterPattern?:RegExp
	placeholder?: string
	onChangeReturnEvent?: boolean
	onChange?: (e: string | ChangeEvent<HTMLInputElement>) => void
	hidden?: boolean 
	format?: "RUT" | "NUMBER-SEPARATOR"
	errorForm?: FieldError
  isLabelRequired?: boolean
  disabled?: boolean
  type?: string
  step?: string | number
  min?: number
}

export const Textbox = React.forwardRef( (props: Props, ref: React.Ref<HTMLInputElement>) => {
	const { capitalize: caps } = useFullIntl();
	const { onChange, onChangeReturnEvent, format} = props;
 
	const [init, setInit] = useState(false);
	const [value, setValue] = useState<string>();

    const { validRut , rutFormat , rutClearFormat } = useRut();
	

	useEffect( () => {
		setValue(props.value);
	}, [props.value]);

	useEffect(() => {
		if (init) {
			return;
		}
		if (props.value != null && onChange != null) {
			onChange(props.value);
			setInit(true);
		}
	}, [init, setInit, onChange, props.value]);

	const formatValue = (value: string)=>{
		let stringFormat : string | undefined = undefined;
		if(props.onlyNumber == true){
			stringFormat = "NUMBER"
		}
		if(props.format != null){
			stringFormat = props.format
		}
		const formats : {[x: string]: string} = {
			'NUMBER' : value.replace(ONLY_NUMBER, '').toString(), 
			'NUMBER-SEPARATOR' : Format.number_format(value.replace(ONLY_NUMBER, '').toString(),0)
		}
		let valueFormated : string = stringFormat != undefined ? formats[stringFormat] : value;
		return valueFormated;
	}

	return <Fragment>
	
		{props.label && <label>
			<b>
        {caps(props.label)}
        {props.isLabelRequired && (
          <span className="text-danger"> (*)</span>
        )}
        :
      </b>

		</label>}
		
			<input 
        type={props.type ?? 'text' }
        step={props.step ?? undefined} 
        min={props.min ?? undefined} 
				ref={ref}
				defaultValue={props.value }
				id={props.id}
				name={props.name} 
				value={props.value} 
				className={'form-control border rounded ' + props.className ?? ''}
				readOnly={props.readonly}
        disabled={props.disabled}
				placeholder={props.placeholder == null ? undefined : caps(props.placeholder)} 
				onKeyUp={(e) => {
					if (props.onChange != null) {
					   let {value} = e.currentTarget;
                       //validor de rut 
                       if(props.isValidateRut){
                       	 //si es un rut valido true
						 validRut(value) ? props.onChange(rutFormat(value)) : 
						 props.onChange(rutClearFormat(value));
                       }
                   }
				}} 
				
				onChange={(event) => {
					let {value} = event.currentTarget;
					if(format != null || props.onlyNumber == true){value = formatValue(value)}
					event.currentTarget.value = value;
					let returnValue = onChangeReturnEvent === true ? event : value
					if(props.onChange != null){	props.onChange(returnValue)}
					
				}}
			/>

		{props.errors && props.errors.length > 0 && <div>
			{props.errors.map((e, i) => <Fragment key={i}>
				<small className='text-danger' key={i}>
					{e}
				</small>
				<br />
			</Fragment>)}
		</div>}

		{props.errorForm && (
          <div>
            <small className="text-danger">
              {props.errorForm.message}
            </small>
          </div>
        )}
			
	</Fragment>
});


