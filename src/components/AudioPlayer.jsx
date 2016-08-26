require('normalize.css');
require('styles/App.scss');
require('styles/AudioPlayer.scss')

import ghostsArtwork from '../images/ghosts.png'
import React, { Component } from 'react';
import { Link } from 'react-router';

// Audio
import StreamTeam from '../streamteam/index.js';

let ghosts = {
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/ghosts_mix_4.1.mp3",
	artwork: ghostsArtwork
}

let umbrella = {
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/UmbrellaFinal_3.mp3",
	artwork: "/images/umbrella.jpg"
}

var songs = [ghosts, umbrella]

export default class Choice extends Component {

	constructor(props) {
		super(props)
		this.stream;
		this.state = {
			songIndex: 0
		}
		this.header = "This is music I made by myself";
		this.routes;
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
				url: songs[this.state.songIndex].url,
				chunkSize: 300, // size of chunks to stream in (in seconds)
				bitRate: 40000
			})
			this.stream.setStartTime(0);
			this.stream.gainNode.gain.value = 0;
			this.props.stopStreams();
			this.stream.play();

			window.requestAnimationFrame(this.visualize)
		}
	}

	componentDidMount = () => {
			document.getElementById('gray-box').className = 'expanded';
			document.getElementById('gray-box-container').className = 'containing';
			document.getElementById('name').style.display = "none";
			console.log(this)
	}

	componentWillUnmount = () => {
		if (this.stream){
			this.stream.pause();
			this.stream = undefined;
		}
	}

	nextSong = () => {
		this.setState({
			songIndex: this.state.songIndex + 1
		})
		this.stream.pause()
		this.stream = null;
	}
	prevSong = () => {
		this.setState({
			songIndex: this.state.songIndex - 1
		})
		this.stream.pause()
		this.stream = null;
	}

	visualize = () => {
		window.requestAnimationFrame(this.visualize);
	}
	render = () => {

		let audioStyle = {
			backgroundImage: 'url(' + songs[this.state.songIndex].artwork + ')',
		}

		return (
			<div id="audio-player">
				<span onClick={this.prevSong} className="chevron">Back</span>
				<div id="song-container">
					<div onClick={this.handleClick} style={audioStyle} className="song"></div>
				</div>
				<span onClick={this.nextSong} className="chevron">Next</span>
			</div>
		);
	}

}
