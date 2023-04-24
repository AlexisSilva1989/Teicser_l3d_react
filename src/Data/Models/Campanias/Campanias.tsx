import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { $m } from "../../../Common/Utils/Reimports";

export interface ICampania {
  numero_camp: number
  fecha_inicio: Date
  fecha_fin: Date
}

export const CampaniasColumns: () => IDataTableColumn<ICampania>[] = () => {
	return [
		{
			selector: 'numero_camp',
			name: 'Campaña'
		},
		{
			selector: 'fecha_inicio',
			name: 'Fecha inicio',
      format: (camp) => $m.utc(camp.fecha_inicio).format('DD-MM-YYYY')
		},
		{
			selector: 'fecha_fin',
			name: 'Fecha fin',
      format: (camp) => $m.utc(camp.fecha_fin).format('DD-MM-YYYY')
		}
	];
};