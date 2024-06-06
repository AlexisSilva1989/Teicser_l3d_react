const IntlCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

export class FormatUtils {
	static formatCodigo = (first: number | string, second?: number | string, prefix = '', count = 3, pad = '0') => {
		if (first == null) {
			return '';
		}
		if (second == null) {
			return `${prefix}${first.toString().padStart(count, pad)}`;
		}
		return `${prefix}${first.toString().padStart(count, pad)}-${second.toString()}`;
	};

	static appendCodigo = (first?: number | string, second?: number | string, prefix = '', count = 3, pad = '0') => {
		if (first == null) {
			return '';
		}
		return ' / ' + FormatUtils.formatCodigo(first, second, prefix, count, pad);
	};

	static formatCLP = (value: number) => IntlCLP.format(value);
}
