require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class GrayBox extends Component {

	constructor = () => {

	}

	componentDidMount = () => {

	}

	handleClick = () => {
		document.getElementById('gray-box').className = 'expanded';
		document.getElementById('gray-box-container').className = 'containing';
	}

	render = () => {
		const childrenWithProps = React.Children.map(this.props.children,
		 (child) => React.cloneElement(child, {
			 stopStreams: this.props.stopStreams
		 })
	 	)

		return (
			<div id="gray-box-container" className="containing">
				<div id="gray-box" className="expanded">
					<Link onClick={this.handleClick} to="choice" id="name">
						Elliot<br/>Berman
					</Link>
					{childrenWithProps}
				</div>
			</div>
		);
	}
}
