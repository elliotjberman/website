require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';

export default class AppComponent extends Component {

	handleClick = (group) => {
		if (group) {
			document.getElementById('gray-box').className = 'solo-name';
		}
		else {
			document.getElementById('gray-box').className -= 'expanded';
			document.getElementById('gray-box').className -= 'solo-name';
		}
	}

	render = () => {
		return (
			<div id="choices">
				<div onClick={this.handleClick.bind(this, 0)} className="choice">VS</div>
				<div onClick={this.handleClick.bind(this, 1)} className="choice">EB</div>
			</div>
		);
	}

}
