import { Fragment, useState, useEffect } from 'react';
import React from 'react';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { useRut  } from '../../Common/Hooks/useRut';
import { ONLY_NUMBER } from '../../Enums';

interface Props {
	label?: string
	name?: string
	value?: string
	errors?: string[]
	className?: string
	readonly?: boolean
	onlyNumber?:boolean
	isValidateRut?: boolean
	//filterPattern?:RegExp
	placeholder?: string
	onChange?: (e: string) => void
	hidden?: boolean 
}

export const Textbox = React.forwardRef( (props: Props, ref: React.Ref<HTMLInputElement>) => {
	const { capitalize: caps } = useFullIntl();
	const { onChange } = props;
 
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

	return <Fragment>
	
		{props.label && <label>
			<b>{caps(props.label)}:</b>
		</label>}
		
			<input type={props.hidden ? 'hidden' : 'text' } 
				ref={ref}
				defaultValue={props.value } 
				name={props.name} 
				value={props.value} 
				className={'form-control border rounded ' + props.className ?? ''}
				readOnly={props.readonly} 
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
				
				onChange={(e) => {

                   if (props.onChange != null) {
					   let {value} = e.currentTarget;
					    //if filter is required
					   if(props.onlyNumber){
					      //replace value
		                  value = value.replace(ONLY_NUMBER, ''); 
		                   //call funtion props
						  props.onChange(value.toString());   
					    }

					    //call funtion 
					    props.onChange(value);   
                   }
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
			
	</Fragment>
});


