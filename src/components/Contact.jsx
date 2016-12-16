'use strict';

import React from 'react';

require('styles//Contact.scss');

class Contact extends React.Component {
	componentDidMount = () => {
		document.getElementById('gray-box').className = 'full';
	}

  render = () => {
		var path = this.props.location.pathname;
    return (
	      <div id="contact">
					<h2>
						978.729.3655
						<br/>
						<a href="mailto:elliotjberman@gmail.com">elliotjberman_at_gmail.com</a>
					</h2>
					<h1>Contact</h1>
	      </div>
    );
  }
}

Contact.displayName = 'Contact';

// Uncomment properties you need
// Contact.propTypes = {};
// Contact.defaultProps = {};

export default Contact;
