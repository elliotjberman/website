require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Choice extends Component {

	constructor = () => {
		this.stream;
	}

	componentDidMount = () => {
		this.props.setGrayscale(true);
		document.getElementById('gray-box').className = 'expanded';
		document.getElementById('gray-box-container').className = 'containing';
		document.getElementById('name').style.display = "block";
	}

	render = () => {
		return (
			<div id="choices">
				<Link to="solo" className="choice">
					<span>Varsity<br/>Star</span>
				</Link>
				<Link to="multiplayer" className="choice">
					<span>Elliot<br/>Berman<br/></span>
				</Link>
				<Link to="contact" className="choice">
					<span>Contact</span>
				</Link>
			</div>
		);
	}

}
