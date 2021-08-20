import { useState, useCallback, useMemo } from 'react';

export const useInit = () : [boolean, () => void] =>  {
	const [init, setInit] = useState(false);

	const doInitCallback = useCallback(() => setInit(true), [setInit]);

	const resultMemo = useMemo(() : [boolean, () => void] => {
		return [init, doInitCallback];
	}, [init, doInitCallback]);

	return resultMemo;
};