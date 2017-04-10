/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';
import classnames from 'classnames';
import './Color.scss';

export default class Color extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    label: PropTypes.string,
    instructions: PropTypes.string,
    required: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    defaultValue: '#000000',
    label: null,
    instructions: null,
  }

  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.hide = this.hide.bind(this);
    this.value = props.defaultValue;

    this.state = { open: false, color: props.defaultValue };
  }

  hide() {
    this.setState({ open: false });
  }

  handleToggle(e) {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  handleChangeComplete = (color) => {
    this.value = color;
    this.setState({ color: color.hex });
  };

  render() {
    const { label, instructions, name, required } = this.props;
    const { color, open } = this.state;

    const popover = {
      position: 'absolute',
      zIndex: '2',
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };

    const classes = classnames(
      'color-wrapper',
      'form-element',
      { 'form-element--required': required },
    );

    return (
      <div className={classes}>
        {label && <span className="input__label">{label}</span>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <button
          onClick={this.handleToggle}
          className="color__btn"
          type="button"
          style={{ backgroundColor: color }}
        />
        <div className={`color__picker ${open ? 'is-open' : ''}`}>
          <div style={popover}>
            <div style={cover} onClick={this.hide} />
            <ChromePicker
              color={color}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        </div>

        <input type="text" name={name} value={color} readOnly hidden />
      </div>
    );
  }
}
