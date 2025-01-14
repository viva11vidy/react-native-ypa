import React, {Component} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

const NO_PER_SCREEN = 3;
const itemWidth = Dimensions.get('window').width / NO_PER_SCREEN;

class Marquee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
      scrolling: false,
      momentumScrolling: false,
    };
  }


  componentDidMount() {
    this.startScroll();
  }

  // Clear interval when user closes
  componentWillUnmount() {
    clearInterval(this.activeInterval);
  }

  startScroll() {
    this.activeInterval = setInterval(this.scrolling, 32);
  }

  clearScrolling() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
  }

  scrolling = () => {
    // Start scrolling if there's more than one stock to display
    const {data} = this.props;
    let {currentPosition} = this.state;
    if (currentPosition < 0) {
      currentPosition = 0;
    }
    if (data.length > NO_PER_SCREEN) {
      // Increment position with each new interval
      const position = currentPosition + this.props.speed;
      this.ticker.scrollToOffset({offset: position, animated: false});
      // After position passes this value, snaps back to beginning
      const maxOffset = data.length * itemWidth;
      // Set animation to repeat at end of scroll
      if (currentPosition > maxOffset) {
        const offset = currentPosition - maxOffset;
        this.ticker.scrollToOffset({
          offset,
          animated: false,
        });
        this.setState({currentPosition: offset});
      } else {
        this.setState({currentPosition: position});
      }
    }
  };

  onMomentumScrollBegin = () => {
    this.setState({
      momentumScrolling: true,
    });
    this.clearScrolling();
  };

  onMomentumScrollEnd = (event) => {
    const {momentumScrolling} = this.state;
    if (momentumScrolling) {
      this.setState({
        momentumScrolling: false,
        currentPosition: event.nativeEvent.contentOffset.x,
      });
      this.startScroll();
    }
  };

  onScrollBegin = () => {
    this.setState({
      scrolling: true,
    });
    this.clearScrolling();
  };

  onScrollEnd = (event) => {
    this.setState({
      scrolling: false,
      currentPosition: event.nativeEvent.contentOffset.x,
    });
    this.startScroll();
  };

  onTouchBegin = () => {
    this.clearScrolling();
  };

  onTouchEnd = () => {
    const {scrolling} = this.state;
    if (!scrolling) {
      this.startScroll();
    }
  };

  getWrappedData = () => {
    const {data} = this.props;
    const overlappingNo = this.getOverlappingNo();
    return {
      data: [...data, ...data.slice(0, overlappingNo)],
    };
  };

  getOverlappingNo = () => {
    const {data} = this.props;
    const {length} = data;
    let overlappingNo = 10;
    if (length < 10) {
      overlappingNo = length;
    }
    return overlappingNo;
  };

  render() {
    const {data} = this.getWrappedData();
    return (
      <FlatList
        initialNumToRender={NO_PER_SCREEN}
        ref={(ref) => {
          this.ticker = ref;
        }}
        decelerationRate="fast"
        onTouchStart={this.onTouchBegin}
        onTouchEnd={this.onTouchEnd}
        onScrollBeginDrag={this.onScrollBegin}
        onScrollEndDrag={this.onScrollEnd}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: data.length,
          offset: itemWidth * index,
          index,
        })}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={this.props.renderItem}
        horizontal
        style={{...this.props.style}}
        keyExtractor={this.props.keyExtractor}
      />
    );
  }
}

Marquee.propTypes = {
  stockData: PropTypes.array,
};

Marquee.defaultProps = {
  stockData: [],
};

const styles = StyleSheet.create({
  
});

export default Marquee;