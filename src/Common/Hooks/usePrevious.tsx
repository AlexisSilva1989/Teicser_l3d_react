import { useRef, useEffect } from 'react';

export const usePrevious = <T extends unknown>(value: any) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current as T;
};
