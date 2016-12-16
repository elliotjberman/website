require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


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

		let path = this.props.location.pathname;
		const childrenWithProps = React.Children.map(this.props.children,
		 (child) => React.cloneElement(child, {
			 stopStreams: this.props.stopStreams,
			 setGrayscale: this.props.setGrayscale,
			 key: path
		 })
	 	)

		return (
			<div id="gray-box-container">
				<div id="gray-box">
					<Link onClick={this.handleClick} to="choice" id="name">
						Elliot<br/>Berman
					</Link>
					<ReactCSSTransitionGroup transitionName="example"
						transitionEnterTimeout={500} transitionLeaveTimeout={500}>
						{childrenWithProps}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
}
