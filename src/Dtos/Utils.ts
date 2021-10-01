import { ColumnsPipe } from '../Common/Utils/LocalizedColumnsCallback';
import { ValueDisplay } from '../Components/Api/ApiSelect';
import { DropdownOption } from '../Components/Input/Dropdown';
import { IntlShape } from 'react-intl';

export const IdNombreColumns: ColumnsPipe<{ id: number, nombre: string }> = () => [
	{ name: 'id', selector: x => x.id },
	{ name: 'name', selector: x => x.nombre }
];

export interface IdNombre { id: number, nombre: string }

export const SelectIdNombre = (e: IdNombre): ValueDisplay => { return { display: e.nombre, value: e.id.toString() }; };
export const SelectIdNombreOption = (e: IdNombre): DropdownOption => { return { name: e.nombre, value: e.id.toString() }; };

export const MapIdNombre : (data: IdNombre[], addNone?: boolean, caps?: (e: string) => string) => { name: string, value: string }[] = (data, addNone, caps) =>  {
	let mapped = data.map(x => { return { name: x.nombre, value: x.id.toString() }; });
	if(addNone) { mapped = [{ name: caps ? caps('labels:meta.none') : 'N/A', value: '-1' }, ...mapped]; }
	return mapped;
};

const IntlCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

export class Format {

	static clp = (value: number) => IntlCLP.format(value);

	static id = (id: number) => {
		return id.toString().padStart(6, '0');
	};

	static fixed = (value: number, decimals = 1) => {
		return parseFloat(value.toFixed(decimals));
	};

	static fixedDecimalZero = (value: number, decimals = 0) => {
		return parseFloat(value.toFixed(decimals));
	};

	static localizeIntl = (intl: IntlShape) => {
		return (id: string, args: any = null) => intl.formatMessage({ id }, args);
	};

	static onlyNumber = (amount: any) => {
		amount = amount.toString()
		return parseFloat(amount.replace(/[^0-9\.]/g, ''));
	};

	static fixedDimanic = (value: number , decimals: number) => {
		return parseFloat(value.toFixed(decimals));
	};

	static number_format = (amount: any, decimals: any) => {
        amount += ''; // por si pasan un numero en vez de un string
        amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
        
        decimals = decimals || 0; // por si la variable no fue fue pasada
    
        // si no es un numero o es igual a cero retorno el mismo cero
        if (isNaN(amount) || amount === 0) 
            return parseFloat("0").toFixed(decimals);
    
        // si es mayor o menor que cero retorno el valor formateado como numero
        amount = '' + amount.toFixed(decimals);
    
        var amount_parts = amount.split('.'),
            regexp = /(\d+)(\d{3})/;
    
        while (regexp.test(amount_parts[0]))
            amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
    
        return amount_parts.join('.');

	};

	/**CONVERTIR UN NUMERO EN FORMATO ESPECIFICO CON NUMBERFORMAT DE JS */
	static parse_number_format = (number : number | string , decimals: number = 2, separator: string = 'point') => {
		number = parseFloat(number.toLocaleString());
		const formats : {[x: string]: string} = {
			'point' : "de-DE", // → 123.456,789
			'comma' : "en-EN" // → 123,456.789
		}
		
		return new Intl.NumberFormat(formats['point'],{maximumFractionDigits: decimals}).format(number)
	}
}