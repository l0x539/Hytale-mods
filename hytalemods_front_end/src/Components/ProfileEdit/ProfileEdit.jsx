import React, { Component } from 'react'
import TabAccount from './TabAccount';
import TabMods from './TabMods';
import TabPassword from './TabPassword';
import { Link  } from "react-router-dom";

import { get_users, get_mod_by_owner_id, get_user_status, list_subs } from '../../axios/functions';

import './ProfileEdit.scss';

export default class ProfileEdit extends Component {
  constructor() {
    super();

    this.state = {
      selectedTab: 0,
      followers: []
    }

    this.handleTabs = this.handleTabs.bind(this);
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
          console.log({test:m})
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
            console.log(r[0].add_at)
            console.log(r[0].last_visit)
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
              console.log(m)
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

  handleTabs(e) {
    this.setState({
      selectedTab: e.target.value
    })
  }

  render() {
    const { selectedTab } = this.state;
    

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
            </div>

            <div className="p-user-interaction">
              <div className="p-nav">
                <ul className="p-nav__list">
                  <li onClick={this.handleTabs} value="0" className="p-nav__list-item">Account Info</li>
                  <li onClick={this.handleTabs} value="1" className="p-nav__list-item">Your Mods</li>
                  <li onClick={this.handleTabs} value="2" className="p-nav__list-item">Password</li>
                </ul>
              </div>

              <div className="p-user-content">
                {selectedTab === 0 && <TabAccount />}
                {selectedTab === 1 && <TabMods />}
                {selectedTab === 2 && <TabPassword />}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
