import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Block from '../../../../common-components/Block';
import Text from '../../../../common-components/Text';
import {Formik} from 'formik';
import * as yup from 'yup';
import {TextInput} from 'react-native-paper';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../../utils/common-utils';
import Button from '../../../../common-components/Button';
import {Image} from 'react-native';
import {LoginStyles} from '../../../../assets/styles/loginStyles';
import {logo} from '../../../../assets/styles/commonStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {ComponentConstants} from '../../../../constants/componentConstants';
import Dropdown from '../../../../components/Dropdown-v2';
import {TextInputMask} from 'react-native-masked-text';
import {apiCall} from '../../../../utils/api-client';
import {ObjectFactory} from '../../../../utils/objectFactory';
import GooglePlacesTextInput from '../../../../common-components/google-places';
import {CommonUtils} from '../../../../utils/commonUtils';

const phoneRegExp = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;

const PersonalInformation = () => {
  const [loading, setLoading] = useState(false);
  const {goBack, navigate} = useNavigation();
  const [partnerProfile, setPartnerProfile] = useState({});

  const updateTransporterRequest = async (values) => {
    const updatePartnerRequest = {};
    if (partnerProfile.transporterId) {
      updatePartnerRequest.transporterProfile = {
        companyName: values.company_name,
        address: values.address,
        roles: [values.roles],
      };
    }
    if (partnerProfile.interpreterId) {
      updatePartnerRequest.interpreterProfile = {
        address: values.address,
      };
    }
    const sessionInfo = await ObjectFactory.getCacheService().getSessionInfo();
    try {
      const res = await apiCall(
        'PUT',
        `/v1/partners/${sessionInfo.userId}/profile`,
        updatePartnerRequest,
      );
      if (res) {
        setLoading(false);
        if (partnerProfile.interpreterId) {
          navigate(ComponentConstants.LANGUAGE_CERTIFICATE_SCREEN_NAME, {
            transporterProfile: partnerProfile,
            data: {
              companyName: values.company_name,
              address: values.address,
              roles: [values.roles],
            },
          });
        } else {
          navigate(ComponentConstants.QUESTIONNAIRE_SCREEN_NAME, {
            transporterProfile: partnerProfile,
            data: {
              companyName: values.company_name,
              address: values.address,
              roles: [values.roles],
            },
          });
        }
      }
    } catch (error) {
      setLoading(false);
      CommonUtils.showError(error.data);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const updateUserRequest = {
      email: values.email,
      fullname: values.full_name,
      phone: values.phone,
    };
    const sessionInfo = await ObjectFactory.getCacheService().getSessionInfo();
    try {
      const res = await apiCall(
        'PUT',
        `/v1/users/${sessionInfo.userId}/profile`,
        updateUserRequest,
      );
      if (res) {
        setLoading(true);
        updateTransporterRequest(values);
        // navigate(ComponentConstants.QUESTIONNAIRE_SCREEN_NAME);
      }
    } catch (error) {
      setLoading(false);
      CommonUtils.showError(error.data);
    }
  };

  const getProfileApi = async () => {
    const sessionInfo = await ObjectFactory.getCacheService().getSessionInfo();
    try {
      const res = await apiCall('GET', `/v1/partners/${sessionInfo.userId}`);
      if (res && strictValidObjectWithKeys(res.data)) {
        // setPartnerProfile(res.data.interpreterProfile);
        setPartnerProfile({
          ...partnerProfile,
          ...res.data.interpreterProfile,
          ...res.data.transporterProfile,
        });
      }
      // if (
      //   res &&
      //   strictValidObjectWithKeys(res.data) &&
      // ) {
      //   setPartnerProfile({
      //     ...partnerProfile,
      //     ...res.data.transporterProfile,
      //   });
      // }
    } catch (error) {}

    // /v1/partners/
  };
  useEffect(() => {
    getProfileApi();
  }, []);

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
          <Text style={[LoginStyles.partnerText, {marginVertical: hp(2)}]}>
            Personal Information
          </Text>
        </Block>
        <Formik
          enableReinitialize
          initialValues={{
            email: strictValidObjectWithKeys(partnerProfile)
              ? partnerProfile.email
              : '',
            full_name: strictValidObjectWithKeys(partnerProfile)
              ? partnerProfile.fullname
              : '',
            phone: strictValidObjectWithKeys(partnerProfile)
              ? partnerProfile.phone
              : '',
            company_name: strictValidObjectWithKeys(partnerProfile)
              ? strictValidString(partnerProfile.companyName)
                ? partnerProfile.companyName
                : ''
              : '',
            country:
              strictValidObjectWithKeys(partnerProfile) &&
              strictValidObjectWithKeys(partnerProfile.address)
                ? partnerProfile.address.country
                : '',
            state:
              strictValidObjectWithKeys(partnerProfile) &&
              strictValidObjectWithKeys(partnerProfile.address)
                ? partnerProfile.address.state
                : '',
            zip_code:
              strictValidObjectWithKeys(partnerProfile) &&
              strictValidObjectWithKeys(partnerProfile.address)
                ? partnerProfile.address.zip
                : '',
            fulladdress:
              strictValidObjectWithKeys(partnerProfile) &&
              strictValidObjectWithKeys(partnerProfile.address)
                ? partnerProfile.address.fullAddress
                : '',
            roles: strictValidObjectWithKeys(partnerProfile)
              ? strictValidArrayWithLength(partnerProfile.roles)
                ? partnerProfile.roles[0]
                : ''
              : '',
            address:
              strictValidObjectWithKeys(partnerProfile) &&
              strictValidObjectWithKeys(partnerProfile.address)
                ? partnerProfile.address
                : {},
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email('Must be a valid email address')
              .required('Email is required'),
            company_name:
              strictValidObjectWithKeys(partnerProfile) &&
              strictValidString(partnerProfile.transporterId) &&
              yup
                .string()
                .min(1)
                .required('Transportation Company Name is required'),
            country: yup.string().min(1).required('Country is required'),
            roles:
              strictValidObjectWithKeys(partnerProfile) &&
              strictValidString(partnerProfile.transporterId) &&
              yup.string().min(1).required('Role is required'),
            state: yup.string().min(1).required('State is required'),
            zip_code: yup.string().min(1).required('Zip Code is required'),
            fulladdress: yup.string().min(1).required('Address is required'),
            full_name: yup.string().min(1).required('Full Name is required'),
            phone: yup
              .string()
              .matches(phoneRegExp, 'Phone number is not valid')
              .min(10, 'to short')
              .max(12, 'to long')
              .required('Phone Number is required'),
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
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  label={'Full Name'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
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
                  disabled
                />
                {touched.email &&
                  strictValidString(errors.email) &&
                  errorText(errors.email)}
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
                {strictValidObjectWithKeys(partnerProfile) &&
                  strictValidString(partnerProfile.transporterId) && (
                    <>
                      <TextInput
                        mode="outlined"
                        value={values.company_name}
                        onChangeText={handleChange('company_name')}
                        onBlur={() => setFieldTouched('company_name')}
                        error={touched.company_name && errors.company_name}
                        label={'Transportation Company Name'}
                        placeholder={'Transportation Company Name'}
                        autoCapitalize="none"
                        returnKeyType="next"
                      />
                      {touched.company_name &&
                        strictValidString(errors.company_name) &&
                        errorText(errors.company_name)}
                      <Block flex={false} margin={[hp(1), 0, 0]} />
                    </>
                  )}
                <GooglePlacesTextInput
                  searchKeyword={values.fulladdress}
                  onChangeText={(e) => {
                    if (e === '') {
                      setFieldValue('state', '');
                      setFieldValue('zip_code', '');
                      setFieldValue('country', '');
                      setFieldValue('address', '');
                      setFieldValue('fulladdress', '');
                    } else {
                      setFieldValue('fulladdress', e);
                    }
                  }}
                  parsedAddress={(e) => {
                    setFieldValue('state', e.state);
                    setFieldValue('zip_code', e.zip);
                    setFieldValue('country', e.country);
                    setFieldValue('address', e);
                    setFieldValue('fulladdress', e.fullAddress);
                  }}
                  label={'Address'}
                  placeholder={'Address'}
                  // error={
                  //   touched.trip_dropoff_location &&
                  //   errors.trip_dropoff_location
                  // }
                />
                {touched.fulladdress &&
                  strictValidString(errors.fulladdress) &&
                  errorText(errors.fulladdress)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                <TextInput
                  mode="outlined"
                  value={values.country}
                  onChangeText={handleChange('country')}
                  onBlur={() => setFieldTouched('country')}
                  error={touched.country && errors.country}
                  label={'Country'}
                  placeholder={'Country'}
                  autoCapitalize="none"
                  disabled
                />
                {touched.country &&
                  strictValidString(errors.country) &&
                  errorText(errors.country)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                <TextInput
                  mode="outlined"
                  value={values.state}
                  onChangeText={handleChange('state')}
                  onBlur={() => setFieldTouched('state')}
                  error={touched.state && errors.state}
                  label={'State'}
                  placeholder={'State'}
                  autoCapitalize="none"
                  disabled
                />
                {touched.state &&
                  strictValidString(errors.state) &&
                  errorText(errors.state)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                <TextInput
                  mode="outlined"
                  value={values.zip_code}
                  onChangeText={handleChange('zip_code')}
                  onBlur={() => setFieldTouched('zip_code')}
                  error={touched.zip_code && errors.zip_code}
                  label={'Zip Code'}
                  placeholder={'Zip Code'}
                  autoCapitalize="none"
                  disabled
                />
                {touched.zip_code &&
                  strictValidString(errors.zip_code) &&
                  errorText(errors.zip_code)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {strictValidObjectWithKeys(partnerProfile) &&
                  strictValidString(partnerProfile.transporterId) && (
                    <>
                      <Text>I am registering as a</Text>
                      <Dropdown
                        defaultValue={values.roles}
                        items={[
                          {
                            label: 'First Responder',
                            value: 'FIRST_RESPONDER',
                          },
                          {
                            label: 'CNA (Certified Nursing Assistant)',
                            value: 'CNA',
                          },
                          {
                            label: 'NEMT Transporter',
                            value: 'NEMT',
                          },
                        ]}
                        placeholder="I am registering as a"
                        onSelect={(item, value) => {
                          setFieldValue('roles', item);
                        }}
                      />
                      {touched.roles &&
                        strictValidString(errors.roles) &&
                        errorText(errors.roles)}
                    </>
                  )}
                <Button
                  isLoading={loading}
                  // disabled={!isValid || !dirty}
                  onPress={handleSubmit}
                  color="secondary">
                  Save and Next
                </Button>
              </Block>
            </Block>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default PersonalInformation;
