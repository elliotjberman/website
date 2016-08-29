'use strict';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

require('styles//Contact.scss');

class Contact extends React.Component {
  render() {
    return (
			<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
	      <div id="contact">
					<h2>
						978.729.3655
						<br/>
						<a href="mailto:elliotjberman@gmail.com">elliotjberman_at_gmail.com</a>
					</h2>
					<h1>Contact</h1>
	      </div>
			</ReactCSSTransitionGroup>
    );
  }
}

Contact.displayName = 'Contact';

// Uncomment properties you need
// Contact.propTypes = {};
// Contact.defaultProps = {};

export default Contact;
