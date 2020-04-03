import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import GeoTimeline from '../components/GeoTimeline/GeoTimeline';
import DataView from '../components/DataView';

export default class MainRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={GeoTimeline} />
        <Route path="/dataview" component={DataView} />
      </Router>
    );
  }
}
