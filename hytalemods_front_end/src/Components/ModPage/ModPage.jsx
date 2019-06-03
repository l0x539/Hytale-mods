import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import ModPageHeader from './ModPageHeader';
import ModPageDetails from './ModPageDetails';
import ModPageComments from './ModPageComments';

import './ModPage.scss';

class ModPage extends Component {

  /*constructor(here) {
    super()
    this.state = {
      mod:here
    }
  }*/

  previousLocation = this.props.location;

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    let { location } = this.props;
    console.log(location)
    var mod = false
    if (location.state) {
      mod = location.state.mod
    }
    
    if (!mod) 
      return <Redirect to='/'  />
    return (
      <div className="mod-page">
        <div className="mod-page__container">
          <ModPageHeader mod={mod} />
          <section className="mod-content">
            <ModPageDetails mod={mod} />
            <ModPageComments mod={mod} />
          </section>
        </div>
      </div>
    )
  }
}
export default ModPage;
