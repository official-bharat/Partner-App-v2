import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Block from './Block';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {Image, TouchableOpacity} from 'react-native';
import Text from './Text';
import {images} from '../assets';
import {strictValidString} from '../utils/common-utils';
import {ColorConstants} from '../constants/colorConstants';
const Header = ({
  onPress,
  centerText,
  rightText,
  leftIcon,
  customNav = false,
}) => {
  const nav = useNavigation();
  return (
    <>
      <Block safearea flex={false} />
      <Block
        borderWidth={[0, 0, 1, 0]}
        borderColorDeafult
        center
        row
        primary
        space={'between'}
        padding={[hp(2), wp(3)]}
        flex={false}>
        {!leftIcon ? (
          <TouchableOpacity
            onPress={() => {
              if (customNav) {
                onPress();
              } else {
                nav.goBack();
              }
            }}>
            <Image source={images.back} style={{height: 22, width: 22}} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPress}>
            {/* <Image source={images.back} style={{height: 22, width: 22}} /> */}
          </TouchableOpacity>
        )}
        <Block center flex={false}>
          <Text color={ColorConstants.BLACK} size={18}>
            {centerText}
          </Text>
        </Block>
        <TouchableOpacity>
          <Text>{rightText}</Text>
        </TouchableOpacity>
      </Block>
    </>
  );
};

Header.defaultProps = {
  centerText: '',
  rightText: '',
  bottomText: '',
};
Header.propTypes = {
  centerText: PropTypes.string,
  rightText: PropTypes.string,
  leftIcon: PropTypes.bool,
  onPress: PropTypes.func,
  bottomText: PropTypes.string,
};
export default Header;
