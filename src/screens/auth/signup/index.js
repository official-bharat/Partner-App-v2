import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Block from '../../../common-components/Block';
import Text from '../../../common-components/Text';
import {Formik} from 'formik';
import * as yup from 'yup';
import {HelperText, TextInput} from 'react-native-paper';
import {strictValidString} from '../../../utils/common-utils';
import {IconConstants} from '../../../constants/iconConstants';
import {ColorConstants} from '../../../constants/colorConstants';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../../common-components/Button';
import {Image} from 'react-native';
import {LoginStyles} from '../../../assets/styles/loginStyles';
import {logo} from '../../../assets/styles/commonStyles';
import {CommonUtils} from '../../../utils/commonUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {ComponentConstants} from '../../../constants/componentConstants';
import APPConstant from '../../../../app.json';
import {TextInputMask} from 'react-native-masked-text';
import {apiCall} from '../../../utils/api-client';
import {saveAsync} from '../../../utils/local-storage';
import {ObjectFactory} from '../../../utils/objectFactory';
import {CommonConstants} from '../../../constants/commonConstants';

const phoneRegExp = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
const passwordRegExp =
  /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).*$/;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [showCPassword, setShowCPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const {goBack, navigate} = useNavigation();
  const onSubmit = async (values) => {
    const httpClient = ObjectFactory.getHttpService();

    setLoading(true);
    const signupRequest = {
      clientId: APPConstant.clientId,
      fullName: values.first_name + ' ' + values.last_name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      scopes: values.scopes,
    };
    try {
      const res = await apiCall('Post', '/v1/partners/signup', signupRequest);
      setLoading(false);
      await ObjectFactory.getCacheService().saveValue(
        CommonConstants.TOKEN_FIELD_NAME,
        res.data,
      );
      await ObjectFactory.getCacheService().setSessionInfo(res.data);
      CommonUtils.showMessageConfirmation(
        'You have been signup successfully. please re-login the application',
        () => goBack(),
      );
    } catch (error) {
      setLoading(false);
      CommonUtils.showError(error.data);
    }

    // URL - /v1/partners/signup
    //
  };
  const errorText = (err) => {
    return (
      <Text margin={[hp(1), wp(1), 0]} size={14} accent>
        {err}
      </Text>
    );
  };
  return (
    <Block primary={true}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <Block center={true} flex={false} margin={[hp(2), 0]}>
          <Image style={LoginStyles.logo} source={logo} resizeMode="stretch" />
        </Block>
        <Block flex={false} center>
          <Text style={[LoginStyles.partnerText, {marginVertical: hp(0.5)}]}>
            {CommonUtils.translateMessageCode('loginPartnerText')}
          </Text>
          <Text style={[LoginStyles.partnerText, {marginVertical: hp(1)}]}>
            {CommonUtils.translateMessageCode('signupgrow')}
          </Text>
        </Block>
        <Formik
          enableReinitialize
          initialValues={{
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            confirm_password: '',
            phone: '',
            scopes: [],
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email('Must be a valid email address')
              .required('Email is required'),
            password: yup
              .string()
              .matches(
                passwordRegExp,
                'password should contain at least one special characters, numbers, upper and lowercase letters',
              )
              .min(8)
              .required('Password is required'),
            first_name: yup.string().min(1).required('First name is required'),
            scopes: yup
              .array()
              .min(1, "You can't leave this blank.")
              .required("You can't leave this blank.")
              .nullable(),
            last_name: yup.string().min(1).required('Last name is required'),
            phone: yup
              .string()
              .matches(phoneRegExp, 'Phone number is not valid')
              .min(10, 'to short')
              .max(12, 'to long')
              .required('Phone Number is required'),
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
            <Block flex={1}>
              <Block padding={[0, wp(4)]}>
                <TextInput
                  mode="outlined"
                  value={values.first_name}
                  onChangeText={handleChange('first_name')}
                  onBlur={() => setFieldTouched('first_name')}
                  error={touched.first_name && errors.first_name}
                  label={'First Name'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.first_name &&
                  strictValidString(errors.first_name) &&
                  errorText(errors.first_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                <TextInput
                  mode="outlined"
                  value={values.last_name}
                  onChangeText={handleChange('last_name')}
                  onBlur={() => setFieldTouched('last_name')}
                  error={touched.last_name && errors.last_name}
                  label={'Last Name'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.last_name &&
                  strictValidString(errors.last_name) &&
                  errorText(errors.last_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                <TextInput
                  mode="outlined"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  error={touched.email && errors.email}
                  label={'Email'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.email &&
                  strictValidString(errors.email) &&
                  errorText(errors.email)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                <TextInput
                  mode="outlined"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  error={touched.password && errors.password}
                  label={'Password'}
                  // style={TextInputStyle.containerStyle}
                  secureTextEntry={showPassword}
                  autoCapitalize="none"
                  // ref={passwordRef}
                  returnKeyType="done"
                  right={
                    <TextInput.Icon
                      name={() => (
                        <Feather
                          name={
                            !showPassword
                              ? IconConstants.EYE
                              : IconConstants.EYE_OFF
                          }
                          color={ColorConstants.DARKGRAY}
                          size={IconConstants.ICON_SIZE_20}
                        />
                      )}
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  }
                />
                {touched.password &&
                  strictValidString(errors.password) &&
                  errorText(errors.password)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                <TextInput
                  mode="outlined"
                  value={values.confirm_password}
                  onChangeText={handleChange('confirm_password')}
                  onBlur={() => setFieldTouched('confirm_password')}
                  error={touched.confirm_password && errors.confirm_password}
                  label={'Confirm Password'}
                  // style={TextInputStyle.containerStyle}
                  secureTextEntry={showCPassword}
                  autoCapitalize="none"
                  // ref={passwordRef}
                  returnKeyType="done"
                  right={
                    <TextInput.Icon
                      name={() => (
                        <Feather
                          name={
                            !showCPassword
                              ? IconConstants.EYE
                              : IconConstants.EYE_OFF
                          }
                          color={ColorConstants.DARKGRAY}
                          size={IconConstants.ICON_SIZE_20}
                        />
                      )}
                      onPress={() => {
                        setShowCPassword(!showCPassword);
                      }}
                    />
                  }
                />
                {touched.confirm_password &&
                  strictValidString(errors.confirm_password) &&
                  errorText(errors.confirm_password)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                <TextInput
                  mode="outlined"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={() => setFieldTouched('phone')}
                  error={touched.phone && errors.phone}
                  label={'Phone Number'}
                  placeholder={'Phone Number'}
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  maxLength={12}
                  render={(props) => (
                    <TextInputMask
                      type={'cel-phone'}
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '999-999-9999',
                      }}
                      {...props}
                    />
                  )}
                />
                {touched.phone &&
                  strictValidString(errors.phone) &&
                  errorText(errors.phone)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {}
                <Block flex={false} row space={'evenly'}>
                  <Button
                    onPress={() => {
                      if (values.scopes.includes('transporter')) {
                        var filteredArray = values.scopes.filter(
                          (e) => e !== 'transporter',
                        );
                        setFieldValue('scopes', filteredArray);
                      } else {
                        setFieldValue('scopes', [
                          ...values.scopes,
                          'transporter',
                        ]);
                      }
                    }}
                    uppercase
                    style={{width: wp(44)}}
                    color={
                      values.scopes.includes('transporter')
                        ? 'blue'
                        : 'transparent'
                    }>
                    Transporter
                  </Button>
                  <Button
                    onPress={() => {
                      if (values.scopes.includes('interpreter')) {
                        var filteredArray = values.scopes.filter(
                          (e) => e !== 'interpreter',
                        );
                        setFieldValue('scopes', filteredArray);
                      } else {
                        setFieldValue('scopes', [
                          ...values.scopes,
                          'interpreter',
                        ]);
                      }
                    }}
                    uppercase
                    style={{width: wp(44)}}
                    color={
                      values.scopes.includes('interpreter')
                        ? 'blue'
                        : 'transparent'
                    }>
                    Interpreter
                  </Button>
                </Block>

                <Button
                  isLoading={loading}
                  disabled={!isValid || !dirty}
                  onPress={handleSubmit}
                  color="secondary">
                  Sign Up
                </Button>
                <Text
                  onPress={() => goBack()}
                  center={true}
                  secondary
                  margin={[hp(2), 0, 0]}>
                  Already have an account? <Text>Login</Text>
                </Text>
              </Block>
            </Block>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default SignUp;
