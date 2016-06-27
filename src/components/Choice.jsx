require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';

// Audio
import StreamTeam from '../streamteam/index.js';

export default class Choice extends Component {

	constructor = () => {
		this.stream;
	}

	render = () => {
		return (
			<div id="choices">
				<Link to="solo" className="choice">VS</Link>
				<Link to="multiplayer" className="choice">EB</Link>
			</div>
		);
	}

}
