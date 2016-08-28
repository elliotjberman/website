require('normalize.css');
require('styles/App.scss');
require('styles/AudioPlayer.scss')

import ghostsArtwork from '../images/ghosts.png'
import umbrellaArtwork from '../images/umbrella.jpg'

import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import Radial from './Radial.jsx';

// Audio
import StreamTeam from '../streamteam/index.js';

let ghosts = {
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/ghosts_mix_4.1.mp3",
	artwork: ghostsArtwork,
	runningTime: 201
}

let umbrella = {
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/UmbrellaFinal_3.mp3",
	artwork: umbrellaArtwork,
	runningTime: 319
}

var songs = [ghosts, umbrella]

export default class AudioPlayer extends Component {

	constructor(props) {
		super(props)
		this.stream;
		this.state = {
			songIndex: 0,
			progress: 0,
			button: 'Play'
		}
		if (this.props.location.pathname.includes('solo')) {
			this.color = "#eac3a7";
			this.collab = "alone";
			this.soundcloud = "https://www.soundcloud.com/varsity-star";
		}
		else{
			this.color = "#c78584";
			this.collab = "with some friends";
			this.soundcloud = "https://www.soundcloud.com/elliotberman";
		}
		this.routes;
		this.counter= 0;
	}

	handleClick = () => {
		if (this.stream){
			if (this.stream.paused){
				this.props.stopStreams();
				this.stream.play();
				this.setState({button: 'Pause'})
			}
			else {
				console.log('what the fuck')
				this.stream.pause();
				this.setState({button: 'Play'})
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
			this.setState({button: 'Pause'});
			window.setInterval(function() {
				this.visualize();
			}.bind(this), 100)

		}
	}

	componentDidMount = () => {
			document.getElementById('gray-box').className = 'expanded';
			document.getElementById('gray-box-container').className = 'containing';
			document.getElementById('name').style.display = "none";
	}

	componentWillUnmount = () => {
		if (this.stream){
			this.stream.pause();
			this.stream = undefined;
		}
	}

	nextSong = () => {
		this.reset();
		if (this.state.songIndex + 1 >= songs.length) {
			browserHistory.push('/choice');
		}
		else{
			this.setState({
				songIndex: this.state.songIndex + 1
			})
		}
	}
	prevSong = () => {
		this.reset();
		if (this.state.songIndex - 1 < 0) {
			browserHistory.push('/choice');
		}
		else{
			this.setState({
				songIndex: this.state.songIndex - 1
			})
		}
	}

	reset = () => {
		if (this.stream){
			this.stream.pause()
			this.stream = null;
		}
		this.counter = 0;
		this.setState({progress: 0, button: 'Play'})
	}

	visualize = () => {
		if (this.stream && !this.stream.paused){
			this.counter ++;
			var progress = this.counter/songs[this.state.songIndex].runningTime
			console.log(this.counter);
			console.log(progress)
			progress = progress*100
			this.setState({progress: Math.round(progress)});
		}
	}

	render = () => {

		let audioStyle = {
			backgroundImage: 'url(' + songs[this.state.songIndex].artwork + ')',
		}

		let style = {color: this.color}

		return (
			<div id="audio-container">
				<h1 id="audio-header">This is music I made <a target="_blank" href={this.soundcloud} style={style}>{this.collab}</a></h1>
				<div id="audio-player">
					<span onClick={this.prevSong} className="chevron">Back</span>

					<div id="song-container">
						<Radial progress={this.state.progress}>
							<div onClick={this.handleClick} style={audioStyle} className="song">
								<div id="control-overlay">{this.state.button}</div>
							</div>
						</Radial>
					</div>

					<span onClick={this.nextSong} className="chevron">Next</span>
				</div>
			</div>
		);
	}

}
