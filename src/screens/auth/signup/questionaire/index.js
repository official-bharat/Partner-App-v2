import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Block from '../../../../common-components/Block';
import Text from '../../../../common-components/Text';
import {FieldArray, Formik} from 'formik';
import * as yup from 'yup';
import {HelperText, TextInput} from 'react-native-paper';
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
import {useNavigation, useRoute} from '@react-navigation/native';
import {ComponentConstants} from '../../../../constants/componentConstants';
import {Checkbox} from 'react-native-paper';
import {light} from '../../../../common-components/theme/colors';
import {Chip} from 'react-native-paper';
import {CommonUtils} from '../../../../utils/commonUtils';
import {ObjectFactory} from '../../../../utils/objectFactory';
import {apiCall} from '../../../../utils/api-client';

const Questionnaire = () => {
  const [loading, setLoading] = useState(false);
  const {goBack, navigate} = useNavigation();
  const [state, setState] = useState('');
  const input = useRef();
  const {params} = useRoute();
  const [question, setQuestion] = useState([
    {
      question: 'How many drivers do you have?',
      answer: '',
      type: 'number',
    },
    {
      question: 'How many drivers will be providing service to MedTrans Go?',
      answer: '',
      type: 'number',
    },
    {
      question:
        'How many dead miles (un-billed) are you willing to travel to pick up a passenger?',
      answer: '',
      type: 'number',
    },
    {
      question: 'What counties do you service?',
      answer: [],
      type: 'tags',
    },
    {
      question: 'How many total vehicles do you have?',
      answer: '',
      type: 'number',
    },
    {
      question: 'How many vehicles for ambulatory patients?',
      answer: '',
      type: 'number',
    },
    {
      question: 'How many vehicles are equipped for stretchers?',
      answer: '',
      type: 'number',
    },
    {
      question: 'How many vehicles are equipped for wheelchairs?',
      answer: '',
      type: 'number',
    },
    {
      question: 'Do you have your own wheelchair?',
      answer: 'true',
      type: 'checkbox',
    },
    {
      question: 'How much weight does the wheel chair support (In lbs)?',
      answer: '',
      type: 'number',
    },
    {
      question: 'Will you be providing transportation for Covid - 19 Patients?',
      answer: 'true',
      type: 'checkbox',
    },
    {
      question:
        'Do you have the necessary PPE and supplies to protect against possible transmission of Covid-19, on each vehicle?(Gloves,face mask,sanitizer,disinfectants,etc)',
      answer: 'true',
      type: 'checkbox',
    },
    {
      question: 'Will you be providing Rx Medication/DME Delivery service?',
      answer: 'true',
      type: 'checkbox',
    },
  ]);
  const {transporterProfile, data} = params;

  const errorText = (err) => {
    return (
      <Text margin={[hp(1), wp(1), 0]} size={14} accent>
        {err}
      </Text>
    );
  };
  const renderQuestions = (number, qus) => {
    return (
      <Text height={20} size={16} medium>
        {number}. {qus}
      </Text>
    );
  };
  const onSubmit = async (values) => {
    const arrayData = [];
    values.questionnaires.map((a) => {
      arrayData.push({
        question: a.question,
        answer: a.answer.toString(),
      });
    });
    setLoading(true);
    const updateUserRequest = {
      transporterProfile: {questionnaires: arrayData},
    };
    const sessionInfo = await ObjectFactory.getCacheService().getSessionInfo();
    try {
      const res = await apiCall(
        'PUT',
        `/v1/partners/${sessionInfo.userId}/profile`,
        updateUserRequest,
      );
      if (res) {
        setLoading(false);
        // navigate(ComponentConstants.QUESTIONNAIRE_SCREEN_NAME);
        navigate(ComponentConstants.CERTIFICATE_SCREEN_NAME, {
          transporterProfile: transporterProfile,
          data: {
            ...data,
            questionnaires: arrayData,
          },
        });
      }
    } catch (error) {
      setLoading(false);
      CommonUtils.showError(error.data);
    }
  };

  useEffect(() => {
    if (
      strictValidObjectWithKeys(transporterProfile) &&
      strictValidArrayWithLength(transporterProfile.questionnaires)
    ) {
      transporterProfile.questionnaires.forEach((element) => {
        const index = question.findIndex((element2) => {
          return element2.question === element.question;
        });
        if (index >= 0) {
          if (
            question[index].type === 'tags' &&
            strictValidString(element.answer)
          ) {
            const array = element.answer.split(',');
            question[index].answer = array;
          } else {
            question[index].answer = element.answer;
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Block primary={true}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <Block center={true} flex={false} margin={[hp(2), 0]}>
          <Image style={LoginStyles.logo} source={logo} resizeMode="stretch" />
        </Block>
        <Block flex={false} center>
          <Text style={[LoginStyles.partnerText, {marginVertical: hp(2)}]}>
            Questionnaire
          </Text>
        </Block>
        <Formik
          enableReinitialize
          initialValues={{
            questionnaires: question,
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            questionnaires: yup.array().of(
              yup.object().shape({
                answer: yup.lazy((val) =>
                  Array.isArray(val)
                    ? yup.array().of(yup.string()).required()
                    : yup.string().required(),
                ),
              }),
            ),
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
              <FieldArray
                name="questionnaires"
                render={(arrayHelpers) => (
                  <Block flex={false} padding={[0, wp(4)]}>
                    {values.questionnaires &&
                      values.questionnaires.length > 0 &&
                      values.questionnaires.map((questionnaires, index) => (
                        <>
                          {renderQuestions(index + 1, questionnaires.question)}
                          {questionnaires.type === 'number' && (
                            <TextInput
                              mode="outlined"
                              value={questionnaires.answer}
                              onChangeText={handleChange(
                                `questionnaires[${index}].answer`,
                              )}
                              onBlur={() =>
                                setFieldTouched(
                                  `questionnaires[${index}].answer`,
                                )
                              }
                              error={touched.full_name && errors.full_name}
                              placeholder={'Answer'}
                              autoCapitalize="none"
                              keyboardType={'phone-pad'}
                              disabled={
                                index === 9 &&
                                values.questionnaires[8].answer === 'false'
                              }
                              returnKeyType="next"
                            />
                          )}
                          {questionnaires.type === 'tags' && (
                            <>
                              <TextInput
                                ref={input}
                                mode="outlined"
                                value={state}
                                onBlur={() =>
                                  setFieldTouched(
                                    `questionnaires[${index}].answer`,
                                  )
                                }
                                error={touched.full_name && errors.full_name}
                                placeholder={'Answer'}
                                autoCapitalize="none"
                                keyboardType={'default'}
                                returnKeyType="next"
                                onChangeText={(text) => {
                                  setState(text);
                                  if (text.endsWith(',')) {
                                    const newText = text.replace(',', '');

                                    if (
                                      typeof questionnaires.answer ===
                                      'undefined'
                                    ) {
                                      setFieldValue(
                                        `questionnaires[${index}].answer`,
                                        [newText],
                                      );
                                    } else {
                                      setFieldValue(
                                        `questionnaires[${index}].answer`,
                                        [...questionnaires.answer, newText],
                                      );
                                    }
                                    input.current?.clear();
                                    setState('');
                                  }
                                }}
                              />
                              <HelperText>
                                Please Enter comma to add multiple
                              </HelperText>
                              <Block margin={[hp(1), 0, 0]} row flex={false}>
                                {strictValidArrayWithLength(
                                  questionnaires.answer,
                                ) &&
                                  questionnaires.answer.map((a, index) => {
                                    return (
                                      <Chip
                                        style={{marginHorizontal: wp(1)}}
                                        onPress={() => {
                                          questionnaires.answer.splice(
                                            index,
                                            1,
                                          );
                                          setFieldValue(
                                            `questionnaires[${index}].answer`,
                                            questionnaires.answer,
                                          );
                                        }}>
                                        {a || ''}
                                      </Chip>
                                    );
                                  })}
                              </Block>
                            </>
                          )}
                          {questionnaires.type === 'checkbox' && (
                            <Block flex={false} row>
                              <Checkbox.Item
                                style={defaultMargin}
                                status={
                                  questionnaires.answer === 'true'
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                label="Yes"
                                position="leading"
                                mode="android"
                                color={light.secondary}
                                onPress={() => {
                                  if (questionnaires.answer === 'false') {
                                    setFieldValue(
                                      `questionnaires[${index}].answer`,
                                      'true',
                                    );
                                  }
                                }}
                              />
                              <Checkbox.Item
                                style={defaultMargin}
                                status={
                                  questionnaires.answer === 'false'
                                    ? 'checked'
                                    : 'unchecked'
                                }
                                label="No"
                                position="leading"
                                mode="android"
                                color={light.secondary}
                                onPress={(e) => {
                                  if (questionnaires.answer === 'true') {
                                    setFieldValue(
                                      `questionnaires[${index}].answer`,
                                      'false',
                                    );
                                  }
                                }}
                              />
                            </Block>
                          )}

                          {touched.full_name &&
                            strictValidString(errors.full_name) &&
                            errorText(errors.full_name)}
                          <Block flex={false} margin={[hp(1), 0, 0]} />
                        </>
                      ))}
                  </Block>
                )}
              />
              {/* <Block padding={[0, wp(4)]}>
                {renderQuestions('1', 'How many drivers do you have?')}
                <TextInput
                  mode="outlined"
                  value={values.questionnaires[0].answer}
                  onChangeText={(e) => {
                    setFieldValue('values.questionnaires[0].answer', e);
                  }}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {renderQuestions(
                  '2',
                  'How many drivers will be providing service to MedTrans Go?',
                )}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {renderQuestions(
                  '3',
                  'How many dead miles (un-billed) are you willing to travel to pick up a passenger?',
                )}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                {renderQuestions('4', 'What counties do you service?')}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                {renderQuestions('5', 'How many total vehicles do you have?')}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                {renderQuestions(
                  '6',
                  'How many vehicles for ambulatory patients?',
                )}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                {renderQuestions(
                  '7',
                  'How many vehicles are equipped for stretchers?',
                )}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {renderQuestions(
                  '8',
                  'How many vehicles are equipped for wheelchairs?',
                )}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                {renderQuestions('9', 'Do you have your own wheelchair?')}
                <Block flex={false} row>
                  <Checkbox.Item
                    style={defaultMargin}
                    status={values.qus9 ? 'checked' : 'unchecked'}
                    label="Yes"
                    position="leading"
                    mode="android"
                    color={light.secondary}
                    onPress={() => {
                      setFieldValue('qus9', !values.qus9);
                    }}
                  />
                  <Checkbox.Item
                    style={defaultMargin}
                    status={!values.qus9 ? 'checked' : 'unchecked'}
                    label="No"
                    position="leading"
                    mode="android"
                    color={light.secondary}
                    onPress={() => {
                      setFieldValue('qus9', !values.qus9);
                    }}
                  />
                </Block>
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />

                {renderQuestions(
                  '10',
                  'How much weight does the wheel chair support (In lbs)?',
                )}
                <TextInput
                  mode="outlined"
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={() => setFieldTouched('full_name')}
                  error={touched.full_name && errors.full_name}
                  disabled={!values.qus9}
                  placeholder={'Answer'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {renderQuestions(
                  '11',
                  'Will you be providing transportation for Covid - 19 Patients?',
                )}
                <Block flex={false} row>
                  <Checkbox.Item
                    style={defaultMargin}
                    status={'checked'}
                    label="Yes"
                    position="leading"
                    color={light.secondary}
                    mode="android"
                    onPress={() => {
                      // setChecked(!checked);
                    }}
                  />
                  <Checkbox.Item
                    style={defaultMargin}
                    status={'unchecked'}
                    label="No"
                    position="leading"
                    color={light.secondary}
                    mode="android"
                    onPress={() => {
                      // setChecked(!checked);
                    }}
                  />
                </Block>
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {renderQuestions(
                  '12',
                  'Do you have the necessary PPE and supplies to protect against possible transmission of Covid-19, on each vehicle?(Gloves,face mask,sanitizer,disinfectants,etc)',
                )}
                <Block flex={false} row>
                  <Checkbox.Item
                    style={defaultMargin}
                    status={'checked'}
                    label="Yes"
                    position="leading"
                    mode="android"
                    color={light.secondary}
                    onPress={() => {
                      // setChecked(!checked);
                    }}
                  />
                  <Checkbox.Item
                    style={defaultMargin}
                    status={'unchecked'}
                    label="No"
                    position="leading"
                    mode="android"
                    color={light.secondary}
                    onPress={() => {
                      // setChecked(!checked);
                    }}
                  />
                </Block>
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />
                {renderQuestions(
                  '13',
                  'Will you be providing Rx Medication/DME Delivery service?',
                )}
                <Block flex={false} row>
                  <Checkbox.Item
                    style={defaultMargin}
                    status={'checked'}
                    label="Yes"
                    position="leading"
                    mode="android"
                    color={light.secondary}
                    onPress={() => {
                      // setChecked(!checked);
                    }}
                  />
                  <Checkbox.Item
                    style={defaultMargin}
                    status={'unchecked'}
                    label="No"
                    position="leading"
                    mode="android"
                    color={light.secondary}
                    onPress={() => {
                      // setChecked(!checked);
                    }}
                  />
                </Block>
                {touched.full_name &&
                  strictValidString(errors.full_name) &&
                  errorText(errors.full_name)}
                <Block flex={false} margin={[hp(1), 0, 0]} />


              </Block> */}
              <Block flex={false} row space={'around'}>
                <Button
                  style={{width: wp(35)}}
                  // disabled={!isValid || !dirty}
                  onPress={() => goBack()}
                  color="secondary">
                  Go back
                </Button>
                <Button
                  style={{width: wp(35)}}
                  isLoading={loading}
                  disabled={!isValid}
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

const defaultMargin = {marginLeft: -wp(4)};
export default Questionnaire;
