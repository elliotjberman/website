require('normalize.css');
require('styles/App.scss');
require('styles/AudioPlayer.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';

// Audio
import StreamTeam from '../streamteam/index.js';

export default class Choice extends Component {

	constructor = () => {
		this.stream;
	}

	handleClick = () => {
		if (this.stream){
			if (this.stream.paused){
				this.props.stopStreams(function(){
					this.stream.play();
					console.log('playing');
				});
			}
			else {
				this.stream.pause();
				console.log("paused");
			}
		}
		else {
			this.stream  = new StreamTeam({
				url: "https://s3.amazonaws.com/elliot-berman-media/solo/ghosts_mix_4.1.mp3",
				chunkSize: 300, // size of chunks to stream in (in seconds)
				bitRate: 40000
			})
			this.stream.setStartTime(0);
			this.stream.gainNode.gain.value = 0;
			this.props.stopStreams(function(){
				this.stream.play();
				console.log('playing');
			});

			window.requestAnimationFrame(this.visualize)
		}
	}

	componentDidMount = () => {
		document.getElementById('name').style.display = "none";
	}

	componentWillUnmount = () => {
		if (this.stream){
			this.stream.pause();
			this.stream = undefined;
		}
	}

	visualize = () => {
		let frequencyArray = this.stream.getFrequencies();
		let bassVolume = (frequencyArray[2] + frequencyArray[3])/2;
		let highVolume = (frequencyArray[32] + frequencyArray[33])/2;

		let albumArt = document.getElementById('ghosts');

		albumArt.style.borderRadius = (100-highVolume) + "%";
		albumArt.style.width = 300 + (bassVolume) + "px";
		albumArt.style.height = 300 + (bassVolume) + "px";

		window.requestAnimationFrame(this.visualize)
	}
	render = () => {

		return (
			<div id="audio-player">
				<div className="chevron">Back</div>
				<div onClick={this.handleClick} id="ghosts" className="song"></div>
				<div className="chevron">Next</div>
			</div>
		);
	}

}
