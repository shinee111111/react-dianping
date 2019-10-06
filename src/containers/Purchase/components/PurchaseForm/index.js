import React, { Component } from 'react';
import './style.css';

class PurchaseForm extends Component {
  render() {
    const { phone, quantity, totalPrice } = this.props;
    // const totalPrice = (currentPrice * quantity).toFixed(1);
    return (
      <div className='purchaseForm'>
        <div className='purchaseForm__wrapper'>
          <div className='purchaseForm__row'>
            <div className='purchaseForm__rowLabel'>数量</div>
            <div className='purchaseForm__rowValue'>
              <span className='purchaseForm__counter--dec'
                onClick={this.handleDecrease}
              >-</span>
              <input
                className='purchaseForm__quantity'
                type='number'
                onChange={this.handleChange}
                value={quantity}
              />
              <span className='purchaseForm__counter--inc'
                onClick={this.handleIncrease}
              >+</span>
            </div>
          </div>
          <div className='purchaseForm__row'>
            <div className='purchaseForm__rowLabel'>小计</div>
            <div className='purchaseForm__rowValue'>
              <span className='purchaseForm__totalPrice'>¥{totalPrice}</span>
            </div>
          </div>
          <div className='purchaseForm__row'>
            <div className='purchaseForm__rowLabel'>手机号码</div>
            <div className='purchaseForm__rowValue'>{phone}</div>
          </div>
        </div>
        <ul className='purchaseForm__remark'>
          <li className='purchaseForm__remarkItem'>
            <i className='purchaseForm__sign'></i>
            <span className='purchaseForm__desc'>支持随时退</span>
          </li>
          <li className='purchaseForm__remarkItem'>
            <i className='purchaseForm__sign'></i>
            <span className='purchaseForm__desc'>支持过期退</span>
          </li>
        </ul>
        <p className='purchaseForm__submit'
          onClick={this.handleClick}
        >提交订单</p>
      </div>
    );
  }

  handleDecrease = () => {
    const { quantity } = this.props;
    if (quantity <= 0) {
      return;
    }
    this.props.onSetQuantity(quantity - 1);
  }

  handleIncrease = () => {
    const { quantity } = this.props;
    this.props.onSetQuantity(quantity + 1);
  }

  handleChange = (e) => {
    const quantity = parseInt(e.target.value);
    this.props.onSetQuantity(quantity);
  }

  handleClick = () => {
    const { quantity } = this.props;
    if (quantity <= 0) {
      return;
    }
    this.props.onSubmit();
  }

}

export default PurchaseForm;