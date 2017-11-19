import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import allReducers from './src/reducers/index.js';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import {Provider, connect} from 'react-redux';

import Router from './src/routes/router';

const middleware = applyMiddleware(promise(),thunk)
const store = createStore(allReducers, middleware);

console.disableYellowBox = true;

export default class App extends React.Component {

  componentWillMount() {
  }

  render() {
    return (
      <Provider store= {store}>
        <Router />
     </Provider>
    );
  }
}
