import React from 'react';
import Spinner from 'react-spinkit';

export default class Loading extends React.PureComponent {
  render() {
    return <Spinner
      fadeIn="none"
      name="pacman"
      color="steelblue"
      className="absolute-center"
    />;
  }
}