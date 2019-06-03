import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class ProfileProjects extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
    }
    this.renderProjects = this.renderProjects.bind(this);
  }

  renderProjects() {
    return this.state.mods
  }

  

  render() {
    const { isLoading } = this.state;
    // Display Loader if waiting
    if (isLoading) {
      return (
        <section className="p-projects">
          <div className="loader">Loading...</div>
        </section>
      );
    }

    const modList = this.props.user_mods
    var mods = []
    var index=1
    
    for (var project in modList) {
      
      var old_date = new Date(Date.parse(modList[project].update_date))
      var new_date = new Date();
      var diff = Math.floor(new_date.getTime() - old_date.getTime());
      var days = Math.floor(diff/(1000 * 60 * 60 * 24));
      var months = Math.floor(days/31);
      var years = Math.floor(months/12);
      var mod_update = "Last Update "
      if (years) mod_update += years+" years, "+months+" months, and "+days+" days ago"
      else if (months) mod_update += months+" months, and "+days+" days ago"
      else mod_update += days+" days ago"

      let delay = index * 100;
      var my_mods = modList[project]
      console.log("my_mods")
      console.log(my_mods)
      if (modList[project].mod_description) {
        var desc = JSON.parse(modList[project].mod_description).ops[0].insert
      } else
      var desc = modList[project].mod_description

      if (modList[project].images)
        var img = modList[project].images
      else
      var img = "/images/hytalemod.jpg"

      mods.push (
        <li key={index} className="p-projects__list-item" data-aos="fade-up" data-aos-delay={delay} data-aos-once="true">
          <img className="p-project-avatar" src={img} alt="" />
          <div className="p-project-details">
            <Link to="/mod" onClick={window.current_mod = my_mods} className="p-project__name">{modList[project].modname}</Link>
            <span className="p-project__dates">{mod_update}</span>
            <span className="p-project__dates">{desc.substr(0, 200)+"..."}</span>
          </div>
        </li>)
        index++;
    }
    return (
      <div className="p-projects">
        <ul className="p-projects__list">
          {mods}
        </ul>
      </div>
    )
  }
}
