import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Block from '../../../../common-components/Block';
import Text from '../../../../common-components/Text';
import {FieldArray, Formik} from 'formik';
import {TextInput} from 'react-native-paper';
import Button from '../../../../common-components/Button';
import {
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {LoginStyles} from '../../../../assets/styles/loginStyles';
import {logo} from '../../../../assets/styles/commonStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {ComponentConstants} from '../../../../constants/componentConstants';
import UploadFile from '../../../../common-components/upload-file';
import DocumentPicker from 'react-native-document-picker';
import * as yup from 'yup';
import {CommonUtils} from '../../../../utils/commonUtils';
import {apiCall} from '../../../../utils/api-client';
import {ObjectFactory} from '../../../../utils/objectFactory';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../../utils/common-utils';
import ImagePicker from 'react-native-image-crop-picker';
const Certificates = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const formmikRef = useRef();
  const [name, setName] = useState('');
  const {params} = useRoute();
  const {transporterProfile, data} = params;

  const [documents, setDocuments] = useState([
    {
      name: 'Articles of Incorporation',
      resourceId: '',
      filename: '',
      description: 'Business Registration from State',
    },
    {
      name: 'Owners DL',
      resourceId: '',
      filename: '',
      description: "Registered business owner's DL",
    },
    {
      name: 'Service Agreement',
      resourceId: '',
      filename: '',
      description: 'Service Agreement',
    },
    {
      name: 'Hipaa Subcontractor Agreement',
      resourceId: '',
      filename: '',
      description: 'Hipaa Subcontractor Agreement',
    },
    {
      name: 'Form W-9',
      resourceId: '',
      filename: '',
      description: 'Form W-9',
    },
    {
      name: 'SS-4',
      resourceId: '',
      filename: '',
      description:
        'SS-4 - For verification of Employee Identification Number (EIN)/Tax ID Number',
    },
    {
      name: 'Certificate of Insurance',
      resourceId: '',
      filename: '',
      description:
        'Certificate of Insurance with a minimum of $500K Policy Limitss',
    },
    {
      name: 'Vehicle Schedule',
      resourceId: '',
      filename: '',
      description: 'Vehicle Schedule from Insurance Company',
    },
    {
      name: 'Attestation Statement',
      resourceId: '',
      filename: '',
      description: 'Attestation Statement',
    },
    {
      name: 'NEMTAC',
      resourceId: '',
      filename: '',
      description:
        'Non Emergency Medical Transportation Accreditation Commission',
    },
  ]);

  useEffect(() => {
    if (
      strictValidObjectWithKeys(transporterProfile) &&
      strictValidArrayWithLength(transporterProfile.documents)
    ) {
      transporterProfile.documents.forEach((element) => {
        const index = documents.findIndex((element2) => {
          return element2.name === element.name;
        });
        if (index >= 0) {
          documents[index].resourceId = element.resourceId;
          documents[index].filename = element.filename;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (values) => {
    setLoading(true);
    const arrayData = [];
    values.documents.map((a) => {
      if (strictValidString(a.resourceId)) {
        arrayData.push({
          name: a.name,
          resourceId: a.resourceId,
          filename: a.filename,
          description: a.description,
        });
      }
    });
    const updateUserRequest = {
      transporterProfile: {
        ...data,
        documents: arrayData,
      },
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
        CommonUtils.showConfirmation(
          'Your registration has been completed and submitted for verification. Your account will be activated by the MedTransGo operations team.',
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

  // const UpdateDocs = async (values) => {
  //   const arrayData = [];
  //   values.documents.map((a) => {
  //     if (strictValidString(a.resourceId)) {
  //       arrayData.push({
  //         name: a.name,
  //         resourceId: a.resourceId,
  //         filename: a.filename,
  //         description: a.description,
  //       });
  //     }
  //   });
  //   const updateUserRequest = {
  //     transporterProfile: {
  //       documents: arrayData,
  //     },
  //   };
  //   const sessionInfo = await ObjectFactory.getCacheService().getSessionInfo();
  //   try {
  //     const res = await apiCall(
  //       'PUT',
  //       `/v1/partners/${sessionInfo.userId}/profile`,
  //       updateUserRequest,
  //     );
  //     if (res) {
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     CommonUtils.showError(error.data);
  //   }
  // };
  const renderQuestions = (qus) => {
    return (
      <Text margin={[hp(1.5), 0, 0]} height={20} size={16} medium>
        {qus}
      </Text>
    );
  };
  const openCamera = (index) => {
    // launchCamera(
    //   {
    //     mediaType: 'photo',
    //     includeBase64: true,
    //     quality: 0.7,
    //   },
    //   (res) => {
    //     if (res.size > '5000000') {
    //       showAlert('you can upload file max 5 mb');
    //     } else if (uploadedFiles.length >= 5) {
    //       showAlert('you can upload 5 files at one time');
    //     } else {
    //       setFiles(res);
    //     }
    //   },
    // );
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((res) => {
      var getFilename = res.path.split('/');
      const imgName = getFilename[getFilename.length - 1];
      formmikRef.current?.setFieldValue(
        `documents[${index}].filename`,
        imgName,
      );
      formmikRef.current?.setFieldValue('file', res);
    });
  };

  const requestCameraPermission = async (type) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Clique App Camera Permission',
          message:
            'Clique App App needs access to your camera features ' +
            'so you can access the camera features.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openCamera();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          "You can't acess the camera features. Please give access to Camera service from the app settings",
        );
        setTimeout(() => {
          Linking.openSettings();
        }, 2000);
      } else {
        console.log('never ask again 2');
        Alert.alert(
          "You can't acess the camera features. Please give access to Camera service",
        );
        requestCameraPermission();
        console.log('Location permission denied');
      }
    } catch (err) {
      console.log('never ask again 3', err);
      console.warn(err);
    }
  };

  const btnSelectImage = (index) => {
    selectMultipleFile(index);
    // Alert.alert(
    //   'MedTransGo',
    //   'Choose your Suitable Option',
    //   [
    //     // {
    //     //   text: 'Camera',
    //     //   onPress: () => {
    //     //     Platform.OS === 'ios'
    //     //       ? openCamera(index)
    //     //       : requestCameraPermission(index);
    //     //   },
    //     // },
    //     {
    //       text: 'File',
    //       onPress: () => {
    //         selectMultipleFile(index);
    //       },
    //     },
    //     {
    //       text: 'Cancel',
    //       style: 'destructive',
    //     },
    //   ],
    //   {cancelable: true},
    // );
  };

  const selectMultipleFile = async (index) => {
    // Opening Document Picker for selection of multiple file

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        // There can me more options as well find above
      });
      // Setting the state to show multiple file attributes
      formmikRef.current?.setFieldValue(
        `documents[${index}].filename`,
        result[0].name,
      );
      formmikRef.current?.setFieldValue('file', result[0]);
    } catch (err) {
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
      } else {
        // For Unknown Error
        throw err;
      }
    }
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
            Upload Documents
          </Text>
        </Block>
        <Formik
          innerRef={formmikRef}
          enableReinitialize
          initialValues={{
            documents: documents,
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            documents: yup.array().of(
              yup.object().shape({
                resourceId: yup.string().min(1).required(),
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
            <Block flex={1} padding={[0, wp(4)]}>
              <FieldArray
                name="documents"
                render={(arrayHelpers) => (
                  <Block flex={false}>
                    {values.documents &&
                      values.documents.length > 0 &&
                      values.documents.map((docs, index) => (
                        <>
                          {renderQuestions(docs.name)}
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              btnSelectImage(index);
                              setName(index);
                            }}>
                            <TextInput
                              mode="outlined"
                              value={docs.filename}
                              placeholder="No File Selected"
                              editable={false}
                              multiline
                              // numberOfLines={1}
                              onTouchEnd={() => {
                                btnSelectImage(index);
                                setName(index);
                              }}
                            />
                          </TouchableOpacity>
                          {index === name && (
                            <UploadFile
                              file={values.file}
                              onProgressChange={(v) => console.log(v)}
                              onUploadComplete={(data) => {
                                // UpdateDocs(values);
                                setFieldValue(
                                  `documents[${index}].resourceId`,
                                  data.data.fileName,
                                );
                                // setUploadedFiles(file);
                                // setField(data.uplod_file);
                              }}
                            />
                          )}

                          <Block flex={false} margin={[hp(1), 0, 0]} />
                        </>
                      ))}
                  </Block>
                )}
              />

              <Block padding={[0, wp(4)]}>
                <Block flex={false} row space={'around'}>
                  <Button
                    style={{width: wp(35)}}
                    // disabled={!isValid || !dirty}
                    onPress={() => navigation.goBack()}
                    color="secondary">
                    Go back
                  </Button>
                  <Button
                    style={{width: wp(35)}}
                    isLoading={loading}
                    disabled={!isValid}
                    onPress={handleSubmit}
                    color="secondary">
                    Complete
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

const defaultMargin = {marginLeft: -wp(4)};
export default Certificates;
