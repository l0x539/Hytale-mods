import React, { Component } from 'react'
import { update_password } from '../../axios/functions';

export default class TabPassword extends Component {
  constructor() {
    super();
    this.state = {
      passwd: '',
      cpasswd: '',
      validPassword: true,
      validCPassword: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.validatePassword = this.validatePassword.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    // check if anything is invalid
    const { validName, validEmail, validPassword, validCPassword } = this.state;
    if (validPassword === false || validCPassword === false) { // add recaptcha
      return;
    }

    const data = new FormData(e.target);
    console.log(...data)
    try {
      var object = {};
      data.forEach((value, key) => {object[key] = value});
      update_password (object.crtpasswd, object.passwd)

      /*axios.post('/api/v1/updates/signup', {
        body: data
      })*/
        .then((res) => {
          if (res.status === 'success') {
            alert("Password Updated.")
          }
          console.log(res);
        })
        .catch(e => console.log(e));
    } catch (err) {
      console.log('Error: ', err.message);
    }
  }

  validatePassword() {
    if (this.state.passwd === '') {
      console.log("empty pass")
      return this.setState({ validPassword: true });
    }
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&_*])[a-zA-Z0-9!@#$%^&_*]{8,}$/;
    let valid = regex.test(String(this.state.passwd));
    console.log("pass valid: " + valid)
    this.setState({ validPassword: valid });
  }

  confirmPassword() {
    if (this.state.passwd === this.state.cpasswd) {
      console.log("pass does match")
      return this.setState({ validCPassword: true });
    } else {
      console.log("pass doesn't match")
      return this.setState({ validCPassword: false });
    }
  }

  render() {
    return (
      <section className="tab">
        <h2 className="tab__title">Change your password</h2>
        <form onSubmit={this.handleSubmit} action="" encType="multipart/form-data" autoComplete="off">
          <div className="tab__input-wrap">
            <label htmlFor="crtpasswd" className="tab__label">Current Password:</label>
            <input type="password" name="crtpasswd" className="tab__input" />
          </div>
          <div className="tab__input-wrap">
            <label htmlFor="passwd" className="tab__label">New Password:</label>
            <input onBlur={this.validatePassword}
                  onChange={this.handleInput}
             type="password" name="passwd" className="tab__input" />
            <span className={this.state.validPassword ? "form__error--hidden" : "form__error"}>1 uppercase, 1 number, 1 special character. Min length 8.</span>
          </div>
          <div className="tab__input-wrap">
            <label htmlFor="cpasswd" className="tab__label">Confirm New Password:</label>
            <input onBlur={this.confirmPassword}
                  onChange={this.handleInput}
                   type="password" name="cpasswd" className="tab__input" />
            <span className={this.state.validCPassword ? "form__error--hidden" : "form__error"}>Passwords don't match.</span>
          </div>

          <button type="submit" className="tabBtn">Update</button>
        </form>
      </section>
    )
  }
}
