import React from 'react';
import { useFullIntl } from '../Common/Hooks/useFullIntl';
import { BaseContentView } from './Common/BaseContentView';

export const NotFound = () => {
	const { capitalize: caps } = useFullIntl();
	return (
		<BaseContentView>
			<div className='col-12 text-center py-5' style={{ height: '100vh' }}>
				<h1 className='display-4' style={{ marginTop: '20vh' }}>
					{caps('messages:not_found')}
				</h1>
			</div>
		</BaseContentView>
	);
};
