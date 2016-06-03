require('normalize.css');
// require('fonts/GT-Walsheim-Pro-Trial-Regular.otf')
require('styles/App.scss');

import React, { Component } from 'react';
import THREE from 'three';
import PostProcessing from 'postprocessing';
import Ping from '../audio/text.mp3';
import Track from '../audio/website_demo.mp3';
import Disc from '../images/disc.png';

export default class AppComponent extends Component {

	constructor = () => {
		this.mesh;
		this.renderer;
		this.scene;
		this.camera;
		this.postprocessing;
		this.sphere;
		this.counter;
		this.circle;
		this.particleGroups;

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
			track.play()
			// const backgroundColor = 0x69cffa;
			const backgroundColor = 0x454545;

			this.particleGroups = [];


// Scene and fog
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.FogExp2(backgroundColor , 0.03 );

// Camera
			this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 30 );
			this.camera.position.z = 30;
			this.camera.position.y = 10;
			this.camera.rotation.x = -0.3;

// Lighting
			this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
			let pointLight = new THREE.PointLight(0xffffff, 0.4);
			pointLight.position.set(5, 5, -5);

			pointLight.castShadow = true;
			this.scene.add(pointLight, this.ambientLight);

// Plane
			let planeGeometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);
			let planeMaterial = new THREE.MeshStandardMaterial({
					color: backgroundColor,
					roughness: 1,
					metalness: 0.1
			});


			let plane = new THREE.Mesh( planeGeometry, planeMaterial );
			plane.rotation.x = -1.57;
			plane.rotation.z = Math.PI/4;
			plane.receiveShadow = true;
			this.scene.add(plane);

// Rendering
			this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.orderObjects = false;
			this.renderer.setClearColor( backgroundColor);

	    this.depthRenderTarget = new THREE.WebGLRenderTarget(1, 1, {
	        minFilter: THREE.NearestFilter,
	        magFilter: THREE.NearestFilter,
	        type: THREE.FloatType,
	        format: THREE.RGBAFormat,
	        stencilBuffer: false,
	        transparent: true
	    });




			this.initPostProcessing();

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
			aperture:	0.002,
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

				let x = particleExplosion.particles.position.x;
				let y = particleExplosion.particles.position.y;
				let z = particleExplosion.particles.position.z;

				this.scene.remove(particleExplosion.particles);

				for ( let i = 0; i < 1000; i++ ) {
					// X Position
					particleExplosion.vertices[ i*3 + 0 ] = particleExplosion.vertices[ i*3 + 0 ] + 2*particleExplosion.particleDirections[ i*3 + 0]/particleExplosion.counter;
					// Y Position
					particleExplosion.vertices[ i*3 + 1 ] = particleExplosion.vertices[ i*3 + 1 ] + 2*particleExplosion.particleDirections[ i*3 + 1]/particleExplosion.counter;
					// Z position
					particleExplosion.vertices[ i*3 + 2 ] = particleExplosion.vertices[ i*3 + 2 ] + 2*particleExplosion.particleDirections[ i*3 + 2]/particleExplosion.counter;
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
		this.postprocessing.composer.render();
		requestAnimationFrame( this.animate, this.renderer.domElement );

	}

	componentDidMount = () => {
		this.init();
		this.animate();
		window.addEventListener('click', this.initParticles);

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

			const particleCount = 100 ;
			const xRange = 15;
			const yRange = 7;
			const zRange = 15;

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

			// // itemSize = 3 because there are 3 values (components) per vertex
			let sprite = new THREE.TextureLoader().load( Disc );
			// particleExplosion.particleMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.5})

			particleExplosion.particleMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true } );
			particleExplosion.particleMaterial.color.setHSL( 0.5, 0.5, 0.5 );

			let depthRenderTarget = this.depthRenderTarget.material;
			let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

			particleExplosion.particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( particleExplosion.vertices, 3 ) );


			particleExplosion.particles = new THREE.Points( particleExplosion.particleGeometry, particleExplosion.particleMaterial );

			particleExplosion.particles.position.x = xRange * (Math.random() - 0.5) - 20;
			particleExplosion.particles.position.y = yRange * (Math.random() - 0.5) - 5;
			particleExplosion.particles.position.z = zRange * (Math.random() - 0.5) + 15;

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
