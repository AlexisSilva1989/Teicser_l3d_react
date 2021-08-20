import { $m } from './Reimports';

export class DateUtils {
	static dmyToMoment = (date: string, prefix = '-') => $m(date, ['DD', 'MM', 'YYYY'].join(prefix));
	static dmyToYmd = (date: string, prefix = '-') => DateUtils.dmyToMoment(date, prefix).format(['YYYY', 'MM', 'DD'].join(prefix));
	static stringToMoment = (date: string) => $m(date);
	static stringToUtcMoment = (date: string) => $m(date).utc();
	static stringToDate = (date: string) => $m(date).toDate();
	static stringToUtcDate = (date: string) => $m(date).utc().toDate();
	static stringToIsoDate = (date: string, separator: '-' | '/' | '' = '-') => $m(date).utc().format(['YYYY', 'MM', 'DD'].join(separator));
	static stringToDmy = (date: string, separator: '-' | '/' | '' = '-') => $m(date).utc().format(['DD', 'MM', 'YYYY'].join(separator));
	static nowToIsoDate = (separator: '-' | '/' | '' = '-') => $m().format(['YYYY', 'MM', 'DD'].join(separator));
}
