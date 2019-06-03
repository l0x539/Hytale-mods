import React, { Component } from 'react'
import { change_avatar, update_user_name } from '../../axios/functions';

import '../AccountForm/AccountForm.scss';

export default class TabAccount extends Component {

  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(...data)
    try {
      var object = {};
      data.forEach((value, key) => {object[key] = value});
      update_user_name (object.user)

      /*axios.post('/api/v1/updates/signup', {
        body: data
      })*/
        .then((res) => {
          if (res.status === 'success') {
            window.location.reload()
          }
          console.log(res);
        })
        .catch(e => console.log(e));
    } catch (err) {
      console.log('Error: ', err.message);
    }
  }
  handleChange(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("user_image", e.target.files[0])
    try {
      console.log(e.target.files)
      change_avatar (data)

      /*axios.post('/api/v1/updates/signup', {
        body: data
      })*/
        .then((res) => {
          if (res.status === 'success') {
            alert("Avatar updated.")
            window.location.reload()
          } else
            console.log(res);
        })
        .catch(e => console.log(e));
    } catch (err) {
      console.log('Error: ', err.message);
    }
  }

  render() {
    return (
      <section className="tab">
        <h2 className="tab__title">Update your account info</h2>
        <form onSubmit={this.handleSubmit} action="" encType="multipart/form-data" autoComplete="off">
          <div className="tab__input-wrap">
            <label htmlFor="user" className="tab__label">Username:</label>
            <input type="text" name="user" className="tab__input" placeholder="Enter new username" />
          </div>
          <div className="tab__input-wrap">
            <label htmlFor="avatar" className="tab__label">Avatar:</label>
            <input type="file" onChange={this.handleChange} name="user_image" className="tab__input" />
          </div>

          <button type="submit" className="tabBtn">Update</button>
        </form>
      </section>
    )
  }
}
