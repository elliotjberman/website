require('normalize.css');
require('styles/App.scss');

// Three.js + Postprocessing
import THREE from 'three';
var EffectComposer = require('three-effectcomposer')(THREE)
import RGBShiftShader from '../shaders/RGBShiftShader.js';

import React, { Component } from 'react';

import GrayBox from './GrayBox';

// Audio
import StreamTeam from '../streamteam/index.js';

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

	constructor = () => {
		this.mesh;
		this.renderer;
		this.scene;

		this.composer;

		// Camera scrim
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		this.camera;

		// Particles
		this.counter;
		this.particleGroups;
		this.sprite;

		this.ambientLight;

		// Sounds
		this.track;
		this.bings;

		this.stream
	}

	init = () => {
			this.stream  = new StreamTeam({
				url: "https://s3.amazonaws.com/elliot-berman-media/bass_demo_3.mp3",
				chunkSize: 200, // size of chunks to stream in (in seconds)
				bitRate: 40000
			})
			this.stream.setStartTime(14);
			this.stream.play();

			this.pings = [];
			this.pings.push([Bing0_0, Bing0_1, Bing0_2, Bing0_3]);
			this.pings.push([Bing1_0, Bing1_1, Bing1_2, Bing1_3]);
			this.pings.push([Bing2_0, Bing2_1, Bing2_2, Bing2_3]);

			const white = 0xffffff;

			this.sprite = new THREE.TextureLoader().load( Disc );

			this.particleGroups = [];


// Scene and fog
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.FogExp2(white , 0.06 );

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
			this.renderer.setClearColor( 0xfff1e7 );

			window.addEventListener( 'resize', this.onWindowResize, false );
			document.getElementById('index').appendChild( this.renderer.domElement );

	//Postprocessing
			this.initPostprocessing();

		}


	animate = () => {

		let frequencyArray = this.stream.getFrequencies();
		let bump = (frequencyArray[2] + frequencyArray[3])/2;
		let grimeAdd = -(0.85 - bump/255);
		grimeAdd = grimeAdd < 0 ? 0 : grimeAdd;

		this.addGrimeLevel(grimeAdd);


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

			particleExplosion.particleGeometry.attributes.position.needsUpdate = true;
		}



		if (this.ambientLight.intensity < 0.34){
			this.ambientLight.intensity += 0.001;
		}
		// this.renderer.render(this.scene, this.camera);
		this.composer.render(this.scene, this.camera);
		requestAnimationFrame( this.animate, this.renderer.domElement );

	}

	componentDidMount = () => {
		this.init();
		this.animate();
		var initParticles = this.initParticles;
		window.addEventListener('click', function(event) {
			let mouseX = event.pageX/window.innerWidth;
			let mouseY = 1 - event.pageY/window.innerHeight;
			initParticles(mouseX, mouseY);
		});

		window.setInterval(function(){
			initParticles();
		}, 5000)

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
			let xChoice = Math.floor(x * 4);
			let yChoice = Math.floor(y* 3)
			let sound = new Audio(this.pings[yChoice][xChoice]);
			sound.volume = 0.5 - randomZDepth*0.45;
			sound.play();

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

			particleExplosion.particleMaterial = new THREE.PointsMaterial( { size: 0.6, sizeAttenuation: true, map: this.sprite, alphaTest: 0.3, transparent: true } );
			particleExplosion.particleMaterial.color.setHSL(26/360, 0.9, (Math.random()/2+0.5) );

			particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 , false) );


			particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );
			particleExplosion.frustumCulled = false;

			particleExplosion.particles.position.x = xRange * 2 * (x - 0.5) + (x - 0.5) * 40 * randomZDepth * (xRange)/40;
			particleExplosion.particles.position.y = yRange * 2 * (y - 0.5) + (y - 0.5) * randomZDepth * 0.3^y;
			particleExplosion.particles.position.z = -zRange * randomZDepth;

			this.particleGroups.push(particleExplosion);
			this.scene.add(this.particleGroups[this.particleGroups.length-1].particles);
			// this.addGrimeLevel(0.0005);
	}

	addGrimeLevel = (level) => {
		if (!isNaN(level) && this.composer.passes[1].uniforms.amount.value != undefined){
			this.composer.passes[1].uniforms.amount.value = level/25;
		}
	}

	onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.initPostprocessing();
	}

	initPostprocessing = () => {
		var amount = 0.0;
		if (this.composer) {
			amount = this.composer.passes[1].uniforms.amount.value;
		}
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new EffectComposer.RenderPass(this.scene, this.camera));

		var effect = new EffectComposer.ShaderPass( THREE.RGBShiftShader );
		effect.uniforms['amount'].value = amount;
		effect.renderToScreen = true;
		this.composer.addPass( effect );
	}


	render = () => {
    return (
      <div className="index" id="index">
				<GrayBox />
      </div>
    );
  }

}
