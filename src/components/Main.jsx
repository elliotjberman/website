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
	}

	init = () => {

			this.scene = new THREE.Scene();

			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
			this.camera.position.z = 5;
			this.camera.position.y = 1;

			let pointLight = new THREE.PointLight(0xffffff);
			pointLight.position.set(0, 5, 0);

			pointLight.castShadow = true;

			this.scene.add(pointLight);


			let geometry = new THREE.BoxGeometry( 1, 1, 1 );
			let material = new THREE.MeshPhongMaterial( { color: 0xff3300, specular: 0x555555, shininess: 5 } );
			this.cube = new THREE.Mesh( geometry, material );
			this.cube.position.y = 1;
			this.scene.add( this.cube );

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

			document.body.appendChild( this.renderer.domElement );

		}

	animate = () => {

		this.cube.rotation.x += 0.01;
		this.cube.rotation.y += 0.01;

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
