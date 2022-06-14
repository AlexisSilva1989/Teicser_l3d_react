import { LocalizedColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";

export interface SagOperationalDataImport {
	TIMESTAMP: number
	TIMESTAMP_NEW: string
  EQUIPO: string
  TON_ALIM: number
  TRAT_MOLINO: number
  ENERGIA:number
  POTENCIA: number
  VEL_RPM: number
  ESTADO: number
  SENTIDO: string
  PRES_DESC_1: number
  PRES_DESC_2: number
  AGUA_PROC: number
  SOLIDOS: number
  PEBBLES: number
  PAS125: number
  PAS200: number
  PAS400: number
  BOLAS_TON: number
  DWI: number
  BWI: number
  PH: number
  AI: number
  CUT: number
  MO: number
  FET: number
  AS: number
  VEL_SENTIDO: number
  TON_ACUM_CAMP: number
  DIAS_ACUM_CAMP: number
}

export interface IVariables {
	fillDatesStart: string | undefined
	fillDatesEnd: string| undefined
	samplingDatesStart: string| undefined
	samplingDatesEnd: string| undefined
	xampleDateStart: string| undefined
	xampleDateEnd: string| undefined
	scalingDateStart: string| undefined
	scalingDateEnd: string| undefined
	isRandomSampling: string
	csv_import?: any
	measurementDate?: string
}

export const SagOperationalColumns: LocalizedColumnsCallback<SagOperationalDataImport > = () => {
	return [
	{ name: 'TIMESTAMP', selector: operation => operation.TIMESTAMP_NEW },
	{ name: 'TON_ALIM', selector: operation => operation.TON_ALIM },
	{ name: 'TRAT_MOLINO', selector: operation => operation.TRAT_MOLINO },
	{ name: 'ENERGIA', selector: operation => operation.ENERGIA },
	{ name: 'POTENCIA', selector: operation => operation.POTENCIA },
	{ name: 'VEL_RPM', selector: operation => operation.VEL_RPM },
	{ name: 'ESTADO', selector: operation => operation.ESTADO },
	{ name: 'SENTIDO', selector: operation => operation.SENTIDO },
	{ name: 'PRES_DESC_1', selector: operation => operation.PRES_DESC_1 },
	{ name: 'PRES_DESC_2', selector: operation => operation.PRES_DESC_2 },


	{ name: 'AGUA_PROC', selector: operation => operation.AGUA_PROC },
	{ name: 'SOLIDOS', selector: operation => operation.SOLIDOS },
	{ name: 'PEBBLES', selector: operation => operation.PEBBLES },
	{ name: 'PAS125', selector: operation => operation.PAS125 },
	{ name: 'PAS200', selector: operation => operation.PAS200 },
	{ name: 'PAS400', selector: operation => operation.PAS400 },
	{ name: 'BOLAS_TON', selector: operation => operation.BOLAS_TON },
	{ name: 'DWI', selector: operation => operation.DWI },
	{ name: 'BWI', selector: operation => operation.BWI },
	{ name: 'PH', selector: operation => operation.PH },
	{ name: 'AI', selector: operation => operation.AI },
	{ name: 'CUT', selector: operation => operation.CUT },
	{ name: 'MO', selector: operation => operation.MO },
	{ name: 'FET', selector: operation => operation.FET },
	{ name: 'AS', selector: operation => operation.AS },
	{ name: 'VEL_SENTIDO', selector: operation => operation.VEL_SENTIDO },
	{ name: 'TON_ACUM_CAMP', selector: operation => operation.TON_ACUM_CAMP },
	{ name: 'DIAS_ACUM_CAMP', selector: operation => operation.DIAS_ACUM_CAMP }
]
};