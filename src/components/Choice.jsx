require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Choice extends Component {

	constructor() {
		super();
	}

	componentDidMount = () => {
		this.props.setGrayscale(false);
		this.props.setHue(26/360);
		document.getElementById('gray-box').className = 'expanded';
		document.getElementById('gray-box-container').className = 'containing';
		document.getElementById('name').style.opacity = 1;
	}

	toggleLeaving = (event) => {
		event.target.className = 'choice leaving';
	}

	render = () => {
		return (
			<div id="choices">
				<Link onClick={this.toggleLeaving} to="solo" className="choice">
					<span>Varsity<br/>Star</span>
				</Link>
				<Link onClick={this.toggleLeaving} to="multiplayer" className="choice">
					<span>Multi-<br/>player</span>
				</Link>
				<Link onClick={this.toggleLeaving} to="contact" className="choice">
					<span>Contact</span>
				</Link>
			</div>
		);
	}

}
