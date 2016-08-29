require('normalize.css');
require('styles/App.scss');
require('styles/Transitions.scss')

import 'core-js/fn/object/assign';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Boys
import Main from './components/Main';
import GrayBox from './components/GrayBox';
import Choice from './components/Choice';
import AudioPlayer from './components/AudioPlayer';
import Contact from './components/Contact';


// Render the main component into the dom
ReactDOM.render((
	<Router history={browserHistory}>

		<Route component={Main}>
			<Route path="/" component={GrayBox}>
				<Route path="choice" component={Choice}></Route>
				<Route path="solo" component={AudioPlayer}></Route>
				<Route path="multiplayer" component={AudioPlayer}></Route>
				<Route path="contact" component={Contact}></Route>
			</Route>
		</Route>

	</Router>
), document.getElementById('app'));
