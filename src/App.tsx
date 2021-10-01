import React, { Suspense, useCallback, useEffect , useState} from 'react';
import { IntlProvider } from 'react-intl';
import { Loader } from './Views/Common/Loader';
import { Login } from './Views/Auth/Login';
import { LoadScreen } from './Views/Common/LoadScreen';
import { AdminLayout } from './Template/AdminLayout/AdminLayout';
import { ErrorView } from './Components/Common/Notifications';
import { useDashboard } from './Common/Hooks/useDashboard';
import DocumentTitle from 'react-document-title';
import { useCurrenteNameModule } from './Common/Hooks/useCurrenteNameModule';
import { DefaultToast, ToastProps, ToastProvider} from 'react-toast-notifications';
import { Route, Switch } from 'react-router-dom';
import { CreateContrasena } from './Views/Auth/CreateContrasena';
import { RestablecerContrasena } from './Views/Auth/RestablecerContrasena';

const CustomToast: React.FC<ToastProps> = ({ children, ...props }) => (
	<DefaultToast {...props}>
		<div >{children}</div>
	</DefaultToast>
);



export const App = () => {
	const { locale, messages, authenticated, loading, forwardUserToken } = useDashboard();
	const [message, setMessage] = useState<string>('');
	const nameCurrentModule = useCurrenteNameModule();

	//const { isLatestVersion, emptyCacheStorage } = useClearCacheCtx();
	
	useEffect(() => {
		forwardUserToken();
	}, [forwardUserToken]);

	const onIntlErrorCallback = useCallback((error: string) => { /* TODO: Handle localization error */ }, []);

	return ( <div>
		<IntlProvider locale={locale} messages={messages} onError={onIntlErrorCallback}>
			<ToastProvider
				autoDismissTimeout={6000}
				placement="top-right"
				components={{ Toast: CustomToast }}>
		
				<div style={loading ? { width: '100vw', height: '100vh', overflow: 'hidden' } : {}}>
					{/* TODO: Suspense is not implemented in a right way, so you most likely won't ever see the Loader component. Either remove suspense or the upper conditional loading component */}
					{loading && <LoadScreen background='var(--dark)' />} 
					<Suspense fallback={<Loader />}>
						{authenticated ? 
							<DocumentTitle title={nameCurrentModule}>
								<AdminLayout />
							</DocumentTitle> 
						: 
							<Switch>
								<Route path='/crear_contraseña/token=:token&email=:email' component={CreateContrasena} />
								<Route path='/restablecer_contraseña' component={RestablecerContrasena} />
								<Login/>
							</Switch>
						}
					</Suspense>
					<ErrorView />
				</div>
			</ToastProvider>
		</IntlProvider> 
	</div>);
};