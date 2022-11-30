import {Image} from 'react-native';
import React, {useState} from 'react';
import Block from '../../../../common-components/Block';
import Text from '../../../../common-components/Text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  CommonStyles,
  TextInputTheme,
} from '../../../../assets/styles/commonStyles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import * as yup from 'yup';
import {strictValidString} from '../../../../utils/common-utils';
import {images} from '../../../../assets';
import Button from '../../../../common-components/Button';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {apiCall} from '../../../../utils/api-client';
import {CommonUtils} from '../../../../utils/commonUtils';
import {ComponentConstants} from '../../../../constants/componentConstants';
const AppConstant = require('../../../../../app.json');
const passwordRegExp =
  /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).*$/;
const VerifyOtp = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values) => {
    setLoading(true);
    const data = {
      userName: params.email,
      clientId: AppConstant.cognitoClientId,
      confirmationCode: values.Otp,
      password: values.password,
    };
    try {
      const res = await apiCall('POST', '/v1/login/reset-password', data);
      if (res) {
        setLoading(false);
        CommonUtils.showMessageConfirmation(
          'Your password has been reset successfully.',
          () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: ComponentConstants.SPLASH_SCREEN_NAME}],
              }),
            );
            CommonUtils.logout();
          },
        );
      }
    } catch (error) {
      setLoading(false);
      CommonUtils.showError(error.data);
    }
  };
  const errorText = (err) => {
    return (
      <Text
        margin={[heightPercentageToDP(1), widthPercentageToDP(1), 0]}
        size={14}
        accent>
        {err}
      </Text>
    );
  };
  return (
    <Block primary={true}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <Formik
          enableReinitialize
          initialValues={{
            email: '',
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            Otp: yup.string().min(6).max(6).required('Otp is required'),
            password: yup
              .string()
              .matches(
                passwordRegExp,
                'password should contain at least one special characters, numbers, upper and lowercase letters',
              )
              .min(8)
              .required('Password is required'),
            confirm_password: yup
              .string()
              .oneOf([yup.ref('password'), null], 'Passwords must match')
              .required('Confirm Password is required'),
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            setFieldValue,
            handleSubmit,
            isValid,
            dirty,
          }) => (
            <Block padding={[0, widthPercentageToDP(4)]} flex={false}>
              <Block
                center={true}
                flex={false}
                margin={[heightPercentageToDP(2), 0]}>
                <Image
                  style={{height: 220, width: 270}}
                  source={images.new_pass_icon}
                />
                <Text size={40} secondary semibold>
                  New password
                </Text>
                <Text center size={16} margin={[heightPercentageToDP(4), 0, 0]}>
                  Enter the new password then your password will change. Don't
                  forget again.
                </Text>
              </Block>
              <Block flex={false} margin={[heightPercentageToDP(2), 0, 0]}>
                <TextInput
                  placeholder="Enter Verification Code"
                  theme={TextInputTheme}
                  style={CommonStyles.textInputWithoutMargin}
                  value={values.Otp}
                  onChangeText={handleChange('Otp')}
                  onBlur={() => setFieldTouched('Otp')}
                  error={touched.Otp && errors.Otp}
                  label="Enter Verification Code"
                  autoCapitalize="none"
                  mode="outlined"
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType={'next'}
                />
                {touched.Otp &&
                  strictValidString(errors.Otp) &&
                  errorText(errors.Otp)}
                <Block flex={false} margin={[heightPercentageToDP(1), 0, 0]}>
                  <TextInput
                    placeholder="New Password"
                    theme={TextInputTheme}
                    style={CommonStyles.textInputWithoutMargin}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={() => setFieldTouched('password')}
                    error={touched.password && errors.password}
                    label="New Password"
                    autoCapitalize="none"
                    mode="outlined"
                    returnKeyType={'next'}
                  />
                  {touched.password &&
                    strictValidString(errors.password) &&
                    errorText(errors.password)}
                </Block>
                <Block flex={false} margin={[heightPercentageToDP(1), 0, 0]}>
                  <TextInput
                    placeholder="Confirm Password"
                    theme={TextInputTheme}
                    style={CommonStyles.textInputWithoutMargin}
                    value={values.confirm_password}
                    onChangeText={handleChange('confirm_password')}
                    onBlur={() => setFieldTouched('confirm_password')}
                    error={touched.confirm_password && errors.confirm_password}
                    label="Confirm Password"
                    autoCapitalize="none"
                    mode="outlined"
                    returnKeyType={'next'}
                  />
                  {touched.confirm_password &&
                    strictValidString(errors.confirm_password) &&
                    errorText(errors.confirm_password)}
                </Block>
                <Block flex={false} margin={[heightPercentageToDP(4), 0, 0]}>
                  <Button
                    loading={loading}
                    disabled={!isValid || !dirty}
                    color={'secondary'}
                    onPress={handleSubmit}>
                    Set Password
                  </Button>
                </Block>
              </Block>
            </Block>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default VerifyOtp;
