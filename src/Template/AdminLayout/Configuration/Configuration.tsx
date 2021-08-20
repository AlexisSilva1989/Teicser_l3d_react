import React, { Fragment, useState } from 'react';

import { EnhancedLayout } from './Layout';
import { TabConfig } from './TabConfig';
import { Links } from '../../../Config/Links';

interface State {
	configOpen: boolean;
}

const Configuration = () => {
	const [state, setState] = useState<State>({
		configOpen: false
	});

	let configClass = ['menu-styler'];
	if (state.configOpen) {
		configClass = [...configClass, 'open'];
	}

	return (
		<Fragment>
			<div id='styleSelector' className={configClass.join(' ')}>
				<div className='style-toggler'>
					<a
						href={Links.BLANK}
						onClick={() =>
							setState((s) => {
								return { configOpen: !s.configOpen };
							})
						}>
						*
					</a>
				</div>
				<div className='style-block'>
					<h4 className='mb-2 text-dark'>
						Able Pro
						<small className='font-weight-normal'>v8.0 Customizer</small>
					</h4>
					<hr />
					<div className='m-style-scroller'>
						<EnhancedLayout />
						<TabConfig />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Configuration;
