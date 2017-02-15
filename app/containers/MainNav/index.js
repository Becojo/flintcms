import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from '../../utils/icons';
import './MainNav.scss';

const NavItem = props => <li className="nav__list-item"><Link className="nav__list-item__link" to={props.to}>{props.children}</Link></li>;

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};

export default class MainNav extends Component {
  render() {
    return (
      <nav className="nav">
        <a href="/" target="_blank" rel="noopener noreferrer" className="nav__sitename">
          Example Flint Site
        </a>
        <ul className="nav__list">
          <NavItem to="/admin"><Icon icon="checkmark" />Home</NavItem>
          <NavItem to="/admin/entries"><Icon icon="pencil" />Entries</NavItem>
          <NavItem to="/admin/settings"><Icon icon="floppy" />Settings</NavItem>
        </ul>
      </nav>
    );
  }
}