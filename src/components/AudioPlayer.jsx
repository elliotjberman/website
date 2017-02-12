require('normalize.css');
require('styles/App.scss');
require('styles/AudioPlayer.scss')

import ghostsArtwork from '../images/ghosts.png'
import umbrellaArtwork from '../images/umbrella.jpg'

import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import Radial from './Radial.jsx';

// Audio
import StreamTeam from 'streamteam';

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
		super(props);
		this.stream;
		this.state = {
			songIndex: 0,
			progress: 0,
			button: 'Play'
		}
		if (this.props.location.pathname.includes('solo')) {
			this.color = "#98bd98";
			this.collab = "by myself";
			this.soundcloud = "https://www.soundcloud.com/varsity-star";
			this.props.setHue(110/360);
		}
		else{
			this.color = "#c78584";
			this.collab = "with some friends";
			this.soundcloud = "https://www.soundcloud.com/elliotberman";
			this.props.setHue(10/360);
		}
		this.routes;
		this.counter = 0;
	}

	handleClick = () => {
		if (this.stream){
			if (this.stream.paused){
				this.props.stopStreams();
				this.stream.play();
				this.setState({button: 'Pause'})
			}
			else {
				this.stream.pause();
				this.setState({button: 'Play'})
			}
		}
		else {
			this.stream  = new StreamTeam({
				url: songs[this.state.songIndex].url,
				chunkSize: 300, // size of chunks to stream in (in seconds)
				bitRate: 40000,
				smoothTime: true
			})
			this.stream.setStartTime(0);
			this.stream.gainNode.gain.value = 0;
			this.props.stopStreams();
			this.stream.play();
			this.setState({button: 'Pause'});
			this.visualize();

		}
	}

	componentDidMount = () => {
			// this.props.setGrayscale(true);
			document.getElementById('gray-box').className = 'full';
			document.getElementById('gray-box-container').className = 'containing';
			document.getElementById('name').style.opacity = 0;
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
			var progress = this.stream.getCurrentTime()/songs[this.state.songIndex].runningTime
			progress = progress*1000
			this.setState({progress: Math.round(progress)});
			window.requestAnimationFrame(this.visualize);
	}

	render = () => {

		let audioStyle = {
			backgroundImage: 'url(' + songs[this.state.songIndex].artwork + ')'
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
