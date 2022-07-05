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
  fecha_end_xample: string
  dias_proyectar: string
}

export const ProjectionsColumns: (intl: IntlShape) => IDataTableColumn<Projection>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{ selector: 'id', name: header('columns:id'), width: '10%' },
		{ selector: 'nombre_equipo', name: header('columns:equipo') , width: '16%'},
		{ selector: 'nombre_componente', name: 'Componente' , width: '16%'},
		{ selector: 'fecha_medicion', name: header('columns:fecha_medicion'), width: '13%' },
		{ selector: 'fecha_end_xample', name: 'Fecha a proyectar', width: '13%'  },
		{ selector: 'dias_proyectar', name: 'Días', width: '7%'  },
		{ selector: 'fecha_simulacion', name: header('columns:fecha_simulacion'),width: '15%'  },
		{ selector: 'estado', name: header('columns:estado') , width: '10%'}
	];
};

