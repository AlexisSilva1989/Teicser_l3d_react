import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { Utils } from '../../../Common/Utils/Utils';

export interface Rol {
	codigo: number
	nombre: string
	activo: boolean
	permisos: {
		codigo: number
		id_entidad: number
		entidad: string
		nivel_permiso: number
	}[]
}

export const RolColumns: LocalizedColumnsCallback<Rol> = (intl) => {
	const caps = Utils.capitalize(intl);
	return [
		{
			selector: 'codigo',
			name: caps('columns:id'),
			format: (x) => x.codigo.toString().padStart(3, '0')
		},
		{ selector: 'nombre', name: caps('columns:name') },
		{
			selector: 'activo',
			name: caps('columns:active'),
			format: (x) => caps(x ? 'labels:yes' : 'labels:no')
		}
	];
};
