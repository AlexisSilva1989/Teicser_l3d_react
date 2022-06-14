import { LocalizedColumnsCallback } from "../../../Common/Utils/LocalizedColumnsCallback";

export interface MoboOperationalDataImport {
	TIMESTAMP: number
	TIMESTAMP_NEW: string
  EQUIPO: string
  TRAT_MOLINO: number
  ENERGIA:number
  BOMBAS: number
  AGUA_PROC: number
  BOLAS_TON: number
  SOLIDOS: string
  POTENCIA: number
  ESTADO: number
  DWI: number
  BWI: number
  PH: number
  AI: number
  CUT: number
  MO: number
  FET: number
  AS: number
  TON_ACUM_CAMP: number
  DIAS_ACUM_CAMP: number
}

export const MoboOperationalColumns: LocalizedColumnsCallback<MoboOperationalDataImport> = () => [
	{ name: 'TIMESTAMP', selector: operation => operation.TIMESTAMP_NEW },
	{ name: 'TRAT_MOLINO', selector: operation => operation.TRAT_MOLINO },
	{ name: 'ENERGIA', selector: operation => operation.ENERGIA },
	{ name: 'BOMBAS', selector: operation => operation.BOMBAS },
	{ name: 'AGUA_PROC', selector: operation => operation.AGUA_PROC },
	{ name: 'BOLAS_TON', selector: operation => operation.BOLAS_TON },
	{ name: 'SOLIDOS', selector: operation => operation.SOLIDOS },
	{ name: 'POTENCIA', selector: operation => operation.POTENCIA },
	{ name: 'ESTADO', selector: operation => operation.ESTADO },
	{ name: 'DWI', selector: operation => operation.DWI },
	{ name: 'BWI', selector: operation => operation.BWI },
	{ name: 'PH', selector: operation => operation.PH },
	{ name: 'AI', selector: operation => operation.AI },
	{ name: 'CUT', selector: operation => operation.CUT },
	{ name: 'MO', selector: operation => operation.MO },
	{ name: 'FET', selector: operation => operation.FET },
	{ name: 'AS', selector: operation => operation.AS },
	{ name: 'TON_ACUM_CAMP', selector: operation => operation.TON_ACUM_CAMP },
	{ name: 'DIAS_ACUM_CAMP', selector: operation => operation.DIAS_ACUM_CAMP }
];