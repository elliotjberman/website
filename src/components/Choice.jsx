require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';

// Audio
import StreamTeam from '../streamteam/index.js';

export default class Choice extends Component {

	constructor = () => {
		this.stream;
	}

	render = () => {
		return (
			<div id="choices">
				<div className="choice">VS</div>
				<div className="choice">EB</div>
			</div>
		);
	}

}
