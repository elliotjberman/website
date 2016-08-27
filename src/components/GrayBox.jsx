require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';

export default class GrayBox extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount = () => {

	}

	// handleClick = () => {
	// 	document.getElementById('gray-box').className = 'expanded';
	// 	document.getElementById('gray-box-container').className = 'containing';
	// }


	render = () => {
		const childrenWithProps = React.Children.map(this.props.children,
		 (child) => React.cloneElement(child, {
			 stopStreams: this.props.stopStreams,
			 setGrayscale: this.props.setGrayscale
		 })
	 	)

		return (
			<div id="gray-box-container">
				<div id="gray-box">
					<Link onClick={this.handleClick} to="choice" id="name">
						Elliot<br/>Berman
					</Link>
					{childrenWithProps}
				</div>
			</div>
		);
	}
}
