import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import UiValidate from '../../../components/forms/validation/UiValidate.jsx';
import {login} from '../../reducers/userActions';

class Login extends Component
{
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  state = {email: "", password: ""};

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();
    const {dispatch} = this.props;
    const email = $("input[name=email]").val();
    const password = $("input[name=password").val();
    if ($("#login-form").valid()) {
      dispatch(login(email, password));
    }
  }

  render() {

    const {localMsg, isFetch} = this.props;
    const errorElement = localMsg && <h5 className="text-center"> - {localMsg} -</h5>;

    return (

      <div id="extr-page" className='login-page'>
        <div id="main" role="main" className="animated fadeInDown">
          <div id="content" className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-md-offset-3 col-lg-offset-4">
                <div className='login-logo'>
                  <img src="styles/img/iqmed.png" width="180" height="180" alt="iqmedinnovation" />
                </div>
                <div className="well no-padding">
                  <UiValidate>
                    <form onSubmit={this.onSubmit} id="login-form" className="smart-form client-form">
                      <header>
                        Sign In
                      </header>
                      <fieldset>
                        <section>
                          <label className="label">E-mail</label>
                          <label className="input"> <i className="icon-append fa fa-user" />
                            <input type="email" name="email" data-smart-validate-input="" data-required="" data-email="" data-message-required="Please enter your email address" data-message-email="Please enter a VALID email address"
                            />
                            <b className="tooltip tooltip-top-right"><i className="fa fa-user txt-color-teal"/>
                  Please enter email address/username</b></label>
                        </section>
                        <section>
                          <label className="label">Password</label>
                          <label className="input"> <i className="icon-append fa fa-lock" />
                            <input type="password" name="password" data-smart-validate-input="" data-required="" data-minlength="3" data-maxnlength="20" data-message="Please enter your email password"
                            />
                            <b className="tooltip tooltip-top-right"><i className="fa fa-lock txt-color-teal"/> Enter
                  your password</b> </label>
                          <div className="note">
                            <a href="forgotPassword">Forgot password?</a>
                          </div>
                        </section>
                        <section>
                          <label className="checkbox">
                            <input type="checkbox" name="remember" defaultChecked={ true } />
                            <i/>Stay signed in</label>
                        </section>
                      </fieldset>
                      <footer>
                        <button type="submit" className="btn btn-primary">
                          Sign in
                        </button>
                      </footer>
                    </form>
                  </UiValidate>
                </div>
                {errorElement}
                { /*
                                    <h5 className="text-center"> - Or sign in using -</h5>
                                    <ul className="list-inline text-center">
                                        <li>
                                            <a href-void="" className="btn btn-primary btn-circle"><i className="fa fa-facebook"/></a>
                                        </li>
                                        <li>
                                            <a href-void="" className="btn btn-info btn-circle"><i className="fa fa-twitter"/></a>
                                        </li>
                                        <li>
                                            <a href-void="" className="btn btn-warning btn-circle"><i className="fa fa-linkedin"/></a>
                                        </li>
                                      </ul>*/ }
              </div>
            </div>
          </div>
        </div>
      </div>

      );
  }
}

const mapState = state => {
  const isLocal = (state.sys.type === 'local');
  return {
    localMsg: isLocal && state.sys.msg || '',
    isFetch: isLocal && state.sys.isLoading
  };
};
const mapDispatch = dispatch => {
  return {dispatch};
};

export default connect(mapState, mapDispatch)(Login);
