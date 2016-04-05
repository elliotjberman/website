require('normalize.css');
require('styles/App.css');

import React, { Component } from 'react';
import THREE from 'three';

export default class AppComponent extends Component {

	constructor = () => {
		this.mesh;
		this.renderer;
		this.scene;
		this.camera;
		this.particles
	}

	init = () => {

			this.scene = new THREE.Scene();

			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
			this.camera.position.z = 5;
			this.camera.position.y = 1;

			let ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
			let pointLight = new THREE.PointLight(0xffffff, 0.9);
			pointLight.position.set(0, 5, 0);

			pointLight.castShadow = true;

			this.scene.add(pointLight, ambientLight);

			//Particle shit

			let particleGeometry = new THREE.BufferGeometry();
			// create a simple square shape. We duplicate the top left and bottom right
			// vertices because each vertex needs to appear once per triangle.
			let vertexPositions = [
				[-1.0, -1.0,  1.0],
				[ 1.0, -1.0,  1.0],
				[ 1.0,  1.0,  1.0],

				[ 1.0,  1.0,  1.0],
				[-1.0,  1.0,  1.0],
				[-1.0, -1.0,  1.0]
			];

			let vertices = new Float32Array( vertexPositions.length * 3 ); // three components per vertex

			// components of the position vector for each vertex are stored
			// contiguously in the buffer.
			for ( let i = 0; i < vertexPositions.length; i++ ) {
				vertices[ i*3 + 0 ] = vertexPositions[i][0];
				vertices[ i*3 + 1 ] = vertexPositions[i][1];
				vertices[ i*3 + 2 ] = vertexPositions[i][2];
			}

			// itemSize = 3 because there are 3 values (components) per vertex
			particleGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			let particleMaterial = new THREE.PointsMaterial( { color: 0xff0000, size: 0.3 } );
			this.particles = new THREE.Points( particleGeometry, particleMaterial );
			this.particles.position.y = 2;

			this.scene.add( this.particles );

			let planeGeometry = new THREE.PlaneBufferGeometry(4500, 4500, 10, 10);
			let planeMaterial = new THREE.MeshStandardMaterial({
					color: 0xffffff,
					roughness: 0.7,
					metalness: 0.2
			});


			let plane = new THREE.Mesh( planeGeometry, planeMaterial );
			plane.rotation.x = -1.57;
			plane.receiveShadow = true;
			this.scene.add(plane);

			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setClearColor( 0xffffff, 1);
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.shadowMapEnabled = true;
			this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

			document.body.appendChild( this.renderer.domElement );

		}

	animate = () => {

		this.particles.rotation.x += 0.01;
		this.particles.rotation.y += 0.01;

		requestAnimationFrame( this.animate );
		this.renderer.render( this.scene, this.camera );

	}

	componentDidMount = () => {
		this.init();
		this.animate();
	}


	render() {
    return (
      <div className="index">
      </div>
    );
  }
}
