import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toast, ToastHeader, ToastBody } from 'react-bootstrap';
import { IErrorSummary } from '../../Store/Dashboard/IDashboardState';
import { IAppState } from '../../Store/AppStore';
import { dismissError, dismissAll } from '../../Store/Dashboard/DashboardActionCreators';
import { useFullIntl } from '../../Common/Hooks/useFullIntl';
import { Utils } from '../../Common/Utils/Utils';

/*
export const ErrorView = () => {
	const { capitalize: caps } = useFullIntl();
	const dispatch = useDispatch();
	const dismiss = useCallback((e: number) => dispatch(dismissError(e)), [dispatch]);
	const dismissAllErrors = useCallback(() => dispatch(dismissAll()), [dispatch]);
	const { errors, loading } = useSelector<IAppState, { errors: IErrorSummary[], loading: boolean }>((x) => {
		return { errors: x.dashboard.errors, loading: x.dashboard.loading };
	});

	return (
		<div style={{ position: 'sticky', bottom: 0, left: 0, height: 0 }}>
			{!loading && (
				<div
					style={{
						position: 'absolute',
						bottom: '1.5rem',
						right: '1.5rem',
						zIndex: 999
					}}>
					{errors.length > 0 &&
						errors
							.reverse()
							.slice(-3)
							.map((x, i) => {
								return (
									<Toast key={i} onClose={() => dismiss(i)} style={{ width: '300px' }} delay={4000} autohide>
										<ToastHeader className='text-danger' >
											<i className='fas fa-exclamation-triangle text mr-3' />
											<b className='mr-auto'>{caps(x.params != null && 'code' in x.params ? Utils.localizeErrorCode(x.params.code) : 'titles:system_error')}</b>
										</ToastHeader>
										<ToastBody>{caps(x.error, x.params)}</ToastBody>
									</Toast>
								);
							})}
					{errors.length > 3 && (
						<Toast key={-1} style={{ width: '300px' }} onClose={dismissAllErrors}>
							<ToastHeader>
								<small className='text-secondary mr-auto'>
									{caps('messages:remaining_errors', {
										count: errors.length - 3
									})}
								</small>
							</ToastHeader>
						</Toast>
					)}
				</div>
			)}
		</div>
	);
};

*/
export const ErrorView  = () => {
	const { capitalize: caps } = useFullIntl();

	const dispatch = useDispatch();
	const dismiss = useCallback((e: number) => dispatch(dismissError(e)), [dispatch]);
	const dismissAllErrors = useCallback(() => dispatch(dismissAll()), [dispatch]);
	const { errors, loading } = useSelector<IAppState, { errors: IErrorSummary[], loading: boolean }>((x) => {
		return { errors: x.dashboard.errors, loading: x.dashboard.loading };
	});
	
	return (
		<div style={{ position: 'sticky', bottom: 0, left: 0, height: 0 }}>
			{!loading && (
				<div
					style={{
						position: 'absolute',
						bottom: '1.5rem',
						right: '1.5rem',
						zIndex: 999
					}}>
					{errors.length > 0 &&
						errors
							.reverse()
							.slice(-3)
							.map((x, i) => {
								return (
									<Toast key={i} onClose={() => dismiss(i)} style={{ width: '300px' }} delay={4000} autohide>
										<ToastHeader className='text-danger' >
											<i className='fas fa-exclamation-triangle text mr-3' />
											<b className='mr-auto'>{caps(x.params != null && 'code' in x.params ? Utils.localizeErrorCode(x.params.code) : 'titles:system_error')}</b>
										</ToastHeader>
										<ToastBody>{caps(x.error, x.params)}</ToastBody>
									</Toast>
								);
							})}
					{errors.length > 3 && (
						<Toast key={-1} style={{ width: '300px' }} onClose={dismissAllErrors}>
							<ToastHeader>
								<small className='text-secondary mr-auto'>
									{caps('messages:remaining_errors', {
										count: errors.length - 3
									})}
								</small>
							</ToastHeader>
						</Toast>
					)}
				</div>
			)}
		</div>
	);
};



