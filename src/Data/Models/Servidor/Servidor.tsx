import { IDataTableColumn } from "react-data-table-component";
import { Option } from "react-dual-listbox";
import { IntlShape } from "react-intl";
import { Utils } from "../../../Common/Utils/Utils";
import { OptionType } from "../../../Components/Forms/CustomSelect";

export interface Servidor {
	id: string
	name: string
	url: string
	status: string
}


export interface IDataFormServer {
	id?: string
	name: string 
	url: string
	status?: string
}

export const ServidorColumns: (intl: IntlShape) => IDataTableColumn<Servidor>[] = (intl) => {
	const header = Utils.capitalize(intl);
	return [
		{
			selector: 'id',
			name: header('columns:id'),
			format: (server) => server.id.toString().padStart(6, '0')
		},
		{
			selector: 'name',
			name: header('columns:name'),
			format: (server) => server.name
		},
		{
			selector: 'url',
			name: 'url',
			format: (server) => server.url
		},
		{
			selector: 'activo',
			name: header('columns:active'),
			format: (server) => header(server.status ? 'labels:yes' : 'labels:no'),
			center: true
		}
	];
};