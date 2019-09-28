import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchBox from './components/SearchBox';
import PopularSearch from './components/PopularSearch';
import SearchHistory from './components/SearchHistory';
import {
  actions as searchActions,
  getPopularKeywords, getRelatedKeywords,
  getHistoryKeywords, getInputText
} from '../../redux/modules/search.js';

class Search extends Component {
  render() {
    const {
      popularKeywords,
      relatedKeywords,
      historyKeywords,
      inputText
    } = this.props;
    return (
      <div>
        <SearchBox
          inputText={inputText}
          relatedKeywords={relatedKeywords}
          onChange={this.handleChangeInput}
          onClear={this.handleClearInput}
          onCancel={this.handleCancel}
          onClickItem={this.handleClickItem} />
        <PopularSearch
          data={popularKeywords}
          onClickItem={this.handleClickItem} />
        <SearchHistory
          data={historyKeywords}
          onClickItem={this.handleClickItem}
          onClear={this.handleClearHistory} />
      </div>
    );
  }

  componentDidMount() {
    const { loadPopularKeywords } = this.props.searchActions;
    loadPopularKeywords();
  }

  // 搜索框文本发生变化
  handleChangeInput = text => {
    const { setInputText, loadRelatedKeywords } = this.props.searchActions;
    setInputText(text);
    // 根据文本变化相关关键字
    loadRelatedKeywords(text);
  }

  // 清除搜索框文本
  handleClearInput = () => {
    const { clearInputText } = this.props.searchActions;
    clearInputText();
  }

  // 取消搜索
  handleCancel = () => {
    // 取消 ->  置空输入并返回上页
    this.handleClearInput();
    this.props.history.goBack();
  }

  // 处理点击关键词的逻辑
  handleClickItem = item => {
    // 点击数据 传入输入框 并 加入历史记录 
    const { setInputText, addHistoryKeyword, loadRelatedShops } = this.props.searchActions;
    setInputText(item.keyword);
    addHistoryKeyword(item.id);
    // 还会触发搜索行为，跳转到搜索结果页 todo，且触发查询店铺请求
    loadRelatedShops(item.id);
    this.props.history.push('/search_result');
  }

  // 清除历史记录
  handleClearHistory = () => {
    const { clearHistoryKeywords } = this.props.searchActions;
    clearHistoryKeywords();
  }

  componentWillUnmount() {
    // 初始化
    const { clearInputText } = this.props.searchActions;
    clearInputText();
  }

}

const mapStateToProps = (state, props) => {
  return {
    popularKeywords: getPopularKeywords(state),
    relatedKeywords: getRelatedKeywords(state),
    historyKeywords: getHistoryKeywords(state),
    inputText: getInputText(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchActions: bindActionCreators(searchActions, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);