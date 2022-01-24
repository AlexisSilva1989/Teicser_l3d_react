import React from 'react';
import { Permissions } from './Permissions';
import { RefObject } from 'react';
import validate from 'validate.js';
import { IntlShape } from 'react-intl';
import FileSaver from 'file-saver';
import { localizeIntl } from './LocalizationUtils';
import { $v, IMoment, $m, $x, IWorksheet, IWorkbook } from './Reimports';
import { acceptedFormat } from './../../Components/Forms/FileInputWithPreviewImage';

export class Utils {
	static getTaxes(){
		return 0.19;
	}

	static validateImageFormat( file: File, acceptedImageFormat: acceptedFormat[] ){
		const mappedFormat = acceptedImageFormat.join("|");
		const regExp = new RegExp('('+mappedFormat+')$', 'i');
		return regExp.test(file.name)
	}

	static localizeErrorCode(code: number): string {
		switch (code) {
			case 401:
				return 'errors:common.not_authorized';
			case 404:
				return 'errors:common.not_found';
			default:
				return 'errors:common.not_expected';
		}
	}

	static formatWorksheet(ws: IWorksheet, rangeA1: string, format: string) {
		const range = $x.utils.decode_range(rangeA1);
		for (let R = range.s.r; R <= range.e.r; ++R) {
			for (let C = range.s.c; C <= range.e.c; ++C) {
				const cell = ws[$x.utils.encode_cell({ r: R, c: C })];
				if (!cell) continue;
				cell.z = format;
			}
		}
	}

	static fullCodigo(cot: number, correlativo: number, os?: number, sub_os?: number) {
		return 'COT-' + this.getCodigo(cot, correlativo) + (os && sub_os ? ' / OS-' + this.getCodigo(os, sub_os) : '');
	}

	static cleanInputs(inputs: string[]) {
		for (const i of inputs) {
			$(`[name="${i}"]`).removeClass('is-invalid');
		}
	}

	static makeInvalid(inputs: string[]) {
		for (const i of inputs) {
			$(`[name="${i}"]`).addClass('is-invalid');
		}
	}

	static makeValid(inputs: string[]) {
		for (const i of inputs) {
			$(`[name="${i}"]`).removeClass('is-invalid').addClass('is-valid');
		}
	}

	static mapTipoFalta(tipo: string) {
		switch (tipo) {
			case 'INA':
				return 'labels:absence_types.absence';
			case 'VAC':
				return 'labels:absence_types.vacations';
			case 'LIC':
				return 'labels:absence_types.medical_leave';
			default:
				return 'labels:not_applicable';
		}
	}

	static mapTipoPermiso(tipo: string) {
		switch (tipo) {
			case 'EXT':
				return 'labels:permission_types.extra_hours';
			case 'PER':
				return 'labels:permission_types.permission';
			default:
				return 'labels:not_applicable';
		}
	}

	static mapTipoActividad(tipo: string) {
		switch (tipo) {
			case 'ASE':
				return 'labels:activity_types.cleaning';
			case 'TRA':
				return 'labels:activity_types.transporting';
			case 'APO':
				return 'labels:activity_types.backing';
			case 'CAP':
				return 'labels:activity_types.training';
			default:
				return 'labels:not_applicable';
		}
	}

	static mapEstado(estado: string): string {
		switch (estado) {
			case 'FAC':
				estado = 'labels:status.billed';
				break;
			case 'PEN':
				estado = 'labels:status.pending';
				break;
			case 'CAN':
				estado = 'labels:status.cancelled';
				break;
			case 'PRO':
				estado = 'labels:status.processed';
				break;
			case 'APB':
				estado = 'labels:status.approved';
				break;
			case 'TRA':
				estado = 'labels:status.wip';
				break;
			case 'TER':
				estado = 'labels:status.finished';
				break;
			case 'PCO':
				estado = 'labels:status.pending_quotation';
				break;
			case 'PCM':
				estado = 'labels:status.pending_comercial_approval';
				break;
			case 'PCL':
				estado = 'labels:status.pending_client_approval';
				break;
			case 'PAT':
				estado = 'labels:status.pending_workshop_approval';
				break;
			case 'PAC':
				estado = 'labels:status.pending_ceo_approval';
				break;
			case 'APR':
				estado = 'labels:status.approved';
				break;
			case 'COT':
				estado = 'labels:status.requoted';
				break;
			case 'DEN':
				estado = 'labels:status.denied';
				break;
			case 'ASU':
				estado = 'labels:status.assumed';
				break;
			case 'REP':
				estado = 'labels:filters.status.replacement_request';
				break;
		}

		return estado;
	}

	static deconstructPermission(permission: number | null = null) {
		if (permission == null) {
			return {
				canRead: false,
				canCreate: false,
				canUpdate: false
			};
		}
		return {
			canRead: permission >= Permissions.Read,
			canCreate: permission >= Permissions.Create,
			canUpdate: permission >= Permissions.Update
		};
	}

	static getGuid() {
		const S4 = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return '_' + S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
	}

	static validateInputs<T>(validations: any, container: RefObject<T>, isDetails = false) {
		if (isDetails) {
			validations = validations.map((x: any) => (x.presence = false));
		}
		if (container.current == null) {
			return null;
		}

		const inputs = $(container.current!).find('input, select');
		const inputValues: { [key: string]: any } = {};
		for (const input of inputs) {
			const name = $(input).attr('name');
			if (name == null) {
				continue;
			}
			$(input).removeClass('is-invalid');
			inputValues[name] = $(input).val();
		}

		const errors = validate(inputValues, validations, { fullMessages: true });

		if (errors != null) {
			for (const input of inputs) {
				const name = $(input).attr('name');
				if (name == null) {
					continue;
				}
				$(input).addClass(errors[name] == null ? 'is-valid' : 'is-invalid');
			}
			return errors;
		}

		for (const input of inputs) {
			$(input).addClass('is-valid');
		}
		return null;
	}

	static randomColor() {
		return '#' + (((1 << 24) * Math.random()) | 0).toString(16);
	}

	static getCodigo(first: number, second: number) {
		return first.toFixed(0) + '-' + second.toFixed();
	}

	static fixed(item: number, decimals = 2) {
		return parseFloat(item.toFixed(decimals));
	}

	static getWeekDay(m: IMoment = $m(), day = 0) {
		return m.clone().startOf('isoWeek').add(day, 'days');
	}

	static getMoment(time = '00:00') {
		return $m($m().format('DD-MM-YYYY') + ' ' + time, 'DD-MM-YYYY HH:mm');
	}
	static getFullMoment(date: string, time = '00:00') {
		return $m(date + ' ' + time, 'DD-MM-YYYY HH:mm');
	}

	static castMoment(date: string) {
		return $m(date.replace('Z', ''));
	}

	static castDate(date: Date) {
		return $m(date.toISOString().replace('Z', ''));
	}

	static capitalize(intl: IntlShape) {
		const get = localizeIntl(intl);
		return (id: string, args?: any) => $v.capitalize(get(id, args));
	}

	static calcularHoras(hora_inicio: IMoment, hora_fin: IMoment, trabajadores: number, duracion_colacion: number) {
		const hi = this.getFullMoment($m().format('DD-MM-YYYY'), hora_inicio.format('HH:mm'));
		const hf = this.getFullMoment($m().format('DD-MM-YYYY'), hora_fin.format('HH:mm'));
		if (hi == null || hf == null) {
			return '';
		}
		let horas = hf.diff(hi, 'minutes');

		const minCol = Utils.getMoment('12:00');
		const maxCol = Utils.getMoment('15:00');

		const colacion = hi < maxCol && hf > minCol;
		// TODO: Soportar más de 2 trabajadores
		const ayudante = trabajadores === 2;

		if (colacion) {
			horas -= duracion_colacion;
		}
		return Utils.fixed(horas / 60, 2) + (ayudante ? ' x 2 = ' + Utils.fixed((horas * 2) / 60, 1) : '') + (colacion ? ' (Aplica colación)' : '');
	}

	static dataToWorksheet<T>(data: T[], intl?: IntlShape) {
		if (intl) {
			const caps = Utils.capitalize(intl);
			const mapped = data.map((x) => {
				const el: any = {};
				Object.entries(x).forEach((x) => {
					el[caps(x[0])] = x[1];
				});
				return el;
			});
			return $x.utils.json_to_sheet(mapped);
		}

		return $x.utils.json_to_sheet(data);
	}

	static worksheetToExcel(file: string, ws: IWorksheet) {
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = '.xlsx';

		const wb: IWorkbook = { Sheets: { data: ws }, SheetNames: ['data'] };
		const buffer = $x.write(wb, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([buffer], { type: fileType });
		FileSaver.saveAs(blob, file + fileExtension);
	}

	static dataToExcel<T>(file: string, data: T[], intl: IntlShape, widthColumns: any[] | undefined = undefined ) {
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = '.xlsx';
		const caps = Utils.capitalize(intl);

		const mapped = data.map((x) => {
			const el: any = {};
			Object.entries(x).forEach((x) => {
				el[caps(x[0])] = x[1];
			});
			return el;
		});



		const ws = $x.utils.json_to_sheet(mapped);
		if(!ws['!cols']) 
			ws['!cols'] = widthColumns;
		// ws["!cols"].push({width: 500 },{ width: 500 });
		
		const wb: IWorkbook = { Sheets: { data: ws }, SheetNames: ['data'] };
		const buffer = $x.write(wb, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([buffer], { type: fileType });
		FileSaver.saveAs(blob, file + fileExtension);
	}
}

validate.validators.lth = (value: IMoment, options: any) => {
	if (options.other == null) {
		return null;
	}
	if (value >= options.other) {
		return options.message;
	}
	return null;
};
validate.validators.gth = (value: IMoment, options: any) => {
	if (options.other == null) {
		return null;
	}
	if (value <= options.other) {
		return options.message;
	}
	return null;
};


/*prototipo de tooltip*/
interface Props {
	title: string
	tooltip:string
	styles?: React.CSSProperties
}


export const CustomTooltip = (props:Props) => {
	return (
		<span 
		 data-toggle="tooltip" 
		 data-placement="top" 
		 title={props.tooltip}>
		 {props.title } <i className="fas fa-info-circle" 
		   style={props.styles}
		 ></i>
		</span>
	);
}

export const removeAccents = (value : string) => {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	
}