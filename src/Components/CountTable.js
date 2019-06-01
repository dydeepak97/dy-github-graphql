import React, { Component } from 'react';
import Card from './Card';

/**
 * Acts as a wrapper of group of Card components.
 */
export default class CountTable extends Component {
  render() {
    return (
      <div className='card-deck mt-3'>
        <Card title='Total Open' value={this.props.total} />
        <Card title='Older than 7 days' value={this.props.beforeWeek} />
        <Card title='1 day to 7 days old' value={this.props.withinWeek} />
        <Card title='Within 24 hours' value={this.props.withinDay} />
      </div>
    )
  }
}
