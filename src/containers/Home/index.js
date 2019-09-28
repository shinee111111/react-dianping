import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Category from './components/Category';
import Headline from './components/Headline';
import Discount from './components/Discount';
import LikeList from './components/LikeList';
import HomeHeader from './components/HomeHeader';
import Footer from '../../components/Footer';
import Activity from './components/Activity';
import Banner from '../../components/Banner';
import {
  actions as homeActions, getLikes,
  getDiscounts, getPageCountOfLikes
} from '../../redux/modules/home';

class Home extends Component {
  render() {
    const { likes, discounts, pageCount } = this.props;
    return (
      <div>
        <HomeHeader />
        <Banner />
        <Category />
        <Headline />
        <Activity />
        <Discount data={discounts} />
        <LikeList 
          data={likes} 
          pageCount={pageCount}
          fetchData={this.fetchMoreLikes}/>
        <Footer />
      </div>
    );
  }

  componentDidMount() {
    this.props.homeActions.loadDiscounts();
  }

  fetchMoreLikes = () => {
    this.props.homeActions.loadLikes();
  }

}

const mapStateToProps = (state, props) => {
  // 返回的是在容器型组件中要使用的对象
  return {
    likes: getLikes(state),
    discounts: getDiscounts(state),
    pageCount: getPageCountOfLikes(state)
  };
};

const mapDispatchToProps = dispatch => {
  // 组件内部无需dispatch去调用，
  // 而是直接调用homeActions的方法。
  return {
    homeActions: bindActionCreators(homeActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);