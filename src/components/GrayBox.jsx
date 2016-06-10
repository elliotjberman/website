import React, { Component } from 'react';
import Choice from './Choice';

export default class AppComponent extends Component {

	constructor = () => {
		this.props.className = "regular";
	}

	componentDidMount = () => {
	}

	handleClick = () => {
		document.getElementById('gray-box').className = 'expanded';
		document.getElementById('gray-box-container').className = 'containing';
	}

	render = () => {
		return(
			<div id="gray-box-container">
				<div id="gray-box" className="solo-name">
					<h1 onClick={this.handleClick}>Elliot<br/>Berman</h1>
					<Choice />
				</div>
			</div>
		)
	}
}
