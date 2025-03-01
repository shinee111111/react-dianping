import React, { Component } from 'react';
import { Link } from'react-router-dom';
import LikeItem from '../LikeItem';
import './style.css';
import Loading from '../../../../components/Loading';


class LikeList extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.removeListener = false;
  }

  render() {
    const { data, pageCount } = this.props;
    return (   
      <div ref={this.myRef} className='likeList'>
        <div className='likeList__header'>猜你喜欢</div>
        <div className='likeList__list'>
          {
            data.map((item ,index) => {
              return <LikeItem key={index} data={item} />
            })
          }
        </div>
        {
          pageCount < 3 ? (
            <Loading />
          ) : (
           <Link to='/' className='likeList__viewAll'>
             查看更多
           </Link> 
          )
        }
      </div>
    );
  }

  componentDidMount() {
    if (this.props.pageCount < 3) {
      document.addEventListener('scroll', this.handleScroll);
    } else {
      this.removeListener = true;
    }
    if (this.props.pageCount === 0) {
      this.props.fetchData();
    }
  }

  componentDidUpdate() {
    if (this.props.pageCount >= 3 && !this.removeListener) {
      document.removeEventListener('scroll', this.handleScroll);
      this.removeListener = true;
    }
  }
  
  componentWillUnmount() {
    !this.removeListener && document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    const scrollTop = document.documentElement.scrollTop | document.body.scrollTop;
    const screenHeight = document.documentElement.clientHeight;
    const likeListTop = this.myRef.current.offsetTop;
    const likeListHeight = this.myRef.current.offsetHeight;
    // console.log(scrollTop, likeListTop + likeListHeight - screenHeight);
    if (scrollTop >= likeListTop + likeListHeight - screenHeight) {
      this._timer = setTimeout(() => {
        this.props.fetchData();
      }, 500);
    }
  }

}

export default LikeList;