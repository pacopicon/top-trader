import React from "react";
import Ball from "./Ball";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  backgroundColor: 'white'
};

class BouncingBall extends React.Component {
  state = {
    ballLeft: true
  };
  ballJump = () =>
    this.setState({
      ballLeft: !this.state.ballLeft
    });

  render() {
    const { ballLeft } = this.state;
    return (
      <div style={styles}>
        <h1>D3 transitions in React 16.3 {"\u2728"}</h1>
        <p>Click the ball 👇</p>
        <svg style={{ width: "300", height: "300px" }} onClick={this.ballJump}>
          <Ball x={ballLeft ? 15 : 250} />
        </svg>
      </div>
    );
  }
}

export default BouncingBall