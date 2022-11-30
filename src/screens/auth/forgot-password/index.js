import {Image} from 'react-native';
import React, {useState} from 'react';
import Block from '../../../common-components/Block';
import Text from '../../../common-components/Text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LoginStyles} from '../../../assets/styles/loginStyles';
import {
  CommonStyles,
  logo,
  TextInputTheme,
} from '../../../assets/styles/commonStyles';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-paper';
import {Formik} from 'formik';
import * as yup from 'yup';
import {strictValidString} from '../../../utils/common-utils';
import {images} from '../../../assets';
import Button from '../../../common-components/Button';
import {useNavigation} from '@react-navigation/native';
import {apiCall} from '../../../utils/api-client';
import {CommonUtils} from '../../../utils/commonUtils';
import {ComponentConstants} from '../../../constants/componentConstants';
const AppConstant = require('../../../../app.json');

const ForgotPassword = () => {
  const {goBack, navigate} = useNavigation();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values) => {
    setLoading(true);
    const data = {
      userName: values.email,
      clientId: AppConstant.cognitoClientId,
    };
    try {
      const res = await apiCall('POST', '/v1/login/forgot-password', data);
      if (res) {
        setLoading(false);
        CommonUtils.showMessageConfirmation(
          'Please check your inbox and reset the password',
          () => {
            navigate(ComponentConstants.VERIFY_OTP_SCREEN_NAME, {
              email: values.email,
            });
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
            email: yup
              .string()
              .email('Must be a valid email address')
              .required('Email is required'),
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
                  source={images.forgot_icon}
                />
                <Text size={40} secondary semibold>
                  Reset password
                </Text>
                <Text center size={16} margin={[heightPercentageToDP(4), 0, 0]}>
                  Enter the email associated with your account and we'll send
                  you an email with instructions to reset your password.
                </Text>
              </Block>
              <Block flex={false} margin={[heightPercentageToDP(5), 0, 0]}>
                <TextInput
                  placeholder="Email"
                  theme={TextInputTheme}
                  style={CommonStyles.textInputWithoutMargin}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  error={touched.email && errors.email}
                  label="Email"
                  autoCapitalize="none"
                  mode="outlined"
                  keyboardType="email-address"
                  returnKeyType={'next'}
                />
                {touched.email &&
                  strictValidString(errors.email) &&
                  errorText(errors.email)}
                <Block flex={false} margin={[heightPercentageToDP(4), 0, 0]}>
                  <Button
                    isLoading={loading}
                    disabled={!isValid || !dirty}
                    color={'secondary'}
                    onPress={handleSubmit}>
                    Reset Password
                  </Button>
                  <Text
                    margin={[heightPercentageToDP(1), 0, 0]}
                    secondary
                    center
                    onPress={() => goBack()}>
                    Wait, I remember my password
                  </Text>
                </Block>
              </Block>
            </Block>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default ForgotPassword;
