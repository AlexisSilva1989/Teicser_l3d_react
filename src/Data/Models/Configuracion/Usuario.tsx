import { IntlShape } from 'react-intl';
import { IDataTableColumn } from 'react-data-table-component';
import { Utils } from '../../../Common/Utils/Utils';

export interface Usuario {
	nombre_usuario: string,
	primer_apellido: string,
	segundo_apellido?: string,
	email?:string,
	nombre?: string
	codigo_trabajador?: number
	nombre_trabajador?: string
	codigo_rol?: number
	rol?: string
	activo: boolean
	status: string
}

export const UsuarioColumns: (intl: IntlShape) => IDataTableColumn<Usuario>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{ selector: 'nombre_usuario', name: header('columns:username') },
		{
			selector: 'nombre',
			name: header('columns:name'),
			format: (x) => x.nombre ?? header('labels:common.not_applicable')
		},
		{
			selector: 'trabajador',
			name: header('columns:worker'),
			format: (x) => (x.nombre_trabajador ? x.nombre_trabajador : header('labels:common.not_applicable'))
		},
		{
			selector: 'rol',
			name: header('columns:role'),
			format: (x) => x.rol ?? header('labels:common.not_applicable')
		},
		{
			selector: 'activo',
			name: header('columns:active'),
			format: (x) => header(x.activo ? 'labels:common.yes' : 'labels:common.no')
		}
	];
};