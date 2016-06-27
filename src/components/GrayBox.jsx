import React, { Component } from 'react';

import { Link } from 'react-router';


export default class GrayBox extends Component {

	constructor = () => {
		this.expanded = false;
	}

	componentDidMount = () => {
	}

	handleClick = () => {
		document.getElementById('gray-box').className = 'expanded';
		document.getElementById('gray-box-container').className = 'containing';
	}

	render = () => {
		return (
			<div id="gray-box-container" className = 'containing'>
				<div id="gray-box" className="expanded">
					<Link onClick={this.handleClick} to="choice">
						Elliot<br/>Berman
					</Link>
					{this.props.children}
				</div>
			</div>
		);
	}
}
