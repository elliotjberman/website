'use strict';

import React from 'react';
import { Link } from 'react-router';

require('styles//Contact.scss');

class Contact extends React.Component {

	constructor() {
		super();
		this.state = {
			intervalId: null,
			phone: null,
			email: null
		}
	}

	componentDidMount = () => {
		this.props.setGrayscale(true);
		document.getElementById('gray-box-container').className = 'containing gray';
		document.getElementById('gray-box').className = 'full';
		document.getElementById('name').style.opacity = 0;
		document.getElementById('name').style.zIndex = 0;

		let interval = setInterval(this.adjustCircle, 10000);

		this.setState({intervalId: interval});
	}

	componentWillUnmount = () => {
		clearInterval(this.state.intervalId);
	}

	adjustCircle = () => {
		let min = Math.ceil(1);
		let max = Math.floor(4);
		let number = Math.round(Math.random() * (max - min)) + min;
		let circle = document.getElementById('circle-boy-' + number);

		let randomRadius = Math.random() * 50;

		circle.style.borderRadius = randomRadius + "%";
	}

	showPhoneInfo = () => {
		this.setState({phone: '978-729-3655'})
	}

	showEmail = () => {
		this.setState({email: 'varsitystarmusic@gmail.com'})
	}

  render = () => {
		var path = this.props.location.pathname;
    return (
	      <div id="contact">

				<div id="intro" className="whole grid">
					<h1>Contact</h1>
				</div>

				<div className="flexContainer">
					<div className="row"></div>
					<div className="row">
						<div className="grid fifth">

							<div className="circle-container">
								<Link to="choice"><div id="circle-boy-0"></div></Link>
							</div>
						</div>


						<div className="grid fifth">

							<div className="circle-container">
								<a href={"mailto:" + this.state.email}><div id="circle-boy-1"></div></a>
							</div>
						</div>



						<div className="grid fifth">

							<div className="circle-container">
								<a href={"+tel:" + this.state.phone}><div id="circle-boy-2"></div></a>
							</div>

						</div>

						<div className="grid fifth">

							<div className="circle-container">
								<a target="_blank" href="http://www.soundcloud.com/varsity-star"><div id="circle-boy-3"></div></a>
							</div>

						</div>


						<div className="grid fifth">

							<div className="circle-container">
								<div id="circle-boy-4"></div>
							</div>
						</div>

					</div>

					<div className="row">
						<div className="grid fifth"><p></p></div>
						<div className="grid fifth">
							<h2 onMouseEnter={this.showEmail}><a href={"mailto:" + this.state.email}>Email {this.state.email}</a></h2>
							{/* <p><a className="contrast" href={"mailto:" + this.state.email}>{this.state.email}</a></p> */}
						</div>

						<div className="grid fifth">
							<h2 onMouseEnter={this.showPhoneInfo}>
								<a href={"+tel:" + this.state.phone}>Call {this.state.phone}</a>
							</h2>
						</div>

						<div className="grid fifth"><h2><a target="_blank" href="http://www.soundcloud.com/varsity-star">Listen</a></h2></div>

						<div className="grid fifth">
							<h2 className="contrast">Elliot Berman</h2>

							<p>
								<span className="contrast">is a Brooklyn-based musician currently living in Berlin. </span>
								Hit him up if you're want music for a live show, movie, video game, or anything else you can think of.
							</p>
						</div>
					</div>

				</div>

    </div>
    );
  }
}

Contact.displayName = 'Contact';

// Uncomment properties you need
// Contact.propTypes = {};
// Contact.defaultProps = {};

export default Contact;
