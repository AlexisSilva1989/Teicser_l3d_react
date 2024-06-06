import React , {useCallback} from 'react';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { AgregarBase } from '../../Common/AgregarBase';
import { TEXTBOX,  FILE_INPUT } from '../../../Components/Forms/ValidatedForm';
import { $j } from '../../../Common/Utils/Reimports';
import { Empresa, EmpresaColumns } from '../../../Data/Models/Configuracion/Empresa';


interface TRaw {
	codigo: string
	empresa: string
	rut: string
	direccion: string
	logo?: any
	telefono: string
	email: string
	status: boolean
}

interface TData {
	codigo: string
	empresa: string
	rut: string
	direccion: string
	logo?: any
	telefono: string
	email: string
	status: boolean
}

export const AgregarEmpresa = () => {
	const { intl, capitalize: caps } = useFullIntl();

	const onSerialize = useCallback((raw: TRaw): TRaw => { return { ...raw, rut: raw.rut.replace('-', '').replace('.', '') }; }, []);

	return (
		<AgregarBase<TRaw, TData>
			title='titles:add_empresa'
			path={$j('empresa')}
			errorElement='errors:elements.user'
			onSerialize={onSerialize}
			validations={{
				codigo: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					length: {
						maxmum: 6,
						tooShort: caps('validations:min_length', { count: 6 })
					}
					
				},
				rut: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					format: {
						pattern: /(\d|\d\.){1,9}-?[0-9kK]/,
						message: caps('validations:invalid_format')
					}
				},
				empresa: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					length: {
						minimum: 3,
						tooShort: caps('validations:min_length', { count: 3 })
					}
				},
				direccion: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					length: {
						minimum: 8,
						tooShort: caps('validations:min_length', { count: 8 })
					}
				}
				,
				email: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					length: {
						minimum: 6,
						tooShort: caps('validations:min_length', { count: 6 })
					},
					email: {
						message: caps('validations:email')
					}
				},
				telefono: {
					numericality: {
						onlyInteger: true,
						notInteger: caps('validations:only_integer')
					}
				},
			}}
			fields={[
				{
					type: TEXTBOX,
					label: 'labels:inputs.codigo',
					name: 'codigo',
					placeholder: 'validations:placeholders.codigo',
					span: 1
				},
				{
					type: TEXTBOX,
					label: 'labels:inputs.rut',
					name: 'rut',
					placeholder: 'validations:placeholders.rut',
					span: 3
				},
				{
					type: TEXTBOX,
					label: 'labels:inputs.empresa',
					name: 'empresa',
					placeholder: 'validations:placeholders.empresa',
					span: 5
				}
				,
				{
					type: TEXTBOX,
					label: 'labels:inputs.email',
					name: 'email',
					placeholder: 'validations:placeholders.email',
					span: 3
				}
				,

				{
					type: TEXTBOX,
					label: 'labels:inputs.direccion',
					name: 'direccion',
					placeholder: 'validations:placeholders.direccion',
					span: 5
				},
				{
					type: TEXTBOX,
					label: 'labels:inputs.telefono',
					name: 'telefono',
					placeholder: 'validations:placeholders.telefono',
					span: 3
				},
				{
					type: FILE_INPUT,
					name: 'logo',
					accept: 'image/*',
					label: 'labels:inputs.logo',
					span: 4
				}
			]}
		/>
	);
};
