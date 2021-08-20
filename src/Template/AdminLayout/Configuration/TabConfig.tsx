import React, { Fragment } from 'react';
import { ColorOptions } from './ColorOptions';
import { EnhancedLayoutOptions } from './LayoutOptions';

export const TabConfig = () => {
	return (
		<Fragment>
			<ColorOptions />
			<EnhancedLayoutOptions />
		</Fragment>
	);
};
