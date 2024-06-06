import './Assets/scss/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppStore } from './Store/AppStore';
import { unregister } from './ServiceWorker';
import { App } from './App';
import { ClearCacheProvider } from 'react-clear-cache';

require('dotenv').config();

ReactDOM.render(
	<BrowserRouter basename='/'>
		<Provider store={AppStore}>
		<ClearCacheProvider duration={720000} filename="build.json" auto={true}>
			<App />
		</ClearCacheProvider>
		</Provider>
	</BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();