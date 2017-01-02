import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {replace} from 'react-router-redux';
import {Grid, Form, Message, Button, Icon, Image} from 'semantic-ui-react';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

import {login, logout} from '../../reducers/userActions';

class Login extends Component {
  
  static propTypes = {
    isFetch:  PropTypes.bool,
    location: PropTypes.object,
    userInfo: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    localMsg: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
  }

  state = {invalidEmail: false, invalidPassword: false}

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    require.ensure(['./Sound'], (require) => {
      const {playSmallBox} = require('./Sound');
      playSmallBox();
    });
  }

  handleLogout(event) {
    event.preventDefault();
    const {dispatch} = this.props;
    dispatch(logout());
  }

  handleSubmit(event, { formData }) {
    event.preventDefault();

    const {email, password, noExpire} = formData;
    const {dispatch, location} = this.props;
    
    if (!email) {
      this.setState({invalidEmail: true});
      return;
    }
    if (!password) {
      this.setState({invalidPassword: true});
      return;
    }
    dispatch(login(email, password, noExpire))
      .then( () => {
        const path = location.query.redirect;
        if (path)
          dispatch(replace(path));
        else
          dispatch(replace('/'));
      });
  }

  render() {
    const {invalidEmail, invalidPassword} = this.state;
    const {localMsg, isFetch, userInfo} = this.props;
    // extract expire date from token
    let expireStr;
    if (userInfo.token) {
      const object = jwtDecode(userInfo.token);
      expireStr = object.exp ? moment(object.exp*1000).fromNow() : 'no expire';
    }

    const defaultMessage = (localMsg) ?
      (<Message attached='bottom' error><Icon name='warning' />{localMsg}</Message>) :
      (<Message attached='bottom' info>
        <Icon name='help' />Didn't remember a password? contract&#160;
        <a href="mailto:dev@mg.iqmedinnovation.com">dev@mg.iqmedinnovation.com</a>
       </Message>);
    const userForm = (!userInfo.isLogin) && (
      <div className='user-form'>
      <Message attached className='dark'
        header='Welcome to IQMED Research Platform'
        content='Fill out the form below to sign-in' />
      <Form action="/" onSubmit={this.handleSubmit} className='attached fluid segment'>
        <Form.Input label='Email' name='email' placeholder='Email' type='email'
          error={invalidEmail} />
        <Form.Input label='Password' name='password' type='password' 
          error={invalidPassword} />
        <Form.Checkbox label='Remember me' name='noExpire' />
        <Button color='blue' loading={isFetch}>Login</Button>
      </Form>
      {defaultMessage}
      </div>
    ) || (
      <div className='user-form'>
        <Message attached className='dark' 
          header={<span>Welcome {userInfo.name}</span>}
          />
        <div className='ui attached fluid segment'>
          <p>Email: <b>{userInfo.email}</b></p>
          <p>Expire: <b>{expireStr}</b></p>
        </div>
        <Button color='red' loading={isFetch} attached='bottom' onClick={this.handleLogout}>Logout</Button>
      </div>
    );

    return (
      <Grid centered stretched verticalAlign='middle' columns={3} id="login-page">

        <Grid.Column>
          <div style={{margin: '0 auto'}}>
            <Image src="styles/img/iqmed.png" width={160} height={160} />
          </div>
          {userForm}
        </Grid.Column>
      </Grid>
    );
  }
}

const mapState = (state) => {
  const isLocal = (state.sys.type === 'local');
  return {
    localMsg: isLocal && state.sys.msg || '',
    isFetch: isLocal && state.sys.isLoading,
    userInfo: state.user
  };
};
const mapDispatch = (dispatch) => {return {dispatch};};
export default connect(mapState, mapDispatch)(Login);