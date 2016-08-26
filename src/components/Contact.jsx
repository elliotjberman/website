'use strict';

import React from 'react';

require('styles//Contact.scss');

class Contact extends React.Component {
  render() {
    return (
      <div id="contact">
				<h2>
					978.729.3655
					<br/>
					elliotjberman (at) gmail.com
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
