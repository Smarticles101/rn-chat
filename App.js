import React from 'react';
import { Provider } from 'react-redux';
import store from "./store/index";
import MainApp from './MainApp';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainApp />
      </Provider>
    );
  }
}