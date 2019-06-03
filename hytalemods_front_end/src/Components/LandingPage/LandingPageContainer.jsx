import React, { Component } from 'react'

import ModPreview from './ModPreview';
import { get_mods } from '../../axios/functions';


export default class LandingPageContainer extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      page_mods: [],
      users: [],
      username: '',
      mods: []
    }
    this.renderRecipes = this.renderRecipes.bind(this);
  }
  
  componentDidMount () {
    var mods = [];
    // Render mod Previews TEMP
    let tick = 100;
    const p_mods = get_mods();
    p_mods.then(p => {
      const page_mods = p;
      const users = [];
      this.setState({page_mods:page_mods});
      this.setState({users:users})
      for (var m in this.state.page_mods) {
        if (tick > 300) {
          tick = 100;
        }
        mods.push(
          <ModPreview content={this.state.page_mods[m]} delay={tick} />
        );
        
        tick += 100;
      }
      this.setState({mods:mods})
    })
  }

  render() {
    const { isLoading } = this.state;

    /*mods.push(
      <ModPreview username="UserName" content={{owner_id:"1", images:"/static/media/hytalemod.7320bd64.jpg", modname:"Hytale Mod", mod_description:"Hytale mods are mods for hytale, made from hytale players that play hytale. Download their mods from hytale mods."}} delay={tick} />
    );*/

    // Display Loader if waiting
    if (isLoading) {
      return (
        <section className="lp-content">
          <div className="loader">Loading...</div>
        </section>
      );
    }

    return (
      <section className="lp-content">
        {/* Site banner */}
        <header className="header">
          <div className="header__img" alt="Banner logo for hytale mods"></div>
        </header>
        {/* Render Mod preview cards */}
        <div className="mod-previews">
          {this.renderRecipes()}
        </div>
      </section>
    )
  }

  renderRecipes() {
      window.page_mods = this.state.mods;
      return (
        <div className="mod-previews">
          {this.state.mods}
        </div>
      );
  }
}