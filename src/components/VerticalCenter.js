import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import isFunction from 'lodash/isFunction'

import Box from './Box';

class VerticalCenter extends PureComponent {
  state = {}

  componentDidMount() {
    this.timer = setInterval(this.clearCount, 200)
    this.count = 0;
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  handleContainerRef = (ref) => {
    this.containerRef = ref;
  }

  handleResize = (contentRect) => {
    const { shouldCenter } = this.state;
    const shouldCenterNow = typeof this.containerRef !== 'undefined'
      && this.containerRef.getBoundingClientRect().height > contentRect.bounds.height;
    this.count += 1;

    this.setState({
      shouldCenter: this.count > 4 ? shouldCenter : shouldCenterNow,
    }, () => {
      this.props.onAlignChange(this.state.shouldCenter)
    });
  }

  clearCount = () => {
    this.count = 0
  }

  render() {
    const {
      children,
      onAlignChange,
      ...props
    } = this.props;
    const { shouldCenter } = this.state;
    return (
      <Box
        position="relative"
        height="100%"
        ref={this.handleContainerRef}
        {...props}
      >
        <Measure
          bounds
          onResize={this.handleResize}
        >
          {({ measureRef }) => (
            <Box
              position={shouldCenter && 'absolute'}
              top={shouldCenter ? '50%' : 0}
              width={1}
              transform={shouldCenter && 'translateY(-50%)'}
              ref={measureRef}
            >
              {isFunction(children) ? children(shouldCenter) : children}
            </Box>
          )}
        </Measure>
      </Box>
    );
  }
}

VerticalCenter.displayName = 'VerticalCenter';


VerticalCenter.propTypes = {
  onAlignChange: PropTypes.func,
}

VerticalCenter.defaultProps = {
  onAlignChange: () => {}
}

export default VerticalCenter;
