'use strict';

import React from 'react';

require('styles//Contact.scss');

class Contact extends React.Component {
	componentDidMount = () => {
		this.props.setGrayscale(true);
		document.getElementById('gray-box').className = 'full';
		document.getElementById('name').style.display = 'none';

		function adjustCircle() {
			let min = Math.ceil(1);
			let max = Math.floor(5);
			let number = Math.floor(Math.random() * (max - min)) + min;
			let circle = document.getElementById('circle-boy-' + number);

			let randomRadius = Math.random() * 50;

			circle.style.borderRadius = randomRadius + "%";
		}

		window.setTimeout(function() {

			window.setInterval(adjustCircle, 7000);

		}, 10000);
	}

  render = () => {
		var path = this.props.location.pathname;
    return (
	      <div id="contact">

					<div id="intro" className="whole grid">
						<h1>Contact</h1>
					</div>

					<div className="grid fifth">

						<div className="circle-container">
							<div id="circle-boy-0"></div>
						</div>




					</div>
					<div className="grid fifth">

						<div className="circle-container">
							<div id="circle-boy-1"></div>
						</div>


						<h2>Email</h2>

					</div>
					<div className="grid fifth">

						<div className="circle-container">
							<div id="circle-boy-2"></div>
						</div>


						<h2>Call</h2>

					</div>
					<div className="grid fifth">

						<div className="circle-container">
							<div id="circle-boy-3"></div>
						</div>


						<h2>Listen</h2>

					</div>
					<div className="grid fifth">

						<div className="circle-container">
							<div id="circle-boy-4"></div>
						</div>


						<h2>Elliot <span className="contrast">Berman</span></h2>
						<p>
							<span className="contrast">is a Brooklyn-based musician currently living in Berlin. </span>
							Hit him up if you're want music for a live show, a movie, a video game, or anything else you can think of.
						</p>

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
