import React, { Fragment, useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { connect, useDispatch, useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { setNotificationModule, setBadges } from '../../../Store/Dashboard/DashboardActionCreators';

import { NavGroup } from './NavGroup';
import { injectIntl, IntlShape } from 'react-intl';
import { localizeIntl } from '../../../Common/Utils/LocalizationUtils';
import { Links } from '../../../Config/Links';
import { IMenu, INotificationModule, IBadges } from '../../../Store/Dashboard/IDashboardState';
import { IAppState } from '../../../Store/AppStore';
import { Dispatch, bindActionCreators } from 'redux';
import { navContentLeave } from '../../../Store/Template/TemplateActionCreators';
import { useNotifications } from '../../../Common/Hooks/useNotifications';
import { ax } from '../../../Common/Utils/AxiosCustom';
import { AxiosError } from 'axios';

import { PUSHER_APP_KEY, PUSHER_APP_CLUSTER , PUSHER_APP_PORT} from '../../../Config';

//NUEVA IMPLEMENTACION PUSHER
const client = new Pusher(PUSHER_APP_KEY, {
	cluster: PUSHER_APP_CLUSTER
});

//SUBSCRIBE AL EVENTO DEL SERVIDOR
const channel = client.subscribe('CH_NOTIFICATION');

interface Props {
	intl: IntlShape
	menus: IMenu[]
	layout: string
	rtl: boolean
	authenticated: boolean
	navContentLeave: () => void
	notificationModule: INotificationModule
}

interface State {
	scrollWidth: number
	prevDisable: boolean
	nextDisable: boolean
}

type BadgeData = { [key: string]: number };



const NavContent = (props: Props) => {

	const { push } = useNotifications();
	// const [badges, setBadgesState] = useState<BadgeData>({});
	const badges = useSelector<IAppState, IBadges>( state => state.dashboard.badges  );

	const dispatch = useDispatch();
    
    //GET NOTIFICATION ON LOGIN
	// useEffect(() => {
	// 	async function fetch() {
	// 		await ax.get<BadgeData>('v2/notificaciones/badges').then(e => {
	// 			dispatch(setBadges(e.data));
	// 		}).catch((e: AxiosError) => push.error('errors:base.load', { code: e.response?.status }));
	// 	}
	// 	fetch();
	// }, []);

    //ON EVENT FOR WEBSOCKET LARAVEL CON PUSHER
	useEffect(() => {
        channel.bind('NOTIFICATION', function (data:any) {
            dispatch(setBadges(data.notification));
        });
	},[]);

	useEffect( () => {
		if(props.notificationModule.module !== undefined){
			if(
				props.notificationModule.action === "substrac" && 
				badges[props.notificationModule.module]
			){
				const dataBadges = {
					...badges, 
					[props.notificationModule.module] : badges[props.notificationModule.module] > 0 ? --badges[props.notificationModule.module] : 0    
						};
				dispatch(setBadges(dataBadges));
			}
			else if(
				props.notificationModule.action === "add" 
			){
				const dataBadges = {
					...badges, 
					[props.notificationModule.module] : badges[props.notificationModule.module] ? ++badges[props.notificationModule.module] : 1    
						};
				dispatch(setBadges(dataBadges));
			}
			dispatch(setNotificationModule({
				module: undefined,
				action: undefined
			}));
		}
	} , [props.notificationModule]);

	const [state, setState] = useState<State>({
		scrollWidth: 0,
		prevDisable: true,
		nextDisable: false
	});

	function scrollPrevHandler() {
		const wrapperWidth = document.getElementById('sidenav-wrapper')!.clientWidth;

		const scrollWidth = state.scrollWidth - wrapperWidth;
		if (scrollWidth < 0) {
			setState({ scrollWidth: 0, prevDisable: true, nextDisable: false });
		} else {
			setState({ ...state, scrollWidth: scrollWidth, prevDisable: false });
		}
	}

	function scrollNextHandler() {
		const wrapperWidth = document.getElementById('sidenav-wrapper')!.clientWidth;
		const contentWidth = document.getElementById('sidenav-horizontal')!.clientWidth;

		let scrollWidth = state.scrollWidth + (wrapperWidth - 80);
		if (scrollWidth > contentWidth - wrapperWidth) {
			scrollWidth = contentWidth - wrapperWidth + 80;
			setState({
				scrollWidth: scrollWidth,
				prevDisable: false,
				nextDisable: true
			});
		} else {
			setState({ ...state, scrollWidth: scrollWidth, prevDisable: false });
		}
	}

	const get = localizeIntl(props.intl);
	const enhancedMenus = props.menus.map((m) => {
		return {
			...m,
			type: 'group',
			submenus: m.submenus
				? m.submenus.map((sm) => {
					return {
						...sm,
						type: 'collapse',
						modules: sm.modules?.map((mod) => {
							return { ...mod, type: 'item' };
						})
					};
				})
				: [],
			modules: m.modules
				? m.modules.map((mod) => {
					return { ...mod, type: 'item' };
				})
				: []
		};
	});
	const navItems = enhancedMenus.map((item) => {
		return <NavGroup key={item.name} group={item} badges={badges} />;
	});

	let scrollStyle: any = {
		marginLeft: '-' + state.scrollWidth + 'px'
	};

	if (props.layout === 'horizontal' && props.rtl) {
		scrollStyle = {
			marginRight: '-' + state.scrollWidth + 'px'
		};
	}

	let mainContent: JSX.Element;
	if (props.layout === 'horizontal') {
		let prevClass = ['sidenav-horizontal-prev'];
		if (state.prevDisable) {
			prevClass = [...prevClass, 'disabled'];
		}
		let nextClass = ['sidenav-horizontal-next'];
		if (state.nextDisable) {
			nextClass = [...nextClass, 'disabled'];
		}

		mainContent = (
			<div className='navbar-content sidenav-horizontal' id='layout-sidenav'>
				<a href={Links.BLANK} className={prevClass.join(' ')} onClick={scrollPrevHandler}>
					<span />
				</a>
				<div id='sidenav-wrapper' className='sidenav-horizontal-wrapper'>
					<ul id='sidenav-horizontal' className='nav pcoded-inner-navbar sidenav-inner' onMouseLeave={props.navContentLeave} style={scrollStyle}>
						{navItems}
					</ul>
				</div>
				<a href={Links.BLANK} className={nextClass.join(' ')} onClick={scrollNextHandler}>
					<span />
				</a>
			</div>
		);
	} else {
		mainContent = (
			<div className='navbar-content next-scroll'>
				<PerfectScrollbar>
					<ul className='nav pcoded-inner-navbar' id='nav-ps-next'>
						{props.authenticated ? navItems : <li className='py-5 text-muted text-center'>{get('alerts.signin')}</li>}
					</ul>
				</PerfectScrollbar>
			</div>
		);
	}

	return <Fragment>{mainContent}</Fragment>;
};

const mapStateToProps = (state: IAppState): Pick<Props, 'layout' | 'rtl' | 'authenticated' | 'notificationModule'> => {
	return {
		layout: state.template.layout,
		rtl: state.template.rtl,
		authenticated: state.dashboard.authenticated,
		notificationModule: state.dashboard.notificationModule
	};
};

const mapDispatchToProps = (dispatch: Dispatch): Pick<Props, 'navContentLeave'> => {
	return bindActionCreators(
		{
			navContentLeave
		},
		dispatch
	);
};

export const EnhanceNavContent = connect(mapStateToProps, mapDispatchToProps)(injectIntl(NavContent));
