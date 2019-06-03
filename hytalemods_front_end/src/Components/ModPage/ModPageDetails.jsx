import React, { Component } from 'react'

import ModPageTags from './ModPageTags';

//import img from '../../images/placeholder.jpg'
import Quill from 'quill';


var HtmlToReactParser = require('html-to-react').Parser;


export default class ModPageDetails extends Component {
  render() {
    var tempCont = document.createElement("div");
    (new Quill(tempCont)).setContents(JSON.parse(this.props.mod.mod_description))
    var cont = tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
    var htmlToReactParser = new HtmlToReactParser();
    var reactElement = htmlToReactParser.parse(cont);
    return (
      <section id="content" className="mod-details">
        {reactElement}
        <ModPageTags mod={this.props.mod} />
      </section>
    )
  }
}
