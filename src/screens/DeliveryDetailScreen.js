import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useContext} from 'react';
import {Alert} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Block from '../common-components/Block';
import Text from '../common-components/Text';
import Button from '../common-components/Button';
import Header from '../common-components/header';
import Sign from '../common-components/signature';
import {ComponentConstants} from '../constants/componentConstants';
import {Context} from '../constants/contextConstants';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../utils/common-utils';
import UploadSign from '../common-components/upload-sign';
import {ObjectFactory} from '../utils/objectFactory';
import {TextInput} from 'react-native-paper';
import {CommonStyles, TextInputTheme} from '../assets/styles/commonStyles';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const DeliveryDetailsScreen = () => {
  const {params} = useRoute();
  const {navigate} = useNavigation();
  const context = useContext(Context.GlobalContext);
  const {data, serviceRequest} = params;
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const [recipient_name, setRecipientName] = React.useState('');
  const [file, setFile] = React.useState([]);
  const [submitSignature, setSubmitSignature] = React.useState(false);
  const [loader, setLoader] = React.useState(false);

  const callCompleteDeliveryApi = async (uplodedFile) => {
    if (uplodedFile) {
      setLoader(true);
      const completeRequest = {
        proofOfDelivery: uplodedFile,
        recipientName: recipient_name,
      };
      const response = await ObjectFactory.getRequestService(
        context,
      ).completeRequest(serviceRequest.id, completeRequest);
      console.log(response, 'response');
      if (response.success) {
        setLoader(false);
        Alert.alert(
          'Success',
          'Delivery has been marked as completed successfully!',
        );
        navigate(ComponentConstants.DELIVERY_SCREEN_NAME, {
          status: 'Completed',
        });
      } else {
        setLoader(false);
        Alert.alert('Error', 'failed to complete the delivery');
      }
    }
  };

  return (
    <Block primary>
      <Header centerText="Complete Delivery" />
      <KeyboardAwareScrollView scrollEnabled={scrollEnabled}>
        <Block
          padding={[heightPercentageToDP(2), widthPercentageToDP(5)]}
          flex={false}>
          <TextInput
            theme={TextInputTheme}
            style={CommonStyles.textInputWithoutMargin}
            label="Recipient Name *"
            placeholder="Recipient Name *"
            value={recipient_name}
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(value) => setRecipientName(value)}
            returnKeyType={'next'}
            keyboardType="email-address"
          />
        </Block>
        <Sign
          setScrollEnabled={(e) => setScrollEnabled(e)}
          onClear={() => {
            setFile(null);
          }}
          saveFileLink={(res) => {
            setFile({uri: res, fileName: 'sign.png', type: 'image/png'});
          }}
        />
        {submitSignature && (
          <UploadSign
            file={file}
            onProgressChange={(e) => console.log(e)}
            onUploadComplete={({data}) => {
              callCompleteDeliveryApi(data.fileName);
            }}
          />
        )}
        <Block padding={[0, widthPercentageToDP(5)]} flex={false}>
          <Button
            isLoading={loader}
            disabled={
              !strictValidObjectWithKeys(file) ||
              !strictValidString(recipient_name) ||
              loader
            }
            onPress={() => {
              setSubmitSignature(true);
            }}
            color="secondary">
            Submit
          </Button>
        </Block>
        <Block padding={[0, widthPercentageToDP(5)]} flex={false}>
          <Text secondary size={14} center semibold>
            Or
          </Text>
          <Text center margin={[heightPercentageToDP(1), 0]}>
            Please click to take picture of customer address and product at
            customer’s door if unable to obtain confirmation signature.
          </Text>
          <Button
            onPress={() => {
              ImagePicker.openCamera({
                width: 300,
                height: 400,
                cropping: false,
              }).then((res) => {
                setFile({uri: res.path, fileName: 'proof.jpg', type: res.mime});
                setRecipientName(undefined);
                setSubmitSignature(true);
              });
            }}
            color="primary">
            Take a Picture And Upload
          </Button>
        </Block>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default DeliveryDetailsScreen;
