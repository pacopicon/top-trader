import React from 'react';
// import rebase from '../base';
import '../styles/Nav.css';
import Clock from './Clock'
import PropTypes from 'prop-types';

class Nav extends React.Component {
  constructor() {
    super();
    this.renderBtn = this.renderBtn.bind(this)
  }

  renderBtn() {
    if (this.props.linkClicked) {
      return (
        <button className="linkBtn" aria-hidden="true" name="this.props.linkClicked" value={this.props.linkClicked} onClick={() => this.props.handleLinkToggle(false)}><p>Stocks</p></button>
      )
    } else if (!this.props.linkClicked) {
      return (
        <button className="linkBtn" aria-hidden="true" name="this.props.linkClicked" value={!this.props.linkClicked} onClick={() => this.props.handleLinkToggle(true)}><p>Traders</p></button>
      )
    }
  }

  render() {
    return(
      <nav className="navbar fixed-top navbar-toggleable-sm bg-faded">
      <button className="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
        <span> </span>
        <span> </span>
        <span> </span>
      </button>
      <div className="hidden-sm-down navbar-brand col-lg-3 col-md-3 col-sm-3 col-xs-12">
        <b><p className="navHeading">Dash</p></b>
      </div>
      <div className="collapse navbar-collapse" id="collapsingNavbar">
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <Clock/>
          </li>
          <li className="nav-item">
            {this.renderBtn()}
          </li>
          <li className="nav-item">
            {/* <button ng-click="warnClose()" className="menuBtn menu-two col-lg-3 col-md-3 col-sm-3 col-xs-12">
              <p className="linkText">logout</p>
              {this.props.logout}
            </button> */}
          </li>
        </ul>
      </div>
    </nav>
    )
  }

}

Nav.propTypes = {
  // tagline: 'React.PropTypes.string' is the old syntax.  As of React v15.5, propTypes has become a library that should be imported ('import PropTypes from 'prop-types';').  Syntax has dropped 'React'.
  // tagline: PropTypes.string.isRequired
}

export default Nav;