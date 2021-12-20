import { LocalizedColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";

export interface OperationalDataImport {
	TIMESTAMP: number;
	TIMESTAMP_NEW: string;
	MIN_PROC_TPH: number;
	TRAT_SAG_1011: number;
	ENE_CONSU_KWH: number;
	POT_KW: number;
	VEL_RPM: number;
	POR_SOL: number;
	ESTADO: string;
	SENT: string;
	PRES_DESC_PSI: number;
	CON_AGUA: number;
	SOLIDOS: number;
	PEBBLES: number;
	BOLAS_TON: number;
	RUIDO_N: number;
	RUIDO_S: number;
	CAL_S: number;
	CAL_N: number;
	PAS_125: number;
	PAS_200: number;
	PAS_400: number;
	DWI: number;
	BWI: number;
	LEY_CUT: number;
	LEY_CUSC: number;
	PPM_MO: number;
	LEY_FET: number;
	LEY_AS: number;
	TON_ACUM_CAMP: number;
	AREA_CAMP: number;
	CAMP_DAY: number;
}

export interface IVariables {
	fillDatesStart: string
	fillDatesEnd: string
	samplingDatesStart: string
	samplingDatesEnd: string
	xampleDateStart: string
	xampleDateEnd: string
	scalingDateStart: string
	scalingDateEnd: string
	isRandomSampling: string
	csv_import?: any
	measurementDate?: string
}

export const OperationalColumns: LocalizedColumnsCallback<OperationalDataImport> = () => [
	{ name: 'TIMESTAMP_NEW', selector: operation => operation.TIMESTAMP_NEW },
	{ name: 'MIN_PROC_TPH', selector: operation => operation.MIN_PROC_TPH },
	{ name: 'TRAT_SAG_1011', selector: operation => operation.TRAT_SAG_1011 },
	{ name: 'ENE_CONSU_KWH', selector: operation => operation.ENE_CONSU_KWH },
	{ name: 'POT_KW', selector: operation => operation.POT_KW },
	{ name: 'VEL_RPM', selector: operation => operation.VEL_RPM },
	{ name: 'POR_SOL', selector: operation => operation.POR_SOL },
	{ name: 'ESTADO', selector: operation => operation.ESTADO },
	{ name: 'SENT', selector: operation => operation.SENT },
	{ name: 'PRES_DESC_PSI', selector: operation => operation.PRES_DESC_PSI },

	{ name: 'CON_AGUA', selector: operation => operation.CON_AGUA },
	{ name: 'SOLIDOS', selector: operation => operation.SOLIDOS },
	{ name: 'PEBBLES', selector: operation => operation.PEBBLES },
	{ name: 'BOLAS_TON', selector: operation => operation.BOLAS_TON },
	{ name: 'RUIDO_N', selector: operation => operation.RUIDO_N },
	{ name: 'RUIDO_S', selector: operation => operation.RUIDO_S },
	{ name: 'CAL_S', selector: operation => operation.CAL_S },
	{ name: 'CAL_N', selector: operation => operation.CAL_N },
	{ name: 'PAS_125', selector: operation => operation.PAS_125 },
	{ name: 'PAS_200', selector: operation => operation.PAS_200 },

	{ name: 'PAS_400', selector: operation => operation.PAS_400 },
	{ name: 'DWI', selector: operation => operation.DWI },
	{ name: 'BWI', selector: operation => operation.BWI },
	{ name: 'LEY_CUT', selector: operation => operation.LEY_CUT },
	{ name: 'LEY_CUSC', selector: operation => operation.LEY_CUSC },
	{ name: 'PPM_MO', selector: operation => operation.PPM_MO },
	{ name: 'LEY_FET', selector: operation => operation.LEY_FET },
	{ name: 'LEY_AS', selector: operation => operation.LEY_AS },
	{ name: 'TON_ACUM_CAMP', selector: operation => operation.TON_ACUM_CAMP },
	{ name: 'AREA_CAMP', selector: operation => operation.AREA_CAMP },

	{ name: 'CAMP_DAY', selector: operation => operation.CAMP_DAY },


];