import React, { Component } from 'react';
import Swiper from 'swiper';
import { get_mod_images } from '../../axios/functions';

import '../../../node_modules/swiper/dist/css/swiper.css';

export default class ModPageCarousel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      s_slide: [],
      s_slide_mages: []
    }
  }
  componentDidMount() {
    // Init Swiper.js Carousel
    // eslint-disable-next-line
    const galleryThumbs = new Swiper('.gallery-thumbs', {
      init: true,
      spaceBetween: 5,
      slidesPerView: 4,
      loop: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      centeredSlides: true,
      grabCursor: true,
      breakpoints: {
        // when window width is <= 320px
        320: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        // when window width is <= 640px
        850: {
          slidesPerView: 3,
          spaceBetween: 10
        }
      }
    });
    // Init Swiper.js Carousel
    // eslint-disable-next-line
    const galleryTop = new Swiper('.gallery-top', {
      init: true,
      spaceBetween: 10,
      slidesPerView: 1,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: galleryThumbs,
      },
      grabCursor: true,
      effect: 'slide',
    });

    var imgs = get_mod_images(this.props.mod.id)
    var s_slide = []
    var s_slide_image = []
    imgs.then(r => {
      for (var p in r) {
        console.log(r[p].mod_image)
        s_slide.push(<img src={r[p].mod_image} className="swiper-slide" ></img>)
        s_slide_image.push(<img src={r[p].mod_image} className="mod__image--small swiper-slide" src=""></img>)
      }
      this.setState({s_slide:s_slide});
      this.setState({s_slide_image:s_slide_image})
    })
  }

  render() {
    return (
      <section className="mod__images">
        <div className="swiper-container gallery-top">
          <div className="swiper-wrapper">
            {this.state.s_slide}
          </div>
          <div className="swiper-button-next swiper-button-white"></div>
          <div className="swiper-button-prev swiper-button-white"></div>
        </div>

        <div className="swiper-container gallery-thumbs">
          <div className="swiper-wrapper">
            {this.state.s_slide_mages}
          </div>
        </div>
      </section>
    )
  }
}
