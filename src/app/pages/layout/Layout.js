import React, {Component, PropTypes} from 'react';

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array])
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}