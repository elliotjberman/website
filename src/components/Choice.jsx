require('normalize.css');
require('styles/App.scss');
require('styles/Choice.scss')

import React, { Component } from 'react';

export default class AppComponent extends Component {

	render() {
    return (
      <div id="choices">
				<div className="choice">VS</div>
				<div className="choice">EB</div>
      </div>
    );
  }

}
