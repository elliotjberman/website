require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';

// Audio
import StreamTeam from '../streamteam/index.js';

export default class AppComponent extends Component {

	constructor = () => {
		this.stream;
	}

	handleClick = (group) => {
		if (group) {
			document.getElementById('gray-box').className = 'solo-name';
			document.getElementById('gray-box-container').className -= 'containing';
		}
		else {
			// document.getElementById('gray-box').className -= 'expanded';
			// document.getElementById('gray-box').className -= 'solo-name';
			this.stream  = new StreamTeam({
				url: "https://s3.amazonaws.com/elliot-berman-media/solo/ghosts_mix_4.1.mp3",
				chunkSize: 200, // size of chunks to stream in (in seconds)
				bitRate: 40000
			});

			this.stream.setStartTime(0);
			this.stream.gainNode.gain.value = 0;
			this.stream.play();
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
