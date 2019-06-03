import React, { Component }  from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import placeholder from '../../images/hytalemod.jpg';

/**
 * 
 * @param {number} delay - Milliseconds of delay for transistion (100 - 300)
 * 
 */
export default class ModPreview extends Component {
  constructor({ delay, content } ) {
    super()
    this.state =  {
      delay: delay,
      content: content
    }
  }
  render () {
  var delay = this.state.delay
  var content = this.state.content
  if (content.mod_description) {
    var desc = JSON.parse(content.mod_description).ops[0].insert
  } else
  var desc = content.mod_description

  if (content.images)
    var img = content.images
  else
  var img = "/images/hytalemod.jpg"
  return (
    <div className="mp" data-aos="fade-up" mod-id={content.id} owner-id={content.owner_id} data-aos-delay={delay} data-aos-once="true">
      <Link to={{pathname:"/mod", state:{mod:content}}} mod-id={content.id}>
        <img className="mod-card__img" src={img} alt="place holder" />
      </Link>
      <h2 className="mp__title">{content.modname}</h2>
      <div className="mp-title__container">
        <Link to="/profile/" owner-id={content.owner_id} className="mp__author">{content.username}</Link>
        <Link to={{pathname:"/mod", state:{mod:content}}} mod-id={content.id}>
          <button className="more-info__button">More Info</button>
        </Link>

      </div>
      <hr className="mp__underline" />
      <p className="mp__info">{desc}</p>
    </div>
  )
  }
}

ModPreview.propTypes = {
  delay: PropTypes.number.isRequired
}
