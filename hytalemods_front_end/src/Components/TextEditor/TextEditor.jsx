import React, { Component } from 'react'

import './TextEditor.scss';

import '../../../node_modules/quill/dist/quill.snow.css';

export default class TextEditor extends Component {
  componentDidMount() {
  }

  render() {

    return (
      <React.Fragment>
        {/* Rich Text Editor */}
        <div id="editor"></div>
      </React.Fragment>
    )
  }
}
