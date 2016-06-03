require('normalize.css');
// require('fonts/GT-Walsheim-Pro-Trial-Regular.otf')
require('styles/App.scss');

import React, { Component } from 'react';
import THREE from 'three';
import PostProcessing from 'postprocessing';
import Ping from '../audio/text.mp3';
import Track from '../audio/website_demo.mp3';
import Disc from '../images/disc2.png';

export default class AppComponent extends Component {

	constructor = () => {
		this.mesh;
		this.renderer;
		this.scene;

		// Camera scrim
		this.mouseX = 0;
		this.mouseY = 0;
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		this.camera;

		// Particles
		this.counter;
		this.particleGroups;
		this.sprite;
		this.randomColor;

		this.ambientLight;

		this.wall;

		// Sounds
		this.track;
		this.ping;

		//WTF
		this.depthRenderTarget;
	}

	init = () => {
			let track = new Audio(Track);
			// track.play()

			const white = 0xffffff;

			this.sprite = new THREE.TextureLoader().load( Disc );

			let colors = [{particleColor: 26/360, backgroundColor: 0xfff1e7}, {particleColor: 202/360, backgroundColor: 0xccebfc}, {particleColor: 148/360, backgroundColor: 0xf1fdf7}]
			let randomChoice = Math.floor(Math.random()*3)
			this.randomColor = colors[randomChoice]

			this.particleGroups = [];


// Scene and fog
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.FogExp2(white , 0.06 );

// Camera
			this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 30 );
			this.camera.position.z = 30;
			this.camera.position.y = 5;

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
			this.renderer.setClearColor( this.randomColor.backgroundColor );

			// this.initPostProcessing();

			window.addEventListener( 'resize', this.onWindowResize, false );
			document.getElementById('index').appendChild( this.renderer.domElement );


		}

	initPostProcessing = () => {
		this.postprocessing = {};

		let composer = new PostProcessing.EffectComposer( this.renderer );
		let renderPass = new PostProcessing.RenderPass(this.scene, this.camera, {depth: true});
		composer.addPass(renderPass);

		let bokehPass = new PostProcessing.BokehPass( renderPass.depthTexture, {
			focus: 	 1,
			aperture:	0.0,
			maxblur:	1.0,
			width: window.innerWidth,
			height: window.innerHeight

		} );
		bokehPass.renderToScreen = true;

		composer.addPass( bokehPass );
		this.postprocessing.composer = composer;
		this.postprocessing.bokeh = bokehPass;

	}


	animate = () => {

		for (var i = 0; i < this.particleGroups.length; i++){
			var particleExplosion = this.particleGroups[i];
			if (false){
				this.scene.remove(particleExplosion.particles);
				this.particleGroups.splice(i, 1)
			}
			else{
				particleExplosion.counter += 1;

				let xPosition = particleExplosion.particles.position.x;
				let yPosition = particleExplosion.particles.position.y;
				let zPosition = particleExplosion.particles.position.z;

				let xRotation = particleExplosion.particles.rotation.x;
				let yRotation = particleExplosion.particles.rotation.y;
				let zRotation = particleExplosion.particles.rotation.z;

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

				particleExplosion.particles.rotation.y = yRotation + 0.0005;
				particleExplosion.particles.rotation.x = xRotation - 0.0005;

				this.scene.add(particleExplosion.particles);
			}

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
		window.addEventListener('click', this.initParticles);
		window.addEventListener( 'mousemove', this.onDocumentMouseMove, false );

		window.onload = function(){
				setTimeout(function(){
					document.getElementById('name').style.width = '550px';
				}, 14050);
		}

	}

	initParticles = () => {
			this.ping = new Audio(Ping);
			this.ping.volume = 0.15;
			this.ping.play();

		//Particle shit
			var particleExplosion = {}
			particleExplosion.counter = 0;
			particleExplosion.particleGeometry = new THREE.BufferGeometry();

			const particleCount = 250 ;
			const xRange = 10;
			const yRange = 5;
			const zRange = 10;

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
			// particleExplosion.particleMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.5})

			particleExplosion.particleMaterial = new THREE.PointsMaterial( { size: 0.5, sizeAttenuation: true, map: this.sprite, alphaTest: 0.2, transparent: true } );
			particleExplosion.particleMaterial.color.setHSL(this.randomColor.particleColor, 0.9, (Math.random()/2+0.5) );

			// let depthRenderTarget = this.depthRenderTarget.material;
			let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

			particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 ) );


			particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );

			particleExplosion.particles.position.x = xRange * (Math.random() - 0.5);
			particleExplosion.particles.position.y = yRange * (Math.random() - 0.5) + 5;
			particleExplosion.particles.position.z = zRange * (Math.random() - 0.5) + 15;

			this.particleGroups.push(particleExplosion);
	}

	onWindowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

	onDocumentMouseMove = ( event ) => {
		this.mouseX = event.clientX - this.windowHalfX;
		this.mouseY = event.clientY - this.windowHalfY;
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
