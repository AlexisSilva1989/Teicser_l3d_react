import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import React from 'react';
import {
	TEXTBOX,
	SELECT,
	PASSWORD,
	SELECT_MODAL,
	RADIOBOX
} from '../../Components/Forms/ValidatedForm';
import { ModificarBaseUsuario } from '../Common/ModificarBaseUsuario';
import { $j } from '../../Common/Utils/Reimports';
import { Usuario } from '../../Data/Models/Configuracion/Usuario';
import { Rol } from '../../Data/Models/Configuracion/Rol';
import md5 from 'md5';
interface TRaw {
	nombre: string
	clave?: string
	rol: string
	status: string,
	primer_apellido: string,
	segundo_apellido?: string,
	email: string
}

interface TData {
	nombre: string
	clave?: string
	trabajador?: number | null
	rol: string | null
	status: string
	primer_apellido: string,
	segundo_apellido?: any,
	email: string
}

export const ModificarUsuario = () => {
	const { intl, capitalize: caps } = useFullIntl();

	function onSerialize(e: TRaw): TData {
		return {
			...e,
			rol: e.rol === '-1' ? null : e.rol,
			clave: e.clave != null ? md5(e.clave): undefined
		};
	}

	return (
		<ModificarBaseUsuario<Usuario, TRaw, TData>
			title='titles:modify_user'
			path={$j('usuarios')}
			errorElement='errors:elements.user'
			onSerialize={onSerialize}
			getId={(x) => x.nombre_usuario}
			permission='configuracion'
			validations={{
				nombre: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					length: {
						minimum: 3,
						tooShort: caps('validations:min_length', { count: 3 })
					}
				},
				primer_apellido: {
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					length: {
						minimum: 3,
						tooShort: caps('validations:min_length', { count: 3 })
					}
				},
				segundo_apellido: function(value: any, attributes : any, attributeName : any, options:any, constraints:any) {
					if(attributes.segundo_apellido == ""){ return null}
					return {
						length: {
							minimum: 3,
							tooShort: caps('validations:min_length', { count: 3 })
						}
					};
				},
				email:{
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					},
					email:{
						message: caps('validations:email')
					}
				},
				clave: function(value: any, attributes : any, attributeName : any, options:any, constraints:any) {
					if(attributes.clave == ""){ return null}
					return {
						length: {
							minimum: 8,
							tooShort: caps('validations:min_length', { count: 8 })
						}
					}
				},
				rol:{
					presence: {
						allowEmpty: false,
						message: caps('validations:required')
					}
				}
			}}
			fields={[
				{
					type: TEXTBOX,
					label: 'labels:inputs.username',
					name: 'nombre_usuario',
					placeholder: 'validations:placeholders.username',
					span: 4,
					select: (x) => x.nombre_usuario,
					readonly: true,
				},
				{
					type: TEXTBOX,
					label: 'labels:inputs.name',
					name: 'nombre',
					placeholder: 'validations:placeholders.username',
					span: 4,
					select: (x) => x.nombre
				},
				{
					type: TEXTBOX,
					label: 'labels:inputs.lastname',
					name: 'primer_apellido',
					placeholder: caps('validations:min_length', { count: 3 }),
					span: 4,
					select: (x) => x.primer_apellido
				},
				{
					type: TEXTBOX,
					label: 'labels:inputs.second_lastname',
					name: 'segundo_apellido',
					placeholder: 'validations:placeholders.optional',
					span: 4,
					select: (x) => x.segundo_apellido
				},
				{
					type: TEXTBOX,
					label: 'labels:inputs.email',
					name: 'email',
					placeholder: 'validations:placeholders.email',
					span: 4,
					select: (x) => x.email
				},
				{
					type: PASSWORD,
					label: 'labels:inputs.password',
					name: 'clave',
					placeholder: 'validations:placeholders.password',
					span: 4
				},
				{
					type: SELECT,
					label: 'labels:inputs.role',
					name: 'rol',
					span: 4,
					source: $j('roles'),
					selectDisplay: (x: Rol) => x.nombre,
					selectValue: (x: Rol) => x.codigo.toString(),
					select: (x) => x.codigo_rol ?? '-1',
				},
				{
					type: RADIOBOX,
					name: 'estatus',
					options: [{
						label: "Desactivado",
						value: "0"
					},{
						label: "Activo",
						value: "1"
					}],
					span: 6,
					select: (x) => x.status
				}
			]}
		/>
	);
};
