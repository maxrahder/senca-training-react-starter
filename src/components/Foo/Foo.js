import React, { Component } from "react";
import "./Foo.scss";
import Constants from "../../utils/Constants";

export default class Foo extends Component {
  render() {
    return (
      <p className="foo">
        This is my custom component. And by the way, Avogadros number is{" "}
        {Constants.avogadrosNumber}.
      </p>
    );
  }
}
