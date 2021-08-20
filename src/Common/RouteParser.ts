import { IntlShape } from 'react-intl';
import { joinUrls } from './Utils/Reimports';

export interface PathsGroup {
	prefix: string
	routes: {
		[route: string]: React.ReactNode
	} | PathsGroup[]
}

export type PathsConfig = PathsGroup[];

export class RouteParser {
	prefix: string;
	localizer: IntlShape;

	constructor(localizer: IntlShape, prefix: string) {
		this.localizer = localizer;
		this.prefix = prefix;
	}

	findId(element: string) {
		return this.localizer.formatMessage({ id: this.prefix + element });
	}

	parseGroup(group: PathsGroup) {
		const routes: { [route: string]: React.ReactNode } = { };
		if(Array.isArray(group.routes)) { return {}; }
		
		for(const route in group.routes) {

			const stringRoute = group.prefix === '/' ? route : joinUrls(group.prefix, route);
			const routeElements = stringRoute.split('/').join(' ').trim().split(' ');
			const localizedRouteElements: string[] = [];

			for(const routeElement of routeElements) {
				const localizedRoute = this.findId(routeElement);
				localizedRouteElements.push(localizedRoute);
			}
			const fullLocalizedRoute = joinUrls(localizedRouteElements);

			routes[fullLocalizedRoute] = group.routes[route];
		}

		return routes;
	}

	parseConfig(config: PathsConfig) {
		let routes: { [route: string]: React.ReactNode } = { };

		for(const group of config) {
			routes = { ...routes, ...this.parseGroup(group) };
		}
		return routes;
	}
}