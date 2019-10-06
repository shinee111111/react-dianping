import React, { Component } from 'react';

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      // 组件内部去维护要异步加载的组件
      super(props);
      this.state = {
        component: null
      };
    }

    componentDidMount() {
      // 当AsyncComponent组件挂载完成的时候
      importComponent().then((mod) => {
        this.setState({
          component: mod.default
        })
      })
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  }
  return AsyncComponent;
}