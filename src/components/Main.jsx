// Three.js + Postprocessing
import THREE from 'three';
var EffectComposer = require('three-effectcomposer')(THREE)
import RGBShiftShader from '../shaders/RGBShiftShader.js';
import Film from '../shaders/Film.js'
import FXAA from '../shaders/FXAA.js';

import React, { Component } from 'react';
import Link from 'react-router';

import GrayBox from './GrayBox';

// Audio
import StreamTeam from 'streamteam';

import Track from '../audio/bass_demo_3.mp3';

import Bing0_0 from '../audio/bing0_0.mp3';
import Bing0_1 from '../audio/bing0_1.mp3';
import Bing0_2 from '../audio/bing0_2.mp3';
import Bing0_3 from '../audio/bing0_3.mp3';

import Bing1_0 from '../audio/bing1_0.mp3';
import Bing1_1 from '../audio/bing1_1.mp3';
import Bing1_2 from '../audio/bing1_2.mp3';
import Bing1_3 from '../audio/bing1_3.mp3';

import Bing2_0 from '../audio/bing2_0.mp3';
import Bing2_1 from '../audio/bing2_1.mp3';
import Bing2_2 from '../audio/bing2_2.mp3';
import Bing2_3 from '../audio/bing2_3.mp3';

import Disc from '../images/disc_thick.png';

export default class AppComponent extends Component {

	constructor () {
		super();
		this.mesh;
		this.renderer;
		this.scene;

		this.composer;
		this.grayscale;
		this.hue = 26/360;
		this.saturation = 0.9;

		// Camera scrim
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		this.camera;

		// Utility
		this.clickCounter = 0;

		// Particles
		this.counter;
		this.particleGroups;
		this.sprite;

		this.ambientLight;

		// Sounds
		this.track;
		this.bings;
		// this.state.pingsOn;

		this.stream;

		this.state = {
			audioOn: true
		};

	}

	init = () => {
			this.stream  = new StreamTeam({
				url: "https://s3.amazonaws.com/elliot-berman-media/bass_demo_3.mp3",
				chunkSize: 79, // size of chunks to stream in (in seconds)
				bitRate: 40000,
				fftSize: 2048
			})

			if (this.state.audioOn) {
				this.stream.gainNode.gain.value = -0.5;
				this.stream.play();
				this.stream.setStartTime(0);
			}

			this.pings = [];
			this.pings.push([Bing0_0, Bing0_1, Bing0_2, Bing0_3]);
			this.pings.push([Bing1_0, Bing1_1, Bing1_2, Bing1_3]);
			this.pings.push([Bing2_0, Bing2_1, Bing2_2, Bing2_3]);

			const white = 0xffffff;

			this.sprite = new THREE.TextureLoader().load( Disc );

			this.particleGroups = [];

// Scene and fog
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.FogExp2(white, 0.05 );

// Camera
			this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 30 );
			this.camera.position.z = 7;
			this.camera.position.y = 0;

// Lighting
			this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
			let pointLight = new THREE.PointLight(0xffffff, 0.8);
			pointLight.position.set(5, 5, -5);

			pointLight.castShadow = true;
			this.scene.add(pointLight, this.ambientLight);

// Rendering
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			// this.renderer.setClearColor( 0xfff1e7 );
			this.renderer.setClearColor( 0xfbe1c4);

			window.addEventListener( 'resize', this.onWindowResize, false );
			document.getElementById('index').appendChild( this.renderer.domElement );

	//Postprocessing
			this.initPostprocessing();

		}


	animate = () => {

		// frequencyArray should be of length
		let frequencyArray = this.stream.getFrequencies();
		let bump = (frequencyArray[2] + frequencyArray[3])/2;
		let grimeLevel = -(0.85 - bump/255);
		grimeLevel = grimeLevel < 0 ? 0 : grimeLevel;


		let grayBox = document.getElementById('gray-box');
		if (bump > 240 && !grayBox.className){
			grayBox.className = 'solo-name';
		}
		this.addGrimeLevel(grimeLevel);


		this.composer.passes[1].uniforms['time'].value += 1/60;
		if (this.grayscale && this.composer.passes[1].uniforms['grayscaleIntensity'].value < 1.1){
			this.composer.passes[1].uniforms['grayscaleIntensity'].value += 0.015;
		}
		else if (!this.grayscale && this.composer.passes[1].uniforms['grayscaleIntensity'].value > 0){
			this.composer.passes[1].uniforms['grayscaleIntensity'].value -= 0.015	;
		}

		if (this.particleGroups.length > 50){
			this.scene.remove(this.particleGroups[0].particles)
			this.particleGroups.shift();
		}
		for (var i = 0; i < this.particleGroups.length; i++){
			var particleExplosion = this.particleGroups[i];
			particleExplosion.counter += 1;
			let xPosition = particleExplosion.particles.position.x;
			let yPosition = particleExplosion.particles.position.y;
			let zPosition = particleExplosion.particles.position.z;

			let xRotation = particleExplosion.particles.rotation.x;
			let yRotation = particleExplosion.particles.rotation.y;

			for ( let i = 0; i < 1000; i++ ) {
				// X Position
				particleExplosion.vertices[ i*3 + 0 ] = particleExplosion.vertices[ i*3 + 0 ] + 4*particleExplosion.particleDirections[ i*3 + 0]/particleExplosion.counter;
				// Y Position
				particleExplosion.vertices[ i*3 + 1 ] = particleExplosion.vertices[ i*3 + 1 ] + 4*particleExplosion.particleDirections[ i*3 + 1]/particleExplosion.counter;
				// Z position
				particleExplosion.vertices[ i*3 + 2 ] = particleExplosion.vertices[ i*3 + 2 ] + 4*particleExplosion.particleDirections[ i*3 + 2]/particleExplosion.counter;
			}

			particleExplosion.particles.position.x = xPosition - 0.0015;
			particleExplosion.particles.position.y = yPosition - 0.0015;
			particleExplosion.particles.position.z = zPosition + 0.0015;

			particleExplosion.particles.rotation.y = yRotation + 0.0006;
			particleExplosion.particles.rotation.x = xRotation - 0.0006;

			// Adjust colors
			let pColor = particleExplosion.particleMaterial.color.getHSL();
			let cColor = this.renderer.getClearColor().getHSL();


				// Hue
				if (pColor.h > this.hue) {
						pColor.h -= 1/360;
				}
				else if (pColor.h < this.hue) {
					pColor.h += 1/360;
				}

				if (cColor.h > this.hue) {
					cColor.h -= 1/360;
				}
				else if (cColor.h < this.hue) {
					cColor.h += 1/360;
				}

				// Saturation
				if (pColor.s > this.saturation) {
						pColor.s -= 0.05;
				}
				else if (pColor.s < this.saturation) {
					pColor.s += 0.05;
				}

				if (cColor.s > this.saturation) {
					cColor.s -= 0.05;
				}
				else if (cColor.s < this.saturation) {
					cColor.s += 0.05;
				}

				var clear = new THREE.Color();
				clear.setHSL(cColor.h, cColor.s, cColor.l);

				this.renderer.setClearColor(clear);
				particleExplosion.particleMaterial.color.setHSL(pColor.h, pColor.s, pColor.l);


			particleExplosion.particleGeometry.attributes.position.needsUpdate = true;
		}



		if (this.ambientLight.intensity < 0.34){
			this.ambientLight.intensity += 0.001;
		}

		if (!this.state.audioOn){
			this.stream.pause();
		}


		// this.renderer.render(this.scene, this.camera);
		this.composer.render(this.scene, this.camera);
		requestAnimationFrame( this.animate, this.renderer.domElement );

	}

	componentDidMount = () => {
		this.init();
		this.animate();
		var initParticles = this.initParticles;
		window.setInterval(function(){
			initParticles();
		}, 5000)

	}

	clickPing = (event) => {
		this.clickCounter++;
		let grayBox = document.getElementById('gray-box');
		if (this.clickCounter > 1  && !grayBox.className) {
			grayBox.className = 'solo-name';
			// this.hue = 100/360;
		}


		let mouseX = event.pageX/window.innerWidth;
		let mouseY = 1 - event.pageY/window.innerHeight;
		this.initParticles(mouseX, mouseY);
	}

	initParticles = (x, y) => {

			var randomZDepth;
			if (!x || !y){
				x = Math.random();
				y = Math.random();
				randomZDepth = Math.random();
			}
			else{
				randomZDepth = 0.2;
			}

			if (this.state.audioOn){
				let xChoice = Math.floor(x * 4);
				let yChoice = Math.floor(y* 3);
				let sound = new Audio(this.pings[yChoice][xChoice]);
				sound.volume = 0.3 - randomZDepth*0.2;
				// sound.volume = 0;
				sound.play();
			}

		//Particle shit
			var particleExplosion = {}
			particleExplosion.counter = 0;
			particleExplosion.particleGeometry = new THREE.BufferGeometry();

			let aspectRatio = window.innerWidth/window.innerHeight

			const particleCount = 100;
			var xRange = 4 * aspectRatio;
			const yRange = 5;
			const zRange = 20;

			particleExplosion.vertices = new Float32Array( particleCount * 3 );

			particleExplosion.particleDirections = [];

			for ( let i = 0; i < particleCount; i++ ) {

				// X Position
				particleExplosion.vertices[ i*3 + 0 ] = 0;
				// Y Position
				particleExplosion.vertices[ i*3 + 1 ] = 0;
				// Z Position
				particleExplosion.vertices[ i*3 + 2 ] = 0;



				particleExplosion.particleDirections[ i*3 + 0 ] = (Math.random() - 0.5)/5;
				particleExplosion.particleDirections[ i*3 + 1 ] = (Math.random() - 0.5)/5;
				particleExplosion.particleDirections[ i*3 + 2 ] = (Math.random() - 0.5)/5;
			}

			// // itemSize = 3 because there are 3 values (components) per vertex

			particleExplosion.particleMaterial = new THREE.PointsMaterial( { size: 0.65, sizeAttenuation: true, map: this.sprite, alphaTest: 0.3, transparent: true } );
			particleExplosion.particleMaterial.color.setHSL(this.hue, this.saturation, (Math.random()/2+0.5) );

			particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 , false) );


			particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );
			particleExplosion.frustumCulled = false;

			particleExplosion.particles.position.x = xRange * 2 * (x - 0.5) + (x - 0.5) * 40 * randomZDepth * (xRange)/40;
			particleExplosion.particles.position.y = yRange * 2 * (y - 0.5) + (y - 0.5) * randomZDepth * 0.3^y;
			particleExplosion.particles.position.z = -zRange * randomZDepth;

			this.particleGroups.push(particleExplosion);
			this.scene.add(this.particleGroups[this.particleGroups.length-1].particles);
	}

	addGrimeLevel = (level) => {
		if (!isNaN(level) && this.composer.passes[2].uniforms.amount.value != undefined){
			this.composer.passes[2].uniforms['amount'].value = level/30 + 0.0015;
			this.composer.passes[1].uniforms['noiseIntensity'].value = level/2 + 0.3;
			this.composer.passes[1].uniforms['scanlineIntensity'].value = level * 1.5 + 0.05;
		}
	}

	onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.initPostprocessing();
	}

	initPostprocessing = () => {
		var amount = 0.003;
		var grayscaleIntensity = 0.0
		if (this.composer) {
			amount = this.composer.passes[2].uniforms.amount.value;
			grayscaleIntensity = this.composer.passes[1].uniforms['grayscaleIntensity'].value;

		}
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new EffectComposer.RenderPass(this.scene, this.camera));

		let film = new EffectComposer.ShaderPass( THREE.Film );

		film.uniforms['noiseIntensity'].value = 0.5;
		film.uniforms['grayscaleIntensity'].value = grayscaleIntensity;

		film.uniforms['scanlineIntensity'].value = 0.2;
		film.uniforms['scanlineCount'].value = window.innerHeight*8.5;

		this.composer.addPass( film );

		let effect = new EffectComposer.ShaderPass( THREE.RGBShiftShader );
		effect.uniforms['amount'].value = amount;
		this.composer.addPass( effect );


		let dpr = 1;
		if (window.devicePixelRatio !== undefined) {
		  dpr = window.devicePixelRatio;
		}

		let fxaa = new EffectComposer.ShaderPass( THREE.FXAAShader );
		fxaa.uniforms.resolution.value = new THREE.Vector2(1/(window.innerWidth*dpr), 1/(window.innerHeight*dpr));
		fxaa.renderToScreen = true;
		this.composer.addPass( fxaa );
		// this.composer.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
	}

	toggleAudio = () => {
		this.setState({audioOn: !this.state.audioOn});
		if (this.stream.paused) {
			this.stream.gainNode.gain.value = -1;
			this.stream.play();
			this.fadeStream();
		}
	}

	fadeStream = () => {
		this.stream.gainNode.gain.value += 0.005;
		if (this.stream.gainNode.gain.value >=-0.5)
			return
		requestAnimationFrame(this.fadeStream);
	}

	stopStreams = (callback) => {
		this.setState({audioOn: false});
		this.stream.pause();
		return callback;
	}
	setGrayscale = (grayscale) => {
		this.grayscale = grayscale;
	}
	setGrayscale = (grayscale) => {
		this.grayscale = grayscale;
	}

	setColor = (hue, saturation) => {
		this.hue = hue;
		this.saturation = saturation;
	}


	render = () => {
		const childrenWithProps = React.Children.map(this.props.children,
		 (child) => React.cloneElement(child, {
			 stopStreams: this.stopStreams,
			 setGrayscale: this.setGrayscale,
			 setColor: this.setColor,
 			 audioOn: this.state.audioOn,
			 toggleAudio: this.toggleAudio
		 })
	 	)
    return (
      <div onClick={this.clickPing} className="index" id="index">
					{/*<span id="audio-toggle" onClick={this.toggleAudio}>
						{this.state.audioOn ? "On" :  "Off"}
					</span> */}
					{childrenWithProps}
      </div>
    );
  }

}
