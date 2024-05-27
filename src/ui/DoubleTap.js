import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

export default DoubleTap = (props) => {


  let lastTap = null;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && (now - lastTap) < props.delay) {
      props.onDoubleTap(props.params);
    } else {
      lastTap = now;
    }
  }


  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      {props.children}
    </TouchableWithoutFeedback>
  );

}

DoubleTap.defaultProps = {
  delay: 300,
  params: null,
  onDoubleTap: () => null,
};


