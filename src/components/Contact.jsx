'use strict';

import React from 'react';
import { Link } from 'react-router';

require('styles//Contact.scss');

class Contact extends React.Component {

	constructor() {
		super();
		this.interval;
	}

	componentDidMount = () => {
		this.props.setGrayscale(true);
		document.getElementById('gray-box').className = 'full';
		document.getElementById('name').style.opacity = 0;
		document.getElementById('name').style.zIndex = 0;

		function adjustCircle() {
			let min = Math.ceil(1);
			let max = Math.floor(5);
			let number = Math.floor(Math.random() * (max - min)) + min;
			let circle = document.getElementById('circle-boy-' + number);

			let randomRadius = Math.random() * 50;

			circle.style.borderRadius = randomRadius + "%";
		}

		window.setTimeout(function() {

			this.interval = window.setInterval(adjustCircle, 7000);

		}, 10000);
	}

	componentWillUnmount = () => {
		window.clearInterval(this.interval);
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
								<a href="mailto:varsitystarmusic@gmail.com"><div id="circle-boy-1"></div></a>
							</div>
						</div>



						<div className="grid fifth">

							<div className="circle-container">
								<a href="tel:+19787293655"><div id="circle-boy-2"></div></a>
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
						<div className="grid fifth"><h2><a href="mailto:varsitystarmusic@gmail.com">Email</a></h2></div>

						<div className="grid fifth"><h2><a href="tel:+19787293655">Call</a></h2></div>

						<div className="grid fifth"><h2><a target="_blank" href="http://www.soundcloud.com/varsitystar">Listen</a></h2></div>

						<div className="grid fifth">
							<h2>Elliot <span className="contrast">Berman</span></h2>

							<p>
								<span className="contrast">is a Brooklyn-based musician currently living in Berlin. </span>
								Hit him up if you're want music for a live show, a movie, a video game, or anything else you can think of.
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
