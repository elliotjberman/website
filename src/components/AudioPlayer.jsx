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
	title: "Ghosts",
	date: "March 2016",
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/ghosts_mix_4.1.mp3"
}

let ballet = {
	title: "Ballet",
	date: "January 2017",
	url: "https://s3.amazonaws.com/elliot-berman-media/solo/ballet_mix3.2.mp3"
}

let woods = {
	title: "Woods",
	date: "September 2015",
}

let nothing_special = {
	title: "Nothing Special",
	date: "February 2016",
}

var solo = [ghosts, ballet];

var group = [woods, nothing_special];

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
			this.textColor = "#557d55";
			this.collab = "solo";
			this.soundcloud = "https://www.soundcloud.com/varsity-star";
			this.songs = solo;
			this.props.setColor(110/360, 0.25);
		}
		else{
			this.color = "#c78584";
			this.textColor = "#7f4544";
			this.collab = "with friends";
			this.songs = group;
			this.soundcloud = "https://www.soundcloud.com/elliotberman";
			this.props.setColor(10/360, 0.25);
		}
		this.routes;
		this.counter = 0;
	}

	toggleSong = () => {
		if (this.stream) {
			if (this.stream.paused) {
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
			this.stream  = new Audio(this.songs[this.state.songIndex].url);

			this.props.stopStreams();
			this.stream.play();
			this.setState({button: 'Pause'});
			this.visualize();

		}
	}

	componentDidMount = () => {
			// this.props.setGrayscale(true);
			document.getElementById('gray-box').className = 'full';
			document.getElementById('gray-box-container').className = 'containing gray';
			document.getElementById('name').style.opacity = 0;
			document.getElementById('name').style.zIndex = 0;
	}

	componentWillUnmount = () => {
		if (this.stream){
			this.stream.pause();
			this.stream = undefined;
		}
	}

	nextSong = () => {
		this.reset();
		if (this.state.songIndex + 1 >= this.songs.length) {
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
			var progress = this.stream.currentTime/this.stream.duration;
			progress *= 1000;
			this.setState({progress: Math.round(progress)/10});
			if (progress >= 1000) {
				this.setState({button: 'Play'});
				return
			}
			window.requestAnimationFrame(this.visualize);
	}

	timecode = (seconds) => {
		if (!seconds)
			return "0:00"

		let minutes = Math.floor(seconds/60);
		let remainder = Math.round(seconds % 60);
		remainder = remainder < 10 ? "0" + remainder : remainder;

		return minutes + ":" + remainder;
	}

	fadeUpdate = (progress) => {
		let val = progress ? 240 - 2 * progress : 240;
		return {borderBottomColor: 'rgb(' + val + ', ' + val + ', ' + val + ')'}
	}

	render = () => {

		let containerStyle = {background: this.color}
		let textStyle = {color: this.textColor}

		return (
			<div id="audio-container" style={containerStyle}>
				<div className="grid whole">
					<h1 id="audio-header">This is music I made <a target="_blank" href={this.soundcloud} style={textStyle}>{this.collab}</a></h1>
				</div>

				<div className="flexContainer">

					<div id="rows-container">
						<div className="row">
							<div className="grid fifth graphic">
								<div style={this.fadeUpdate(this.state.progress)} onClick={this.toggleSong} id="triangle-1" className={"graphic-square " + this.songs[this.state.songIndex].title.toLowerCase()}>
									<div style={{height : this.state.progress + "%"}} className="fill"></div>
								</div>
							</div>
							<div className="grid fifth graphic">
								<div style={this.fadeUpdate(this.state.progress)} id="triangle-2" className={"graphic-square " + this.songs[this.state.songIndex].title.toLowerCase()}></div>
							</div>

							<div className="grid fifth space-1">
								<h2 id="title" className="heading">
									{this.songs[this.state.songIndex].title}
								</h2>
								<p>
									Music and engineering by Elliot Berman. {this.songs[this.state.songIndex].date}.
								</p>
							</div>
						</div>



						<div className="row">
							<div className="grid fifth graphic">
								<div className={"graphic-square " + this.songs[this.state.songIndex].title.toLowerCase()}></div>
							</div>
							<div className="grid fifth graphic">
								<div className={"graphic-square " + this.songs[this.state.songIndex].title.toLowerCase()}></div>
							</div>

							<div className="grid fifth space-1">
								<h2 onClick={this.toggleSong} className="heading control">
									{this.state.button}
								</h2>
								<p className="fore">
									{this.stream ? this.timecode(this.stream.currentTime) + "/" + this.timecode(this.stream.duration) : null}
								</p>
							</div>

							<div className="grid fifth">
								<h2 onClick={this.nextSong} className="heading control">
									Next
								</h2>
								<p className="fore">
									{this.songs[this.state.songIndex + 1] ? this.songs[this.state.songIndex + 1].title: null}
								</p>
							</div>
						</div>

					</div>


				</div>


			</div>
		);
	}

}
