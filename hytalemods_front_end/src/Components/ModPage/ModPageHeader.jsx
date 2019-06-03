import React, { Component } from 'react'

import { Link } from 'react-router-dom';
import { sub_unsub, list_subs } from '../../axios/functions';
import ModPageCarousel from './ModPageCarousel';

var numeral = require("numeral");

export default class ModPageHeader extends Component {
  constructor() {
    super();
    this.state = {
      sub_state: "Subscribe"
    }
    this.renderRecipes = this.renderRecipes.bind(this);
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    this.setState({sub_state:"Subscribe"});
    var all_user_subs = list_subs(this.props.mod.owner_id)
    all_user_subs.then(l => {
      for (var i in l) {
        if (l[i].user_subs_id === this.props.mod.owner_id) {
          this.setState({sub_state:"Unsubscribe"});
        }
          
      }
    })
    console.log(this.state.sub_state)
  }

  handleClick (e) {
    sub_unsub(this.props.mod.owner_id).then(response => {
      this.setState({sub_response: response.status})
      if (response.status !== "success") 
        alert(response.status)
    });
    this.renderRecipes()
    if (this.state.sub_state === "Subscribe")
    this.setState({sub_state:"Unsubscribe"});
    else
    this.setState({sub_state:"Subscribe"});
  }

  render() {
    if (this.state.sub_response) {
      
    }

    var create_date = new Date(Date.parse(this.props.mod.create_date )).toDateString()
    var update_date = new Date(Date.parse(this.props.mod.update_date )).toDateString()

    return (
      <div className="mod-header">
        <section className="banner">
          <h2 className="banner__title">{this.props.mod.modname}</h2>
          <div className="banner__button">
            <div className="big-button-wrap--dl">
              <Link type="" to={this.props.mod.maplink} className="big-button--dl">Download Mod</Link>
              <div className="big-button--shade"></div>
            </div>
          </div>
        </section>

        <section className="mod-info">
          <ModPageCarousel mod={this.props.mod} />

          <div className="mod-stats">
            <div className="mod-card__wrap">
              <div className="mod-card">
                <img className="mod-card__image" src={this.props.mod.user_image} alt="" />
                <div className="mc__wrap">
                  <h2 className="mod-card__name">Modder: <Link to="/profile" className="mod-card__name--primary">{this.props.mod.username}</Link></h2>
                  <Link onClick={this.handleClick} className="sub__button">{this.renderRecipes()}</Link>
                </div>
              </div>
              <div className="ms-dates__wrap">
                <span className="ms-dates__date">Updated on {update_date}</span>
                <span className="ms-dates__date">Published on {create_date}</span>
              </div>
            </div>
            <div className="ms-stat__wrap">
              <span className="ms-stat__stat">Views: <span className="ms-stat__stat--primary">{numeral(this.props.mod.views).format('0,0')}</span></span>
              <span className="ms-stat__stat">Downloads: <span className="ms-stat__stat--primary">{numeral(this.props.mod.downloads).format('0,0')}</span></span>
              <span className="ms-stat__stat">Likes: <span className="ms-stat__stat--primary">{numeral(this.props.mod.likes).format('0,0')}</span></span>
              <span className="ms-stat__stat">Comments: <span className="ms-stat__stat--primary">{numeral(this.props.mod.comments).format('0,0')}</span></span>
              <span className="ms-stat__stat">Favorites: <span className="ms-stat__stat--primary">{numeral(this.props.mod.favorites).format('0,0')}</span></span>
            </div>
          </div>

        </section>
      </div>
    )
  }
  renderRecipes() {
    
    return (
      this.state.sub_state
    );
}
}