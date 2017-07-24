require('normalize.css');
require('styles/App.scss');

import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class AudioPlayer extends Component {

	constructor(props) {
		super(props);
		this.color = "#c78584";
		this.textColor = "#7f4544";
	}

	componentDidMount = () => {
			// this.props.setGrayscale(true);
			document.getElementById('gray-box').className = 'full';
			document.getElementById('gray-box-container').className = 'containing gray';
			document.getElementById('name').style.opacity = 0;
			document.getElementById('name').style.zIndex = 0;
	}

	render = () => {

		let containerStyle = {background: this.color}
		let textStyle = {color: this.textColor}

		return (
			<div id="audio-container" style={containerStyle}>
				<div className="grid whole">
					<h1 id="audio-header">I'm a <a target="_blank" href="https://www.linkedin.com/in/elliot-berman-48a99411a/" style={textStyle}> programmer</a></h1>
				</div>

				<div className="flexContainer">

					<div id="rows-container">
						<div className="row">
							<div className="grid fifth graphic">
								<div onClick={this.toggleSong} id="triangle-1" className="graphic-square">
									<div className="text">Python</div>
								</div>

							</div>
							<div className="grid fifth graphic">
								<div className="graphic-square">
									<div className="text">Javascript</div>
									<div className="code">
										<br/>
										particleExplosion.particleMaterial = new THREE.PointsMaterial( {"{"} size: 0.65, sizeAttenuation: true, map: this.sprite, alphaTest: 0.3, transparent: true {"}"} );
										particleExplosion.particleMaterial.color.setHSL(this.hue, this.saturation, (Math.random()/2+0.5) );<br/>
										<br/>
										particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 , false) );<br/>
										<br/>
										<br/>
										particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );<br/>
										particleExplosion.frustumCulled = false;<br/>
										<br/>
										particleExplosion.particles.position.x = xRange * 2 * (x - 0.5) + (x - 0.5) * 40 * randomZDepth * (xRange)/40;<br/>
										particleExplosion.particles.position.y = yRange * 2 * (y - 0.5) + (y - 0.5) * randomZDepth * 0.3^y;<br/>
										particleExplosion.particles.position.z = -zRange * randomZDepth;<br/>
										<br/>
										this.particleGroups.push(particleExplosion);<br/>
										this.scene.add(this.particleGroups[this.particleGroups.length-1].particles);<br/>
									</div>
								</div>
							</div>
						</div>


						<div className="row">
							<div className="grid fifth graphic">
								<div className="graphic-square">
								</div>
							</div>
							<div className="grid fifth graphic">
								<div className="graphic-square"></div>
							</div>
						</div>

					</div>


				</div>


			</div>
		);
	}

}
