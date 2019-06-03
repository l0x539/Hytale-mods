import React, { Component } from 'react'
import { Link  } from "react-router-dom";

import './Profile.scss';
import ProfileProjects from './ProfileProjects';
import { get_users, get_mod_by_owner_id, get_user_status, list_subs } from '../../axios/functions';

var dateFormat = require('dateformat');

// import banner from '../../images/banner-test.png';

export default class Profile extends Component {

  constructor() {
    super()
    this.state = {
      followers: []
    }
  }

  componentDidMount () {
    if (window.currentUser) {
      get_users(window.currentUser).then(r => {
        this.setState({user:r[0].username})
        this.setState({user_image:r[0].user_image})
        var old_date = new Date(Date.parse(r[0].add_at))
        var new_date = new Date();
        var diff = Math.floor(new_date.getTime() - old_date.getTime());
        var days = Math.floor(diff/(1000 * 60 * 60 * 24));
        var months = Math.floor(days/31);
        var years = Math.floor(months/12);
        var user_added = "Member for "
        if (years) user_added += years+" years, "+months+" months, and "+days+" days"
        else if (months) user_added += months+" months, and "+days+" days"
        else user_added += days+" days"
        
        var last_visit = new Date(Date.parse(r[0].last_visit));

        this.setState({userdate:user_added})
        this.setState({userlastvisit:"Last visit "+last_visit.toString()})
        get_mod_by_owner_id(r[0].id).then(m => {
          this.setState({user_mods:m})
        })
        list_subs(r[0].id).then(s => {
          for (var u in s) {
            get_users(u.subscriber_id).then(r => {
              var follower = <Link to="/profile" onClick={window.currentUser=u.id} />
              this.state.followers.push(follower);
              var followers = this.state.followers
              this.setState({followers: followers})
            })
          }
        })
      })
    } else {
      get_user_status().then(r => {
        if (r) {
          if (r.id) {
          window.currentUser = r.id
          get_users(r.id).then(r => {
            var old_date = new Date(Date.parse(r[0].add_at))
            var new_date = new Date();
            var diff = Math.floor(new_date.getTime() - old_date.getTime());
            var days = Math.floor(diff/(1000 * 60 * 60 * 24));
            var months = Math.floor(days/31);
            var years = Math.floor(months/12);
            var user_added = "Member for "
            if (years) user_added += years+" years, "+months+" months, and "+days+" days"
            else if (months) user_added += months+" months, and "+days+" days"
            else user_added += days+" days"
            
            var last_visit = new Date(Date.parse(r[0].last_visit));
            this.setState({userdate:user_added})
            this.setState({userlastvisit:"Last visit "+last_visit.toString()})
            this.setState({user:r[0].username})
            this.setState({user_image:r[0].user_image})
            get_mod_by_owner_id(r[0].id).then(m => {
              this.setState({user_mods:m})
            })
            list_subs(r[0].id).then(s => {
              for (var u in s) {
                get_users(u.subscriber_id).then(r => {
                  var follower = <Link to="/profile" onClick={window.currentUser=u.id} />
                  this.state.followers.push(follower);
                  var followers = this.state.followers
                  this.setState({followers: followers})
                })
              }
            })
          })
        } else {
          window.location = "/"
        }
        } else {
          window.location = "/"
        }
      })
    }  
  }

  render() {
    return (
      <div className="profile__wrap">
        <div className="profile">

          <section className="p-content">
            <div className="p-user-info">
              <div className="p-user-card">
                <img className="p-user-avatar" src={this.state.user_image} alt="" />
                <div className="p-user-details">
                  <h3 className="p-user__username">{this.state.user}</h3>
                  <span className="p-user__dates">{this.state.userdate}</span>
                  <span className="p-user__dates">{this.state.userlastvisit}</span>
                </div>
              </div>
              <div className="">

              </div>
            </div>

            <div className="p-user-interaction">
              <div className="p-nav">
                <ul className="p-nav__list">
                  <li className="p-nav__list-item">Posts</li>
                  <li className="p-nav__list-item">Followers</li>
                </ul>
              </div>

              <div className="p-user-content">
                <ProfileProjects user_mods={this.state.user_mods}/>
              </div>
            </div>
          </section>
{/* 
          <article className="p-sidebar">
            <a className="sponsored-banner" href="/">
              <img className="sponsored-banner__image" src={banner} alt="Sponsored banner" />
            </a>
            <a className="sponsored-banner" href="/">
              <img className="sponsored-banner__image" src={banner} alt="Sponsored banner" />
            </a>
            <a className="sponsored-banner" href="/">
              <img className="sponsored-banner__image" src={banner} alt="Sponsored banner" />
            </a>
            <a className="sponsored-banner" href="/">
              <img className="sponsored-banner__image" src={banner} alt="Sponsored banner" />
            </a>
          </article> */}
        </div>
      </div>
    )
  }
}

