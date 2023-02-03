import React, { Component} from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

class App extends Component {
  
  render() {
    return (
        <div className="center">
          <HomePage />
        </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);