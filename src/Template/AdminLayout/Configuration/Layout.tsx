import React, { Fragment } from 'react';
import { Links } from '../../../Config/Links';
import { Dispatch, bindActionCreators } from 'redux';
import { setLayoutType, reset } from '../../../Store/Template/TemplateActionCreators';
import { IAppState } from '../../../Store/AppStore';
import { connect } from 'react-redux';

interface Props {
	setLayoutType: (type: string) => void;
	reset: () => void;
	layoutType: string;
}

const Layout = (props: Props) => {
	const layoutOption = (
		<div>
			<h6 className='text-dark'>Layouts</h6>
			<div className='theme-color layout-type'>
				<a href={Links.BLANK} onClick={() => props.setLayoutType('menu-dark')} title='Default Layout' className={props.layoutType === 'menu-dark' ? 'active' : ''} data-value='menu-dark'>
					<span />
					<span />
				</a>
				<a href={Links.BLANK} onClick={() => props.setLayoutType('menu-light')} title='Light' className={props.layoutType === 'menu-light' ? 'active' : ''} data-value='menu-light'>
					<span />
					<span />
				</a>
				<a href={Links.BLANK} onClick={() => props.setLayoutType('dark')} title='Dark' className={props.layoutType === 'dark' ? 'active' : ''} data-value='dark'>
					<span />
					<span />
				</a>
				<a href={Links.BLANK} onClick={() => props.reset()} title='Reset' className={props.layoutType === 'reset' ? 'active' : ''} data-value='reset'>
					Reset to Default
				</a>
			</div>
		</div>
	);
	return <Fragment>{layoutOption}</Fragment>;
};

const mapProps = (state: IAppState): Pick<Props, 'layoutType'> => {
	return {
		layoutType: state.template.layoutType
	};
};

const mapDispatch = (dispatch: Dispatch): Pick<Props, 'reset' | 'setLayoutType'> => {
	return bindActionCreators(
		{
			setLayoutType,
			reset
		},
		dispatch
	);
};

export const EnhancedLayout = connect(mapProps, mapDispatch)(Layout);
