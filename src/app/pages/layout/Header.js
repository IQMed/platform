import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {logout} from '../../reducers/userActions';

class Header extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {activeItem: 1};
    this.handleClick = this.handleClick.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut(event) {
    event.preventDefault();
    const {dispatch} = this.props;
    dispatch(logout());
  }
  
  handleClick(id) {
    return () => {
      this.setState({activeItem: id});
    }; 
  }

  render() {
    const {activeItem} = this.state;
    let version = process.env.npm_package_version;
    if (! version)
      version = require('../../../../package.json').version;
    return (
      <header id='app-header'>
        <h5>IQMED {version}</h5>
        <div celled link horizontal>
          <div active={activeItem == 1} as={Link} to={'/'} onClick={this.handleClick(1)}>Dashboard</div>
          <div active={activeItem == 2} as='a' onClick={this.handleClick(2)}>Setup</div>
          <div active={activeItem == 3} as='a' onClick={this.handleClick(3)}>Input</div>
          <div active={activeItem == 4} as='a' onClick={this.handleClick(4)}>Model</div>
          <div active={activeItem == 5} as='a' onClick={this.handleClick(5)}>Result</div>
        </div>
        <section style={{float:'right'}}>
          <div>
            <div as={Link} to={'/document'}>Documentation</div>
            <div as='a' href="//blog.iqmedinnovation.com">Blog</div>
            <div as='a' onClick={this.handleSignOut}>
              Logout
            </div>
          </div>
        </section>
        <section className='clearfix'></section>
      </header>
    );
  }
}

const mapDispatch = (dispatch) => { return {dispatch}; };

export default connect(null, mapDispatch)(Header);