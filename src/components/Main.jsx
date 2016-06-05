require('normalize.css');
// require('fonts/GT-Walsheim-Pro-Trial-Regular.otf')
require('styles/App.scss');

import React, { Component } from 'react';
import THREE from 'three';
import Ping1 from '../audio/1.mp3';
import Ping2 from '../audio/2.mp3';
import Ping3 from '../audio/3.mp3';
import Ping4 from '../audio/4.mp3';
import Ping5 from '../audio/5.mp3';
import Ping6 from '../audio/6.mp3';

import Bing1 from '../audio/Bing1.mp3';
import Bing2 from '../audio/Bing2.mp3';
import Bing3 from '../audio/Bing3.mp3';
import Bing4 from '../audio/Bing4.mp3';
import Bing5 from '../audio/Bing5.mp3';
import Bing6 from '../audio/Bing6.mp3';

import Track from '../audio/bass_demo.mp3';
import Disc from '../images/disc_thick.png';

export default class AppComponent extends Component {

	constructor = () => {
		this.mesh;
		this.renderer;
		this.scene;

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
		this.pings;

		//WTF
		this.depthRenderTarget;
	}

	init = () => {
			this.pings = [Bing1, Bing2, Bing3, Bing4, Bing5, Bing6]
			let track = new Audio(Track);
			track.play();

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
			this.renderer.orderObjects = false;
			this.renderer.setClearColor( 0xfff1e7 );

			// this.initPostProcessing();

			window.addEventListener( 'resize', this.onWindowResize, false );
			document.getElementById('index').appendChild( this.renderer.domElement );


		}


	animate = () => {

		for (var i = 0; i < this.particleGroups.length; i++){
			var particleExplosion = this.particleGroups[i];
			particleExplosion.counter += 1;

			let xPosition = particleExplosion.particles.position.x;
			let yPosition = particleExplosion.particles.position.y;
			let zPosition = particleExplosion.particles.position.z;

			let xRotation = particleExplosion.particles.rotation.x;
			let yRotation = particleExplosion.particles.rotation.y;

			this.scene.remove(particleExplosion.particles);

			for ( let i = 0; i < 1000; i++ ) {
				// X Position
				particleExplosion.vertices[ i*3 + 0 ] = particleExplosion.vertices[ i*3 + 0 ] + 4*particleExplosion.particleDirections[ i*3 + 0]/particleExplosion.counter;
				// Y Position
				particleExplosion.vertices[ i*3 + 1 ] = particleExplosion.vertices[ i*3 + 1 ] + 4*particleExplosion.particleDirections[ i*3 + 1]/particleExplosion.counter;
				// Z position
				particleExplosion.vertices[ i*3 + 2 ] = particleExplosion.vertices[ i*3 + 2 ] + 4*particleExplosion.particleDirections[ i*3 + 2]/particleExplosion.counter;
			}

			particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 ) );
			particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );

			particleExplosion.particles.position.x = xPosition - 0.0015;
			particleExplosion.particles.position.y = yPosition - 0.0015;
			particleExplosion.particles.position.z = zPosition + 0.0015;

			particleExplosion.particles.rotation.y = yRotation + 0.0006;
			particleExplosion.particles.rotation.x = xRotation - 0.0006;

			this.scene.add(particleExplosion.particles);

		}

		if (this.ambientLight.intensity < 0.34){
			this.ambientLight.intensity += 0.001;
		}

		this.renderer.render(this.scene, this.camera);
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

		window.onload = function(){
				setTimeout(function(){
					document.getElementById('name').style.width = '550px';
				}, 14800);
		}

	}

	initParticles = (x, y) => {

			var randomZDepth;
			if (!x || !y){
				x = Math.random();
				y = Math.random();
				randomZDepth = Math.random();
			}
			let choice = Math.floor(x*3 + (-y + 1)*3)
			let sound = new Audio(this.pings[choice]);
			randomZDepth = 0.2;
			sound.volume = 0.5 - randomZDepth/1.2;
			sound.play();

		//Particle shit
			var particleExplosion = {}
			particleExplosion.counter = 0;
			particleExplosion.particleGeometry = new THREE.BufferGeometry();

			let aspectRatio = window.innerWidth/window.innerHeight

			const particleCount = 100;
			var xRange = 4 * aspectRatio;
			const yRange = 5;
			const zRange = 25;

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

			particleExplosion.particleMaterial = new THREE.PointsMaterial( { size: 0.9, sizeAttenuation: true, map: this.sprite, alphaTest: 0.2, transparent: true } );
			particleExplosion.particleMaterial.color.setHSL(26/360, 0.9, (Math.random()/2+0.5) );

			particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 ) );


			particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );

			particleExplosion.particles.position.x = xRange * 2 * (x - 0.5) + (x - 0.5) * 40 * randomZDepth * (xRange)/40;
			particleExplosion.particles.position.y = yRange * 2 * (y - 0.5) + (y - 0.5) * randomZDepth * 0.3^y;
			particleExplosion.particles.position.z = -zRange * randomZDepth;

			this.particleGroups.push(particleExplosion);
	}

	onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}


	render() {
    return (
      <div className="index" id="index">
				<div className="name-container">
					<div id="name">
						<h1>Elliot<br/>Berman</h1>
					</div>
				</div>
      </div>
    );
  }

}
