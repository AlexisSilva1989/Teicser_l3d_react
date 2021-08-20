import { useState, useCallback, useMemo } from 'react';

export const useModal = (defaultShow = false) : [boolean, () => void, () => void] => {
	const [show, setShow] = useState(defaultShow);

	const doShow = useCallback(() => {
		setShow(true);
	}, [setShow]);

	const doHide = useCallback(() => {
		setShow(false);
	}, [setShow]);

	return [show, doShow, doHide];
};

export const useShortModal = (defaultShow = false) => {
	const [show, setShow] = useState(defaultShow);

	const modal = useMemo(() => {
		return {
			show: () => setShow(true),
			hide: () => setShow(false),
			visible: show
		};
	}, [show, setShow]);

	return modal;
};