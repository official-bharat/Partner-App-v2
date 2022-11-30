import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {light} from './theme/colors';
import {h1, h2, h3, title, body, caption, header} from './theme/fontsize';

const componentStyles = () => {
  return StyleSheet.create({
    // default style
    text: {
      fontSize: 14,
    },
    // variations
    uppercase: {
      textTransform: 'uppercase',
    },
    capitalize: {
      textTransform: 'capitalize',
    },
    regular: {
      fontWeight: 'bold',
    },
    bold: {
      fontWeight: 'bold',
    },
    semibold: {
      fontWeight: 'bold',
    },
    medium: {
      fontWeight: '500',
    },
    light: {
      fontWeight: '200',
    },
    underline: {
      textDecorationLine: 'underline',
    },
    accent: {
      color: 'red',
    },
    // position
    center: {textAlign: 'center'},
    right: {textAlign: 'right'},
    // colors
    primary: {color: light.primary},
    secondary: {color: light.secondary},
    grey: {color: light.subtitleColor},
    errorColor: {color: light.warning},
    linkColor: {color: light.link},
    // // fonts
    h1: {fontSize: h1},
    h2: {fontSize: h2},
    h3: {fontSize: h3},
    title: {fontSize: title},
    header: {fontSize: header},
    body: {fontSize: body},
    caption: {fontSize: caption},
    white: {
      color: '#fff',
    },
  });
};

const CustomText = ({
  h1,
  h2,
  h3,
  title,
  body,

  caption,
  header,
  size,
  transform,
  align,
  // styling
  regular,
  bold,
  semibold,
  medium,
  weight,
  light,
  center,
  right,
  spacing, // letter-spacing
  height, // line-height
  // colors
  grey,
  color,
  accent,
  primary,
  secondary,
  tertiary,
  black,
  white,
  gray,
  gray2,
  red,
  style,
  children,
  animation,
  animationOptions,
  uppercase,
  underline,
  margin,
  errorColor,
  link,
  capitalize,
  ...props
}) => {
  const styles = componentStyles();
  const handleMargins = () => {
    if (typeof margin === 'number') {
      return {
        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,
      };
    }
    if (typeof margin === 'object') {
      const marginSize = Object.keys(margin).length;
      switch (marginSize) {
        case 1:
          return {
            marginTop: margin[0],
            marginRight: margin[0],
            marginBottom: margin[0],
            marginLeft: margin[0],
          };
        case 2:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[0],
            marginLeft: margin[1],
          };
        case 3:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[1],
          };
        default:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[3],
          };
      }
    }
  };
  const textStyles = [
    styles.text,
    h1 && styles.h1,
    h2 && styles.h2,
    h3 && styles.h3,
    title && styles.title,
    body && styles.body,
    caption && styles.caption,
    header && styles.small,
    size && {fontSize: size},
    transform && {textTransform: transform},
    align && {textAlign: align},
    height && {lineHeight: height},
    spacing && {letterSpacing: spacing},
    weight && {fontWeight: weight},
    regular && styles.regular,
    bold && styles.bold,
    semibold && styles.semibold,
    medium && styles.medium,
    light && styles.light,
    grey && styles.grey,
    center && styles.center,
    right && styles.right,
    color && styles[color],
    link && styles.linkColor,
    color && !styles[color] && {color},
    capitalize && styles.capitalize,
    // color shortcuts
    accent && styles.accent,
    primary && styles.primary,
    secondary && styles.secondary,
    black && styles.black,
    white && styles.white,
    gray && styles.gray,
    gray2 && styles.gray2,
    red && styles.red,
    uppercase && styles.uppercase,
    underline && styles.underline,
    errorColor && styles.errorColor,
    margin && {...handleMargins()},
    style, // rewrite predefined styles
  ];
  return (
    <Text {...props} style={textStyles}>
      {children}
    </Text>
  );
};

export default CustomText;
