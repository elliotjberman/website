require('normalize.css');
require('styles/App.scss');
require('styles/AudioPlayer.scss')

import React, { Component } from 'react';
import { Link } from 'react-router';

// Audio
import StreamTeam from '../streamteam/index.js';

let ghosts = {
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/ghosts_mix_4.1.mp3",
	artwork: "/images/ghosts.png"
}

let umbrella = {
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/UmbrellaFinal_3.mp3",
	artwork: "/images/umbrella.jpg"
}

var songs = [ghosts, umbrella]

export default class Choice extends Component {

	constructor = () => {
		this.stream;
		this.song;
	}

	handleClick = () => {
		if (this.stream){
			if (this.stream.paused){
				this.props.stopStreams();
				this.stream.play();
				console.log('playing');
			}
			else {
				this.stream.pause();
				console.log("paused");
			}
		}
		else {
			this.stream  = new StreamTeam({
				url: this.song.url,
				chunkSize: 300, // size of chunks to stream in (in seconds)
				bitRate: 40000
			})
			this.stream.setStartTime(0);
			this.stream.gainNode.gain.value = 0;
			this.props.stopStreams();
			this.stream.play();
			console.log('playing');

			window.requestAnimationFrame(this.visualize)
		}
	}

	componentDidMount = () => {
		document.getElementById('name').style.display = "none";
		this.song = songs[0]
	}

	componentWillUnmount = () => {
		if (this.stream){
			this.stream.pause();
			this.stream = undefined;
		}
	}

	visualize = () => {
		// Ghosts kick is at
		let frequencyArray = this.stream.getFrequencies();
		let bassVolume = (frequencyArray[3]);
		console.log(bassVolume);

		let albumArt = document.getElementById('ghosts');

		albumArt.style.width = 300 + (bassVolume) + "px";
		albumArt.style.height = 300 + (bassVolume) + "px";

		window.requestAnimationFrame(this.visualize)
	}
	render = () => {

		return (
			<div id="audio-player">
				<Link to="/choice" className="chevron">Back</Link>
				<div id="song-container">
					<div onClick={this.handleClick} id="ghosts" className="song"></div>
				</div>
				<Link to="/multiplayer" className="chevron">Next</Link>
			</div>
		);
	}

}
