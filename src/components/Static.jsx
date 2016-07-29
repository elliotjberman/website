import React, { Component } from 'react';
import {Link} from 'react-router';

export default class Static extends Component {

	componentDidMount = () => {
		setTimeout(function(){
			document.getElementById('background').className = 'loaded';
			document.getElementById('pic').className = 'loaded';
			setTimeout(function(){
				document.getElementById('gray-box').className = 'loaded';
			}, 2200)
		}, 1000)

	}
	render = () => {
		return(
		<div>
			<div id="background">
			</div>
			<div id="gray-box">
				<a href="http://www.soundcloud.com/elliotberman" id="name">Elliot<br/>Berman</a>
				<h2>(website under construction)</h2>
			</div>
			<div id="pic-container">
				<a href="http://www.soundcloud.com/elliotberman" id="pic"></a>
			</div>
		</div>
		)
	}
}
