require('styles/Radial.scss')

import React, { Component } from 'react';

export default class Radial extends Component {

	constructor(props) {
		super(props);
	}

	render = () => {
		return	(
			<div className="radial-progress" data-progress={this.props.progress}>
				<div className="circle">
					<div className="mask full">
						<div className="fill"></div>
					</div>
					<div className="mask half">
						<div className="fill"></div>
						<div className="fill fix"></div>
					</div>
				</div>
				<div className="inset">
					{this.props.children}
				</div>
			</div>
		)
	}

}
