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
	}

	render = () => {
		return(
			<div className="gray-box-container">
				<div id="gray-box">
					<h1 onClick={this.handleClick}>Elliot<br/>Berman</h1>
					<Choice />
				</div>
			</div>
		)
	}
}
