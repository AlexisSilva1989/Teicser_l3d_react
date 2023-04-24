import { unitOfTime } from 'moment';
import { $m, IMoment } from './Reimports';
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
	static differenceBetweenDates = (dateStart: string , dateEnd: string , range: unitOfTime.Diff = 'days') => {
		const dateStartMoment : IMoment  = $m(dateStart,'DD-MM-YYYY');
		const dateEndMoment : IMoment  = $m(dateEnd,'DD-MM-YYYY');
		return dateEndMoment.diff(dateStartMoment, range);
	}
  static excelToDate = (dateExcel: any) => {
    const date = new Date(
      dateExcel.y, dateExcel.m - 1, dateExcel.d
    );
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }
}
