import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';

const AmassPics = ({mappedVideos, userID}) => {
  const navigation = useNavigation();

  const onPressSomething = () => {

    try {
       // selecting img

    // ImagePicker.launchImageLibrary(
    //   {
    //     mediaType: 'image',
    //     quality: 1,
    //     selectionLimit: 1,
    //     presentationStyle: 'pageSheet',
    //     includeExtra: true,
    //   },
    //   response => {
    //     if (response.assets) {
    //       if (response.assets[0]?.type?.includes('image')) {
    //         ImageCropPicker.openCropper({
    //           path: response.assets[0]?.uri,
    //           width: 1600,
    //           height: 1600,
    //           cropping: true,
    //         }).then(image => {

    // ImagePicker.launchImageLibrary(
    //   {
    //     mediaType: 'image',
    //     quality: 1,
    //     selectionLimit: 1,
    //     presentationStyle: 'pageSheet',
    //     includeExtra: true,
    //   },
    //   response => {
    //     if (response.assets) {
    //       if (response.assets[0]?.type?.includes('image')) {
      ImageCropPicker.openPicker({
        // path: response.assets[0]?.uri,
        cropping: true,
        croppingStyle: 'manual', // Enable free-form cropping
    freeStyleCropEnabled: true,
        // multiple: true

      }).then(image => {

              // console.log("onPressSomething called HERE!!");
              // console.log("onPressSomething called HERE!! ==>> ", image);
              // console.log("onPressSomething called HERE!!");

              // {"fileName": "1EF10A53-4B0F-483D-906F-E12AFBAE5B06.jpg", "fileSize": 993045, "height": 2500, "id": "99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7/L0/001", "timestamp": "2012-08-08T22:29:49.800+0100", "type": "image/jpg", "uri": "file:///Users/juco/Library/Developer/CoreSimulator/Devices/40B8BCEE-0D19-45AE-AF7D-15542707EE73/data/Containers/Data/Application/920D8576-7F74-488C-89CD-32E2056D855E/tmp/1EF10A53-4B0F-483D-906F-E12AFBAE5B06.jpg", "width": 1668}

              // {"creationDate": "1344462930", "cropRect": null, "data": null, "duration": null, "exif": null, "filename": "IMG_0005.JPG", "height": 2002, "localIdentifier": "ED7AC36B-A150-4C38-BB8C-B6D696F4F2ED/L0/001", "mime": "image/jpeg", "modificationDate": "1441224148", "path": "/Users/juco/Library/Developer/CoreSimulator/Devices/40B8BCEE-0D19-45AE-AF7D-15542707EE73/data/Containers/Data/Application/920D8576-7F74-488C-89CD-32E2056D855E/tmp/react-native-image-crop-picker/57E82777-FFFE-4D88-AE41-6AC8F4A3F31E.jpg", "size": 1544169, "sourceURL": "file:///Users/juco/Library/Developer/CoreSimulator/Devices/40B8BCEE-0D19-45AE-AF7D-15542707EE73/data/Media/DCIM/100APPLE/IMG_0005.JPG", "width": 3000}

              navigation.navigate('PostAmass', {
                amass:
                // {
                //   ...image,
                //   type: image?.mime,
                //   name: image?.filename,
                //   uri: image?.path,
                //   folder: 'amass__photo',
                // },

                {
                  ...image,
                  type: image?.mime,
                  name: image?.path.split('/').pop(),
                  // uri: image?.sourceURL,
                  uri: image?.path,
                  width: image.width,
                  folder: 'amass_post',
                }
              });
            });
            // return;
    //       }
    //       return;
    //     }
    //   },
    // );
    } catch (error) {
      console.log("error from onPressSomething =>>> ");
      console.log("error from onPressSomething =>>> ");
      console.log("error from onPressSomething =>>> ");
      console.log("error from onPressSomething =>>> ", error);
      console.log("error from onPressSomething =>>> ");
      console.log("error from onPressSomething =>>> ");
      console.log("error from onPressSomething =>>> ");
    }

  };

  // const onPressSomething = async () => {
  //   ImageCropPicker.openPicker({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //   })
  //     .then(image => {
  //       console.log(image);
  //     })
  //     .catch(e => {
  //       alert(e);
  //     });
  // };

  return (
    <>
      <View style={{...styles.app, flexDirection: 'row', flexWrap: 'wrap'}}>
        {mappedVideos}
        {!userID && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressSomething}
            style={styles.plusSomethingHere}>
            <Feather name="plus" size={54} color="#443344" />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default AmassPics;

const styles = StyleSheet.create({
  itemVideoHere: {
    flex: 1,
    minWidth: '33.3%', // 100% devided by the number of rows you want
    alignItems: 'center',
    height: 200,
    // backgroundColor: 'rgba(249, 180, 45, 0.25)',
    backgroundColor: '#443344',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  plusSomethingHere: {
    flex: 1,
    maxWidth: '33.3%', // 100% devided by the number of rows you want
    minWidth: '33.3%', // 100% devided by the number of rows you want
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    // backgroundColor: 'rgba(249, 180, 45, 0.25)',
    // backgroundColor: '#443344',
    borderWidth: 4.5,
    borderColor: '#443344',
  },
});
