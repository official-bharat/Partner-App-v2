import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Alert, Platform} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Block from './Block';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
} from '../utils/common-utils';
import {ObjectFactory} from '../utils/objectFactory';
import {CommonConstants} from '../constants/commonConstants';
const AppConstant = require('../../app.json');

const UploadFile = ({
  children,
  file: selectedfile,
  onUploadComplete,
  onProgressChange,
}) => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progress, setProgress] = useState(-1);
  const navigation = useNavigation();

  useEffect(() => {
    if (strictValidObjectWithKeys(selectedfile)) {
      setFiles((prevState) => [selectedfile]);
    }
  }, [selectedfile]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setUploadedFiles([]);
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (progress >= 0 && progress < 100) {
      onProgressChange(true);
    } else {
      onProgressChange(false);
    }
  }, [progress]);
  const upload = async (index = 0) => {
    if (strictValidArrayWithLength(files)) {
      const file = files[index];
      const {uri} = file;
      const idToken = await ObjectFactory.getCacheService().getValue(
        CommonConstants.TOKEN_FIELD_NAME,
      );
      const deviceId = await ObjectFactory.getCacheService().getValue(
        CommonConstants.DEVICE_ID_FIELD_NAME,
      );
      // const parsedToken = JSON.parse(token);
      const uriParts = uri.split('.');
      const filename = uriParts[uriParts.length - 1];
      const date = new Date();
      const tempPath = `${
        RNFS.DocumentDirectoryPath
      }/${date.getMilliseconds()}${date.getHours()}`;
      await RNFS.copyFile(uri, tempPath);

      const fileExist = await RNFS.exists(tempPath);

      if (!fileExist) {
        Alert.alert('does not exist!');
        return false;
      }
      const _headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${idToken}`,
        origin: deviceId,
      };
      let res = {};

      res = await RNFetchBlob.fetch(
        'POST',
        `${AppConstant.serverUrl}/v1/resources`,
        _headers,
        [
          {
            name: 'file',
            filename: Platform.OS === 'ios' ? `photo.${filename}` : file.name,
            type: file.type,
            data: RNFetchBlob.wrap(tempPath),
          },
        ],
      )
        .uploadProgress({count: 10}, (written, total) => {
          const percent_completed = (written / total) * 100;
          setProgress(percent_completed);
        })
        .catch((err) => {
          console.log(err);
        });
      const val = await JSON.parse(res.data);
      onUploadComplete(val);
      setUploadedFiles(() => [val]);
      setProgress(98);
      setTimeout(() => {
        setProgress(100);
      }, 1000);
      return val;
    }
  };

  useEffect(() => {
    upload();
  }, [files]);

  useEffect(() => {
    const context = ObjectFactory.getContext();
    if (progress > 1 && progress !== 100) {
      context.showLoader(true);
    } else {
      context.showLoader(false);
    }
  }, [progress]);

  return (
    <>
      {/* {progress === 100 && <UploadProgress />} */}
      <Block blackColor flex={false}>
        {children}
      </Block>
    </>
  );
};

UploadFile.propTypes = {
  children: PropTypes.shape(PropTypes.object).isRequired,
  file: PropTypes.shape(PropTypes.object).isRequired,
  onUploadComplete: PropTypes.func.isRequired,
  onProgressChange: PropTypes.func.isRequired,
};

export default UploadFile;
