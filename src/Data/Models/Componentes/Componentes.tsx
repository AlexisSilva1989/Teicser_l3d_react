import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { Utils } from "../../../Common/Utils/Utils";

export interface IComponente{
  id: string
  nombre: string
  status: string
}

export interface IDataFormComponente {
	id?: string
	nombre: string 
	status?: string
}

export const ComponenetesColumns: (intl: IntlShape) => IDataTableColumn<IComponente>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{
			selector: 'id',
			name: header('columns:id'),
			format: (component) => component.id.toString().padStart(6, '0')
		},
		{
			selector: 'name',
			name: header('columns:name'),
			format: (component) => component.nombre
		},
		{
			selector: 'activo',
			name: header('columns:active'),
			format: (component) => header(component.status ? 'labels:yes' : 'labels:no'),
			center: true
		}
	];
};