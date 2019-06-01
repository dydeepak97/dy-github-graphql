import React, { Component } from 'react'

/**
 * React component to display a card with a title
 * and value passed in as props.
 */
export default class Card extends Component {
  render() {
    return (
      <div className='card bg-light mb-3'>
        <div className="card-header">{this.props.title}</div>
        <div className="card-body">
          <h5 className="card-title">{this.props.value}</h5>
        </div>
      </div>
    )
  }
}
