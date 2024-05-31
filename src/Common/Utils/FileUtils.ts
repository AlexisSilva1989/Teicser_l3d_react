import { $x, IWorkbook } from "./Reimports";

export class FileUtils {
  static readFileAsync(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  }

  static async fileToWorkbook(file: File) {
    const contents = await FileUtils.readFileAsync(file);
    const workbook = $x.read(contents, { type: "binary" });
    return workbook;
  }

  static sheetToArray<T = unknown>(
    workbook: IWorkbook,
    index = 0,
    range?: string,
    columns?: string[]
  ) {
    const sheet = workbook.Sheets[workbook.SheetNames[index]];
    const arr = $x.utils.sheet_to_json(sheet, {
      header: columns ?? undefined,
      range,
    });
    return arr as T[];
  }

  static sheetToJson(
    workbook: IWorkbook,
    index = 0,
    range?: string,
    columns?: string[]
  ) {
    const array = FileUtils.sheetToArray(workbook, index, range, columns);
    return JSON.stringify(array);
  }

  static async readFileToArray<T = unknown>(
    file: File,
    sheet = 0,
    range?: string,
    columns?: string[]
  ) {
    const workbook = await FileUtils.fileToWorkbook(file);
    const arr = FileUtils.sheetToArray(workbook, sheet, range, columns);
    return arr as T[];
  }
}
