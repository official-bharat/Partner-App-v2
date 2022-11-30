import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Block from './Block';
import Text from './Text';
import {light} from './theme/colors';
import {t1} from './theme/fontsize';
const componentStyles = () => {
  return StyleSheet.create({
    button: {
      borderRadius: 5,
      justifyContent: 'center',
      marginVertical: t1,
      borderWidth: 1,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    disabledButton: {
      backgroundColor: '#00000052',
      borderWidth: 0,
    },
    circular: {
      borderRadius: 20,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
    },
    accent: {
      // backgroundColor: 'red',
      borderColor: light.warning,
      paddingVertical: t1 * 1.5,
    },
    primary: {
      backgroundColor: 'transparent',
      paddingVertical: t1 * 1.5,
      borderColor: light.secondary,
    },
    secondary: {
      backgroundColor: light.secondary,
      borderColor: light.secondary,
      paddingVertical: t1 * 1.5,
      // borderRadius: 30,
    },
    blue: {
      backgroundColor: light.button,
      borderColor: light.button,
      paddingVertical: t1 * 1.5,
      // borderRadius: 30,
    },
    facebook: {
      backgroundColor: light.facebook,
      borderColor: light.facebook,
      paddingVertical: t1 * 1.5,
    },
    transparent: {
      backgroundColor: light.primary,
      borderColor: light.blue,
      paddingVertical: t1 * 1.5,
    },
    // tertiary: {backgroundColor: colors.tertiary},
    // black: {backgroundColor: colors.black},
    // white: {backgroundColor: colors.white},
    // gray: {backgroundColor: colors.gray},
    // gray2: {backgroundColor: colors.gray2},
    // gray3: {backgroundColor: colors.gray3},
    // gray4: {backgroundColor: colors.gray4},
  });
};

const Button = ({
  style,
  opacity,
  gradient,
  color,
  startColor,
  endColor,
  end,
  start,
  locations,
  shadow,
  children,
  icon,
  circular,
  size,
  isLoading,
  disabled,
  borderColor,
  textStyle,
  iconStyle,
  iconHeight,
  iconWidth,
  iconWithText,
  iconColor = '#fff',
  uppercase,
  ...rest
}) => {
  const styles = componentStyles();

  const buttonStyles = [
    styles.button,
    borderColor && {borderColor},
    disabled && shadow && styles.shadow,
    circular && styles.circular,
    color && styles[color], // predefined styles colors for backgroundColor
    color && !styles[color] && {backgroundColor: color}, // custom backgroundColor
    style,
  ];

  const renderTextColor = () => {
    if (color === 'secondary') {
      return '#fff';
    } else if (color === 'facebook') {
      return '#fff';
    } else if (color === 'blue') {
      return '#fff';
    } else if (color === 'transparent') {
      return light.blue;
    } else if (disabled) {
      return '#fff';
    } else if (color === 'accent') {
      return light.warning;
    }
    return light.secondary;
  };
  if (iconWithText) {
    return (
      <TouchableOpacity
        style={[
          buttonStyles,
          disabled && styles.disabledButton,
          {paddingVertical: t1},
        ]}
        disabled={!!disabled}
        activeOpacity={disabled ? opacity || 0.8 : 0.2}
        {...rest}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Block flex={false} center middle row>
            <Block flex={false} style={iconStyle}>
              <Image
                source={icon}
                style={{
                  height: iconHeight,
                  width: iconWidth,
                  tintColor: iconColor,
                }}
              />
            </Block>

            <Text
              margin={[0, 0, 0, widthPercentageToDP(3)]}
              style={textStyle}
              center
              h1
              size={size || 14}
              color={renderTextColor()}>
              {children}
            </Text>
          </Block>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyles, disabled && styles.disabledButton]}
      disabled={!!disabled}
      activeOpacity={disabled ? opacity || 0.8 : 0.2}
      {...rest}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text
          style={textStyle}
          center
          uppercase={uppercase}
          h1
          size={size || 14}
          color={renderTextColor()}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  start: {x: 0, y: 0},
  end: {x: 1, y: 1},
  locations: [0.1, 0.9],
  opacity: 0.8,
  color: '#FFF',
};

export default Button;
