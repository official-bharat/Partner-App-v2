import React from 'react';
import Block from './Block';
import Text from './Text';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {Image} from 'react-native';
import {images} from '../assets';
import PropTypes from 'prop-types';

const EmptyFile = ({text}) => {
  return (
    <Block center middle>
      {/* <Image source={images.noData} style={{height: 200, width: 200}} /> */}
      <Image source={images.noDatafound} style={{height: 200, width: 300}} />
      <Text size={16} margin={[heightPercentageToDP(2), 0, 0]}>
        {text}
      </Text>
    </Block>
  );
};
EmptyFile.propTypes = {
  state: PropTypes.string,
};
EmptyFile.defaultProps = {
  text: 'No Data',
};
export default EmptyFile;
