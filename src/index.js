require('normalize.css');
require('styles/App.scss');

import 'core-js/fn/object/assign';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// Boys
import Main from './components/Main';
import GrayBox from './components/GrayBox';
import Choice from './components/Choice';
import AudioPlayer from './components/AudioPlayer';


// Render the main component into the dom
ReactDOM.render((
	<Router history={browserHistory}>

		<Route component={Main}>
			<Route path="/" component={GrayBox}>
				<Route path="choice" component={Choice}></Route>
				<Route path="solo" component={AudioPlayer}></Route>
				<Route path="multiplayer" component={AudioPlayer}></Route>
			</Route>
		</Route>

	</Router>
), document.getElementById('app'));
