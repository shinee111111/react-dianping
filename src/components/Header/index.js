import React, { Component } from 'react';
import './style.css';

class Header extends Component {
  render() {
    const { grey, title, onBack } = this.props;
    const backgroundColor = grey ? '#f0f0f0' : '#fff';
    return (
      <div>
        <header className='header' style={{ backgroundColor }}>
          <div className='header__back' onClick={onBack}>
            返回
          </div>
          <div className='header__title'>
            {title}
          </div>
        </header>
      </div>
    );
  }
}

export default Header;