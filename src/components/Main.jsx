require('normalize.css');
require('styles/App.scss');

import React, { Component } from 'react';
import THREE from 'three';
import PostProcessing from 'postprocessing';
import Ping from '../audio/text.mp3';
import Track from '../audio/homage.mp3'


export default class AppComponent extends Component {

	constructor = () => {
		this.mesh;
		this.renderer;
		this.scene;
		this.camera;
		this.postprocessing;
		this.sphere;
		this.clock;
		this.counter;
		this.circle;
		this.particleGroups;

		this.ambientLight;

		this.wall;

		// Sounds
		this.track;
		this.ping
	}

	init = () => {
			const backgroundColor = 0x69cffa;

			this.track = new Audio(Track);
			this.track.play();

			this.particleGroups = [];


// Scene and fog
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.FogExp2(backgroundColor , 0.02 );

// Camera
			this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 65 );
			this.camera.position.z = 30;
			this.camera.position.y = 10;
			this.camera.rotation.x = -0.3;

// Lighting
			this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
			let pointLight = new THREE.PointLight(0xffffff, 0.8);
			pointLight.position.set(5, 5, -5);

			pointLight.castShadow = true;
			this.scene.add(pointLight, this.ambientLight);

// Circle
			let circleGeometry = new THREE.CircleGeometry( 5, 128);
			var circleMaterial = new THREE.MeshPhongMaterial({
				color: 0x000000,
				emissive: 0x000000,
				specular: 0x555555,
  			shininess: 100
			});

			this.circle = new THREE.Mesh(circleGeometry, circleMaterial)
			this.circle.rotation.x = -1.57;
			this.circle.position.y = 0.004;

			this.scene.add(this.circle);

// Plane
			let planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
			let planeMaterial = new THREE.MeshStandardMaterial({
					color: backgroundColor,
					roughness: 0.7,
					metalness: 0.2
			});


			let plane = new THREE.Mesh( planeGeometry, planeMaterial );
			plane.rotation.x = -1.57;
			plane.receiveShadow = true;
			this.scene.add(plane);

// Back Wall
			this.wall = new THREE.Mesh( planeGeometry, planeMaterial );
			this.wall.rotation.x = Math.PI/4;
			this.wall.receiveShadow = true;
			this.wall.position.z = -40;
			this.scene.add(this.wall);

// Rendering
			this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.orderObjects = false;
			this.renderer.setClearColor( 0xffffff, 0.1);

			this.initPostProcessing();

			window.addEventListener( 'resize', this.onWindowResize, false );
			document.getElementById('index').appendChild( this.renderer.domElement );


		}

	initPostProcessing = () => {
		this.clock = new THREE.Clock()
		this.postprocessing = {};

		let composer = new PostProcessing.EffectComposer( this.renderer );
		let renderPass = new PostProcessing.RenderPass(this.scene, this.camera, {depth: true});
		composer.addPass(renderPass);

		let bokehPass = new PostProcessing.BokehPass( renderPass.depthTexture, {
			focus: 	 1.0,
			aperture:	0.0075,
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

		let delta = this.clock.getDelta()
		const circleScale = 0.005;

		for (var i = 0; i < this.particleGroups.length; i++){
			var particleExplosion = this.particleGroups[i];
			if (particleExplosion.counter >= 300){
				this.scene.remove(particleExplosion.particles);
				this.particleGroups.splice(i, 1)
			}
			else{
				particleExplosion.counter += 1;

				let x = particleExplosion.particles.position.x;
				let y = particleExplosion.particles.position.y;
				let z = particleExplosion.particles.position.z;

				this.scene.remove(particleExplosion.particles);

				for ( let i = 0; i < 1000; i++ ) {
					// X Position
					particleExplosion.vertices[ i*3 + 0 ] = particleExplosion.vertices[ i*3 + 0 ] + 20*particleExplosion.particleDirections[ i*3 + 0]/particleExplosion.counter;
					// Y Position
					particleExplosion.vertices[ i*3 + 1 ] = particleExplosion.vertices[ i*3 + 1 ] + 20*particleExplosion.particleDirections[ i*3 + 1]/particleExplosion.counter - particleExplosion.counter/1000;
					// Z Position
					particleExplosion.vertices[ i*3 + 2 ] = particleExplosion.vertices[ i*3 + 2 ] + 20*particleExplosion.particleDirections[ i*3 + 2]/particleExplosion.counter;
				}

				particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 ) );
				particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );

				particleExplosion.particles.position.x = x;
				particleExplosion.particles.position.y = y;
				particleExplosion.particles.position.z = z;
				particleExplosion.particles.castShadow = true;

				this.scene.add(particleExplosion.particles);
			}

		}

		if (this.camera.rotation.x < 0.3){
			this.camera.rotation.x += 0.0001;
		}
		if (this.ambientLight.intensity < 0.34){
			this.ambientLight.intensity += 0.001;
		}
		this.circle.scale.x += circleScale;
		this.circle.scale.y += circleScale;
		this.postprocessing.composer.render( delta );
		requestAnimationFrame( this.animate, this.renderer.domElement );

	}

	componentDidMount = () => {
		this.init();
		this.initParticles();
		this.animate();
		window.addEventListener('click', this.initParticles);

		window.onload = function(){
				setTimeout(function(){
					document.getElementById('name').style.width = '600px';
				}, 32300);

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

			const particleCount = 1000 ;
			const xRange = 40;
			const yRange = 10;
			const zRange = 27;

			particleExplosion.vertices = new Float32Array( particleCount * 3 );

			particleExplosion.particleDirections = [];

			for ( let i = 0; i < particleCount; i++ ) {

				// X Position
				particleExplosion.vertices[ i*3 + 0 ] = 20;
				// Y Position
				particleExplosion.vertices[ i*3 + 1 ] = 12;
				// Z Position
				particleExplosion.vertices[ i*3 + 2 ] = 0;



				particleExplosion.particleDirections[ i*3 + 0 ] = (Math.random() - 0.5)/5;
				particleExplosion.particleDirections[ i*3 + 1 ] = (Math.random() - 0.5)/5;
				particleExplosion.particleDirections[ i*3 + 2 ] = (Math.random() - 0.5)/5;
			}

			// itemSize = 3 because there are 3 values (components) per vertex
			particleExplosion.particleMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.035})
			particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 ) );


			particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );

			particleExplosion.particles.position.x = xRange * (Math.random() - 1);
			particleExplosion.particles.position.y = yRange * (Math.random() - 1);
			particleExplosion.particles.position.z = zRange * (Math.random());

			particleExplosion.particles.castShadow = true;
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
						<h1>Elliot</h1>
						<h1>Berman</h1>
					</div>
				</div>
      </div>
    );
  }

}
