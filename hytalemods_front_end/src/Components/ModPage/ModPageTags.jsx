import React, { Component } from 'react'

export default class ModPageTags extends Component {
  render() {
    // Render category tags (needs to be redone)
    const categories = this.props.mod.tags.split(',')

    const renderTags = categories.map((category, i) => {
      return <span key={i} className="mod-tags__tag">{category}</span>
    });

    return (
      <React.Fragment>
        <hr className="linebreak" />

        <div className="mod-tags">
          <div className="mod-tags__wrap">
            <h3 className="mod-tags__title">Tags: </h3>
            {renderTags}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
