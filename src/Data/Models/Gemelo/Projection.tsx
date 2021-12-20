import { IntlShape } from 'react-intl';
import { IDataTableColumn } from 'react-data-table-component';
import { Utils } from '../../../Common/Utils/Utils';

export interface Projection {
	id: string | number
    nombre_equipo: string
    fecha_medicion: string
    fecha_simulacion: string
    estado: string
	tipo_proyeccion: string
}

export const ProjectionsColumns: (intl: IntlShape) => IDataTableColumn<Projection>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{ selector: 'id', name: header('columns:id') },
		{ selector: 'nombre_equipo', name: header('columns:equipo') },
		{ selector: 'tipo_proyeccion', name: header('columns:periodo_proyeccion') , 
			format: (x) => x.tipo_proyeccion !== null ? header('label:'+x.tipo_proyeccion) : header('labels:not_applicable')
		},
		{ selector: 'fecha_medicion',	name: header('columns:fecha_medicion') },
		{ selector: 'fecha_simulacion', name: header('columns:fecha_simulacion') },
		{ selector: 'estado', name: header('columns:estado') }
	];
};