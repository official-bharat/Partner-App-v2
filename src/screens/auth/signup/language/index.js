import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Block from '../../../../common-components/Block';
import Text from '../../../../common-components/Text';
import {FieldArray, Formik} from 'formik';
import {Appbar, Divider, Menu, TextInput} from 'react-native-paper';
import Button from '../../../../common-components/Button';
import {Image, TouchableOpacity} from 'react-native';
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
import {InterpretationStyles} from '../../../../assets/styles/interpretationStyles';
import {ColorConstants} from '../../../../constants/colorConstants';
import {IconConstants} from '../../../../constants/iconConstants';

const LanguageCertificates = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const formmikRef = useRef();
  const [name, setName] = useState('');
  const {params} = useRoute();
  const {transporterProfile, data} = params;
  const [languages, setLanguages] = useState([]);
  const [chooseLanguage, setChooseLanguage] = useState('');
  const [file, setFile] = useState({});
  const [uploadedFile, setUploadedFile] = useState('');
  const [fileName, setFileName] = useState({});
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const callLanguageApi = async () => {
    try {
      const res = await apiCall('GET', '/v1/languages');
      setLanguages(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    callLanguageApi();
  }, []);

  useEffect(() => {
    if (
      strictValidObjectWithKeys(transporterProfile) &&
      strictValidArrayWithLength(transporterProfile.languages)
    ) {
      setChooseLanguage({
        id: transporterProfile.languages[0].languageId,
        name: transporterProfile.languages[0].languageName,
      });
      setUploadedFile(
        transporterProfile.languages[0].certificates[0].certificateId,
      );
      setFileName(transporterProfile.languages[0].certificates[0]);
    }
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);
    const languageData = [
      {
        certificates: [
          {
            certificateId: uploadedFile,
            name: fileName.name,
          },
        ],
        languageId: chooseLanguage.id,
      },
    ];

    const updateUserRequest = {
      interpreterProfile: {
        languages: languageData,
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
        if (transporterProfile.transporterId) {
          navigation.navigate(ComponentConstants.QUESTIONNAIRE_SCREEN_NAME, {
            transporterProfile: transporterProfile,
            data: data,
          });
        } else {
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
      }
    } catch (error) {
      setLoading(false);
      CommonUtils.showError(error.data);
    }
  };
  const renderQuestions = (qus) => {
    return (
      <Text margin={[hp(1.5), 0, 0]} height={20} size={16} medium>
        {qus}
      </Text>
    );
  };

  const selectMultipleFile = async (index) => {
    // Opening Document Picker for selection of multiple file

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        // There can me more options as well find above
      });
      // Setting the state to show multiple file attributes

      setFile(result[0]);
      setFileName(result[0]);
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
  const changeOption = (res) => {
    setChooseLanguage(res);
    closeMenu();
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
            Upload Certificates
          </Text>
        </Block>
        <Block flex={false} padding={[0, wp(4)]}>
          <TouchableOpacity
            style={[
              InterpretationStyles.menuView,
              {
                justifyContent: 'space-between',
                height: heightPercentageToDP(5),
                width: widthPercentageToDP(90),
                marginRight: 0,
                marginVertical: heightPercentageToDP(1),
              },
            ]}
            onPress={() => openMenu()}>
            <Text margin={[0, widthPercentageToDP(3)]}>
              {chooseLanguage?.name || 'Select Language'}
            </Text>
            <Menu
              style={{width: widthPercentageToDP(90)}}
              onDismiss={() => closeMenu()}
              visible={visible}
              anchor={
                <Appbar.Action
                  style={InterpretationStyles.menuAction}
                  color={ColorConstants.GREEN}
                  icon={IconConstants.MENU_DOWN}
                  // onPress={() => this.setState({openMenu: true})}
                  size={IconConstants.ICON_SIZE_30}
                />
              }>
              {languages.map((a) => {
                return (
                  <>
                    <Menu.Item
                      contentStyle={{width: widthPercentageToDP(100)}}
                      title={a.name}
                      onPress={() => {
                        changeOption(a);
                      }}
                    />
                    <Divider />
                  </>
                );
              })}
            </Menu>
          </TouchableOpacity>
          {renderQuestions('Upload Certificates')}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              selectMultipleFile();
            }}>
            <TextInput
              mode="outlined"
              value={fileName.name}
              placeholder="No File Selected"
              editable={false}
              multiline
              // numberOfLines={1}
              onTouchEnd={() => {
                selectMultipleFile();
              }}
            />
          </TouchableOpacity>

          <UploadFile
            file={file}
            onProgressChange={(v) => console.log(v)}
            onUploadComplete={(data) => {
              // UpdateDocs(values);
              setUploadedFile(data.data.fileName);
              // setUploadedFiles(file);
              // setField(data.uplod_file);
            }}
          />
        </Block>
      </KeyboardAwareScrollView>
      <Block flex={false} padding={[0, wp(4)]}>
        <Block flex={false} row space={'around'}>
          <Button
            style={{width: wp(35)}}
            onPress={() => navigation.goBack()}
            color="secondary">
            Go back
          </Button>
          <Button
            style={{width: wp(35)}}
            isLoading={loading}
            disabled={!chooseLanguage || !uploadedFile}
            onPress={onSubmit}
            color="secondary">
            {transporterProfile.transporterId ? 'Save and Next' : 'Complete'}
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default LanguageCertificates;
