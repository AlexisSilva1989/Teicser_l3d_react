import { useState, useCallback, useMemo } from 'react';

/**
 * @returns First element is the current search string, second element is the callback for updating the search
 */
export const useSearch = () : [string, (search: string) => void] => {
	const [search, setSearch] = useState('');

	const doSearch = useCallback((e: string) => {
		setSearch(() => e);
	}, [setSearch]);

	const resultMemo = useMemo(() : [string, (search: string) => void] => {
		return [search, doSearch];
	}, [search, doSearch]);

	return resultMemo;
};
