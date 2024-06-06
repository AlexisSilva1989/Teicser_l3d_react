import v from 'voca';
import m from 'moment';
import j from 'url-join';
import * as XLSX from 'xlsx';
import val from 'validate.js';
import ih from 'immutability-helper';
import d from 'downloadjs';

export const $u = ih;
export const update = ih;

export const $v = v;
export const voca = v;

export const $x = XLSX;
export type IWorksheet = XLSX.WorkSheet;
export type IWorkbook = XLSX.WorkBook;

export const $m = m;
export const moment = m;
export type IMoment = m.Moment;

export const $val = val;
export const validate = val;

export const $j = j;
export const urljoin = j;
export const joinUrls = j;

export const $d = d;
