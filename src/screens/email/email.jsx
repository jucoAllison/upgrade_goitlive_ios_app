import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import React, {useContext} from 'react';
import Button from '../../components/button';
import {MainContext} from '../../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyCheckbox from '../../components/checkbox';

const Email = ({
  phone,
  loading,
  setPhone,
  isChecked,
  setIsChecked,
  submitPhoneHere,
}) => {
  const CTX = useContext(MainContext);


    const contactHandler = () => {
      try {
        // const url = 'mailto:help@goitlive.com';
        const url = 'https://goitlive.com/terms-and-conditions/index.html';
        Linking.canOpenURL(url)
          .then(supported => {
            if (supported) {
              return Linking.openURL(url);
            } else {
              Alert.alert('Error', 'Unable to open mail app.');
            }
          })
          .catch(err => console.error('An error occurred', err));
      } catch (error) {
        console.log('error from contactHandler =>> ', error);
      }
    };
    
      const policyHandler = () => {
        try {
          // const url = 'mailto:help@goitlive.com';
          const url = 'https://goitlive.com/privacy-policy/index.html';
          Linking.canOpenURL(url)
            .then(supported => {
              if (supported) {
                return Linking.openURL(url);
              } else {
                Alert.alert('Error', 'Unable to open mail app.');
              }
            })
            .catch(err => console.error('An error occurred', err));
        } catch (error) {
          console.log('error from contactHandler =>> ', error);
        }
      };
    


  return (
    <>
      <ImageBackground
        source={{
          uri:
            CTX.systemConfig?.loginBackgroundImageUrl ||
            'https://ik.imagekit.io/7p9j0gn28d3j/purple-blue-textured-background-wallpaper-app-background-layout-dark-gradient-colors-vintage-distressed-elegant-78118630_7FIHD2N2q.webp?updatedAt=1722595697261',
        }}
        style={styles.styleLandingLogo}>
        {/* Alert.alert(
    'Alert Title',
    'My Alert Message',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress:   
 () => console.log('OK Pressed') },
    ],
    { cancelable: false   
 }
  ); */}

        <View style={styles.coverHere}></View>
        <View
          style={{...styles.positionAbsoluteView, alignItems: 'flex-start'}}>
          <Text
            style={{
              ...styles.whatsYourNumber,
              marginBottom: 9,
              textAlign: 'left',
            }}>
            Sign in / Register
          </Text>
          <Text
            style={{
              ...styles.whatsYourNumber,
              fontWeight: '400',
              fontSize: 16,
            }}>
            Please enter a valid email address
          </Text>

          <View style={styles.textInputLinkCover}>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => showBottomSheetHandler()}
              style={{
                width: 120,
                paddingLeft: 20,
                height: '100%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={{uri: countryImg?.flags?.png}}
                style={{width: 30, height: 22}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#3b3b3b',
                  marginLeft: 'auto',
                  marginRight: 3,
                }}>
                {accType?.phone_code}
              </Text>
              <Ionicons
                size={20}
                color="#3b3b3b"
                style={{marginRight: 3}}
                name="caret-down-outline"
              />
            </TouchableOpacity> */}
            <MaterialCommunityIcons name="email" size={22} color="#3b3b3b" />

            <TextInput
              style={styles.inputTextInput}
              placeholder="Email address"
              keyboardType="email-address"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor={'#262626'}
            />
          </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginRight: 'auto',
            marginBottom: 26,
            marginTop: 17,
          }}>
          <MyCheckbox
            checked={isChecked}
            onChange={newValue => setIsChecked(newValue)}
          />
          <View style={{flexDirection: 'column', marginLeft: 8}}>
            <Text style={{fontSize: 14, color: '#fff'}}>
              {/* I agree to the{' '} */}
              By using this app, you agree to the{' '}
            </Text>
            <Text
              onPress={contactHandler}
              style={{
                fontSize: 14,
                textDecorationColor: '#fff',
                color: '#fff',
                textDecorationLine: 'underline',
              }}>
              Terms and Condition (EULA) &
              <Text
                onPress={policyHandler}
                style={{
                  textDecorationColor: '#fff',
                  textDecorationLine: 'underline',
                }}>
                {' '}
                Privacy Policy.
              </Text>
            </Text>
          </View>
        </View>

          <Button
            onPress={() => submitPhoneHere()}
            // onPress={() => createThreeButtonAlert()}
            label={
              loading ? <ActivityIndicator color="#fff" size={30} /> : 'Submit'
            }
            disable={!phone}
            style={{width: '100%', marginTop: 30, height: 50}}
          />
        </View>

      </ImageBackground>
    </>
  );
};

export default Email;

const styles = StyleSheet.create({
  styleLandingLogo: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  backTouchableOpacity: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#0a171e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    top: 20,
  },
  coverHere: {
    width: '100%',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088',
  },
  positionAbsoluteView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    padding: 20,
  },
  whatsYourNumber: {
    fontWeight: 'bold',
    marginBottom: 30,
    fontSize: 30,
    color: '#fff',
  },
  handleComponentStyle: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    backgroundColor: '#e20154',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 2,
  },
  reactionText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  showAbsolute: {
    position: 'absolute',
    // backgroundColor: '#d00',
    backgroundColor: '#00003330',
    width: '100%',
    height: '100%',
    zIndex: 2222,
  },

  closeLine: {
    position: 'absolute',
    right: 15,
    backgroundColor: '#e1e1e1',
    width: 30,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 'auto',
    justifyContent: 'center',
  },
  positionAbsolute: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  textInputLinkCover: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    paddingLeft: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    zIndex: 2000,
  },
  inputTextInput: {
    paddingLeft: 20,
    // marginLeft: 40,
    height: 50,
    color: '#3b3b3b',
    width: '100%',
    // backgroundColor: 'red',
    paddingRight: 15,
  },
  eachBtnCover: {
    backgroundColor: '#e20154',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 55,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  eachBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  coverUserCommentSection: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    marginBottom: 10,
    // paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortText: {
    color: '#111',
    fontSize: 16,
  },
  coverSearchHere: {
    backgroundColor: '#efefef',
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },

  innerTextInput: {
    width: '100%',
    color: '#262626',
    marginLeft: 10,
  },
  clickable: {
    width: 30,
    height: 30,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#9f9f9f',
    borderWidth: 2,
  },
  innerCircle: {
    width: 13,
    marginLeft: 1,
    height: 13,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});
