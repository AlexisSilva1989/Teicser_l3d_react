import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleNav } from '../../../Store/Template/TemplateActionCreators';
import { bindActionCreators, Dispatch } from 'redux';
import { IAppState } from '../../../Store/AppStore';

interface Props {
	collapseMenu: boolean;
	toggleNav: () => void;
}

class OutsideClick extends Component<Props> {
	wrapperRef: any;

	constructor(props: any) {
		super(props);

		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleOutsideClick);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleOutsideClick);
	}

	setWrapperRef(node: any) {
		this.wrapperRef = node;
	}

	/**
	 * close menu if clicked on outside of element
	 */
	handleOutsideClick(event: any) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			if (window.outerWidth < 992 && this.props.collapseMenu) {
				this.props.toggleNav();
			}
		}
	}

	render() {
		return (
			<div className='nav-outside' ref={this.setWrapperRef}>
				{this.props.children}
			</div>
		);
	}
}

const mapStateToProps = (state: IAppState) => {
	return {
		collapseMenu: state.template.collapseMenu
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return bindActionCreators(
		{
			toggleNav
		},
		dispatch
	);
};

export const EnhancedOutsideClick = connect(mapStateToProps, mapDispatchToProps)(OutsideClick);
