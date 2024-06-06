import { useIntl } from 'react-intl';
import { useCallback, useMemo } from 'react';
import { $v } from '../Utils/Reimports';

export const LOCALIZATION_PREFIXES = {
	META: 'labels:meta.',
	LABELS: 'labels:common.',
	COLUMNS: 'labels:columns.',
	FIELDS: 'labels:fields.',
	VALIDATIONS: 'labels:validations.',
	LINKS: 'links:common.',
	INPUTS: 'forms:inputs.',
	TITLES: 'labels:titles.',
	PLACEHOLDERS: 'labels:placeholders.',
	MESSAGES: 'messages:',
	DESCRIPTIONS: 'messages:descriptions.'
};

/** @return Provides methods for localizing strings easily using the react-intl library */
export const useLocalization = () => {
	const intl = useIntl();

	const prefixCallback = useCallback((id: string, prefix: string, params?: any) => intl.formatMessage({ id: prefix + id, }, params), [intl]);
	const localizeCallback = useCallback((localPrefix: string) => (id: string, params?: any) => prefixCallback(id, localPrefix, params), [prefixCallback]);
	const capitalizeCallback = useCallback((localPrefix: string) => (id: string, params?: any) => $v.capitalize(prefixCallback(id, localPrefix, params)), [prefixCallback]);
	
	const localizeMemo = useMemo(() => localizeCallback(''), [localizeCallback]);
	const capitalizeMemo = useMemo(() => capitalizeCallback(''), [capitalizeCallback]);

	const metaMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.META), [capitalizeCallback]);
	const labelMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.LABELS), [capitalizeCallback]);
	const fieldMemo = useMemo(() => localizeCallback(LOCALIZATION_PREFIXES.FIELDS), [localizeCallback]);
	const columnMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.COLUMNS), [capitalizeCallback]);
	const linkMemo = useMemo(() => localizeCallback(LOCALIZATION_PREFIXES.LINKS), [localizeCallback]);
	const inputMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.INPUTS), [capitalizeCallback]);
	const titleMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.TITLES), [capitalizeCallback]);
	const messageMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.MESSAGES), [capitalizeCallback]);
	const descriptionMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.DESCRIPTIONS), [capitalizeCallback]);
	const placeholderMemo = useMemo(() => capitalizeCallback(LOCALIZATION_PREFIXES.PLACEHOLDERS), [capitalizeCallback]);
	const validationCallback = useCallback((id: string, params?: any & { field?: string, other?: string }) => {
		let locParams: any = { ...params };
		if(params != null) {
			if(params.field != null) { locParams = { ...locParams, field: fieldMemo(params.field) };  }
			if(params.other != null) { locParams = { ...locParams, other: fieldMemo(params.other) };  }
		}
		return capitalizeCallback(LOCALIZATION_PREFIXES.VALIDATIONS)(id, locParams);
	}, [fieldMemo, capitalizeCallback]);

	const resultMemo = useMemo(() => {
		return {
			meta: metaMemo,
			label: labelMemo,
			column: columnMemo,
			link: linkMemo,
			input: inputMemo,
			title: titleMemo,
			placeholder: placeholderMemo,
			validation: validationCallback,
			description: descriptionMemo,
			message: messageMemo,
			capitalize: capitalizeMemo,
			localize: localizeMemo
		};
	}, [metaMemo, labelMemo, columnMemo, linkMemo, inputMemo, titleMemo, placeholderMemo, validationCallback, descriptionMemo, messageMemo, capitalizeMemo, localizeMemo]);

	return resultMemo;
};