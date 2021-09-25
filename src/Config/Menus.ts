import { IMenuLayout } from '../Store/Dashboard/IDashboardState';

const userMenus: IMenuLayout = {
	side: [
		{
			name: 'menus:information_load',
			modules: [
				{
					permission: 'information_load',
					name: 'menus:scam_3d',
					path: 'routes:base.scam_3d',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'information_load',
					name: 'menus:operational_data',
					path: 'routes:base.operational_data',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'information_load',
					name: 'menus:image_condicion',
					path: 'routes:base.image_condicion',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'information_load',
					name: 'menus:calibration',
					path: 'routes:base.calibration',
					icon: 'fas fa-file-invoice',
				}
			]
		},
		{
			name: 'menus:reports',
			modules: [
				{
					permission: 'information_load',
					name: 'menus:information',
					path: 'routes:base.information',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'reports',
					name: 'menus:records',
					path: 'routes:base.records',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'reports',
					name: 'menus:dashboard',
					path: 'routes:base.dashboard',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'reports',
					name: 'menus:reports_pdf',
					path: 'routes:base.reports_pdf',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'reports',
					name: 'menus:downloadable_report',
					path: 'routes:base.downloadable_report',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'reports',
					name: 'menus:measurement',
					path: 'routes:base.measurement',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'reports',
					name: 'menus:projection',
					path: 'routes:base.projection',
					icon: 'fas fa-file-invoice',
				}
			]
		},
		{
			name: 'menus:gemelo_digital',
			modules: [
				{
					permission: 'gemelo_digital',
					name: 'menus:condicion_laser',
					path: 'routes:base.condicion_laser',
					icon: 'fas fa-file-invoice',
				},
				{
					permission: 'gemelo_digital',
					name: 'menus:variables_operativas',
					path: 'routes:base.variables_operativas',
					icon: 'fas fa-file-invoice',
				}
			]
		}


	],
	top: [
		{
			name: 'menus:configuration',
			icon: 'fas fa-cogs',
			modules: [
				{
					permission: 'configuration',
					name: 'menus:users',
					path: 'routes:base.users',
					icon: 'fas fa-users'
				},
				{
					permission: 'configuration',
					name: 'menus:roles',
					path: 'routes:base.roles',
					icon: 'fas fa-user-tag'
				},
				{
					permission: 'configuration',
					name: 'menus:parameters',
					path: 'routes:base.parameters',
					icon: 'fas fa-cog'
				},
				{
					permission: 'configuration',
					name: 'menus:company',
					path: 'routes:base.company',
					icon: 'fas fa-building' 
				}
			]
		}
	]
};

export default userMenus;
