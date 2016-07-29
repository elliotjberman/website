require('normalize.css');
require('styles/Static.scss');

import 'core-js/fn/object/assign';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// Boys
// import Main from './components/Main';
// import GrayBox from './components/GrayBox';
// import Choice from './components/Choice';
// import AudioPlayer from './components/AudioPlayer';

import Static from './components/Static';


// Render the main component into the dom
ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/" component={Static} />
	</Router>
), document.getElementById('app'));
