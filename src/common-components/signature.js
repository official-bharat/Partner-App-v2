import React, {useRef} from 'react';
import {Platform, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import SignatureScreen from 'react-native-signature-canvas';
import RNFS from 'react-native-fs';
import {light} from './theme/colors';
import RNFetchBlob from 'rn-fetch-blob';
const Sign = ({text, setScrollEnabled, saveFileLink, onClear}) => {
  const ref = useRef();

  const makeid = () => {
    var textname = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++) {
      textname += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return textname;
  };

  const imgWidth = widthPercentageToDP(90);
  const imgHeight =
    Platform.OS === 'ios' ? heightPercentageToDP(42) : heightPercentageToDP(47);
  const style = `.m-signature-pad--footer
  .button {
    background-color: #20cb8b;
  }
  .m-signature-pad--footer
  .button.save {
    display: none;
  }`;
  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    // const imageDate = signature;
    const imagePath = `${RNFS.TemporaryDirectoryPath}${makeid()}.png`;

    var Base64Code = signature.split('data:image/png;base64,'); //base64Image is my image base64 string

    RNFetchBlob.fs.writeFile(imagePath, Base64Code[1], 'base64').then((res) => {
      console.log('File : ', res);
    });

    RNFS.writeFile(imagePath, signature, 'base64').then(() => {
      saveFileLink(imagePath);
      console.log('Image converted to jpg and saved at ' + imagePath);
    });
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log('Empty');
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log('clear success!');
    onClear();
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
    //setScrollEnabled(true);
  };

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
  };

  return (
    <View
      style={{
        width: imgWidth,
        height: imgHeight,
        marginLeft: widthPercentageToDP(5),
      }}>
      <SignatureScreen
        ref={ref}
        // onEnd={handleEnd}
        onOK={handleOK}
        onEmpty={handleEmpty}
        onClear={handleClear}
        onGetData={handleData}
        autoClear={false}
        // descriptionText={text}
        bgWidth={imgWidth}
        bgHeight={imgHeight}
        webStyle={style}
        descriptionText=""
        clearText="Clear Signature"
        confirmText="Save Signature"
        onBegin={() => setScrollEnabled(false)}
        onEnd={() => handleEnd(true)}
        penColor={light.secondary}
      />
    </View>
  );
};

export default Sign;
