import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {ColorConstants} from '../constants/colorConstants';

export default class UploadProgress extends Component {
  render() {
    return (
      <View style={styles.main}>
        <View style={styles.container}>
          <ActivityIndicator size={'large'} color={ColorConstants.GREEN} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    borderRadius: 10,
    shadowColor: 'black',
    backgroundColor: ColorConstants.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    shadowOffset: {width: 0, height: 2},
    maxWidth: 150,
    maxHeight: 150,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
});
