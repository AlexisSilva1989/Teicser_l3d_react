import { IDataTableColumn } from "react-data-table-component";
import { IntlShape } from "react-intl";
import { $m } from "../../../Common/Utils/Reimports";

export interface ICampania {
  numero_camp: number | undefined
  fecha_inicio: Date | string | undefined
  fecha_fin: Date | string | undefined
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
      format: (camp) => $m.utc(camp.fecha_inicio).format('YYYY-MM-DD')
		},
		{
			selector: 'fecha_fin',
			name: 'Fecha fin',
      format: (camp) => camp.fecha_fin ? $m.utc(camp.fecha_fin).format('YYYY-MM-DD') : null
		}
	];
};