import React, { Component } from 'react'
import { Link, withRouter, Redirect } from "react-router-dom";
import { do_login, get_user_status } from '../../axios/functions';

import './AccountForm.scss';

class LoginModal extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      passwd: '',
      validEmail: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    var status = get_user_status()
    var loggedIn = false;
    status.then(res => {
      if (res.id) {
        this.setState({loggedin: true});
        //window.location = "/";
        loggedIn = true
      }
      else {
      this.setState({loggedin: false});
      loggedIn = false
    }
      
    })
    //if (loggedIn) window.location = "/"
    console.log(loggedIn)
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // check if anything is invalid
    const { email, passwd } = this.state;
    if (email === false || passwd === false) {
      return;
    }

    const data = new FormData(e.target);
    console.log(...data)
    try {
      var object = {};
      data.forEach((value, key) => {object[key] = value});
      do_login (object.email, object.passwd)

      /*axios.post('/api/v1/updates/signup', {
        body: data
      })*/
      .then((res) => {
        if (res.status === 'success') {
          this.setState({toRoute:true});
          window.location = "/"
        } else {
          alert(res.status);
        }
      })
        .catch(e => console.log(e));
    } catch (err) {
      console.log('Error: ', err.message);
    }
  }

  validateEmail() {
    if (this.state.email === '') {
      return this.setState({ validEmail: true });
    }
    const regex = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/g;
    let valid = regex.test(String(this.state.email).toLowerCase());
    this.setState({ validEmail: valid });
  }

  render() {
    const { location, history } = this.props;
    const { state = {} } = location;
    const { modal } = state;

    if (this.state.toRoute) {
      window.loggedIn = true;
    }
    if (this.state.loggedin) {
      window.loggedIn = true;
    }

    // Clicking outside of the modal closes it
    let back = e => {
      if (e.target.id === 'modal') {
        e.stopPropagation();
        history.goBack();
      }
    };

    return (
      <div className="modal" onClick={back} id="modal" >
        {modal}
        <div className="account__form--login" data-aos="fade-up">
          <div className="form__wrap">
            <h3 className="form__title">Login to your account</h3>
            <form onSubmit={this.handleSubmit} encType="application/x-www-form-urlencoded" className="form" autoComplete="off">
              <div className="form__input-wrap">
                <input onBlur={this.validateEmail}
                  onChange={this.handleInput}
                  name="email" type="text"
                  className="form__input"
                  maxLength="65"
                  autoComplete="off"
                  required />
                <label htmlFor="email" className="form__label">Email</label>
                <span className={this.state.validEmail ? "form__error--hidden" : "form__error"}>Please enter a valid email address.</span>
              </div>
              <div className="form__input-wrap">
                <input onChange={this.handleInput}
                  name="passwd" type="password"
                  className="form__input"
                  autoComplete="off"
                  required />
                <label htmlFor="passwd" className="form__label">Password</label>
              </div>
              <span className="form__subtext--fp">Forgot Password&#63;</span>
              <div className="big-button-wrap">
                <button type="submit" className="big-button">Login</button>
                <div className="big-button--shade"></div>
              </div>
            </form>
            <span className="form__subtext">Don't have an account&#63; <Link to={{
              pathname: "/signup",
              state: { modal: true },
            }}
              className="form__link">Sign up</Link></span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(LoginModal);
