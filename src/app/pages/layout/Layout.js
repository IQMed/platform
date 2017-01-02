import React, {Component, PropTypes} from 'react';

import Header from './Header';

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
  }
  
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}