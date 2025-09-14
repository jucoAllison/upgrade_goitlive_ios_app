import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {memo, useCallback, useContext, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {MainContext} from '../../../App';
import Button from '../../components/button';
const Menu = ({profileDetails}) => {
  const CTX = useContext(MainContext);
  const navigation = useNavigation();
  const [isModal, setIsModal] = useState(false);

  const contactHandler = () => {
    try {
      // const url = 'mailto:help@goitlive.com';
      const url = 'https://goitlive.com/contact.html';
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal}
        onRequestClose={() => setIsModal(!isModal)}>
        <Pressable style={styles.anocenteredView}>
          <View style={{...styles.anomodalView}}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                }}>
                <TouchableOpacity
                  onPress={() => setIsModal(false)}
                  activeOpacity={0.8}
                  style={{marginLeft: 'auto', marginBottom: 10}}>
                  <Ionicons name="close" size={26} color="#00000085" />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                Confirm Logout
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Are you sure you want to log out? Click Continue to proceed.
              </Text>

              <Button
                onPress={() => {
                  CTX.logoutUser();
                }}
                label={'Continue'}
                style={{width: '100%', marginTop: 30, height: 50}}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      <BottomSheetScrollView style={{width: '100%', height: '100%'}}>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SettingsScreen')}
            style={styles.coverUserCommentSection}>
            <Feather name="settings" size={20} color="#3b3b3b" />
            <Text style={styles.sortText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.coverUserCommentSection}>
            <MaterialIcons name="edit-road" size={20} color="#3b3b3b" />
            <Text style={styles.sortText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ManageFunds')}
            style={styles.coverUserCommentSection}>
            <FontAwesome name="money" size={20} color="#3b3b3b" />
            <Text style={styles.sortText}>Manage funds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ExternalLink')}
            style={styles.coverUserCommentSection}>
            <Feather name="external-link" size={20} color="#3b3b3b" />
            <Text style={styles.sortText}>Add external link</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('CaringSection', {
                username: profileDetails?.username,
                isCaring: true,
                _id: profileDetails?._id,
                caring: profileDetails?.caring,
                cared: profileDetails?.cared,
              })
            }
            style={styles.coverUserCommentSection}>
            <MaterialCommunityIcons
              name="account-arrow-right-outline"
              size={20}
              color="#3b3b3b"
            />
            <Text style={styles.sortText}>Accounts you care for</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.coverUserCommentSection}
            onPress={() => navigation.navigate('ToggleActivityStatus')}>
            <Feather name="activity" size={20} color="#3b3b3b" />
            <Text style={styles.sortText}>Activity Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={contactHandler}
            style={styles.coverUserCommentSection}>
            <FontAwesome name="support" size={20} color="#3b3b3b" />
            <Text style={styles.sortText}>Contact support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={() => CTX.logoutUser()}
            onPress={() => setIsModal()}
            style={{
              ...styles.coverUserCommentSection,
              borderBottomColor: '#fff',
            }}>
            <MaterialIcons name="logout" size={20} color="blue" />
            <Text style={{...styles.sortText, color: 'blue'}}>Logout</Text>
          </TouchableOpacity>
          <View style={{height: 30, width: '100%'}}></View>
        </View>
      </BottomSheetScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginVertical: 5,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#d1d1d1',
    borderBottomWidth: 1,
  },

  sortText: {
    color: '#3b3b3b',
    fontFamily: 'Gilroy-Regular',
    marginLeft: 10,
    fontSize: 16,
  },
  clickable: {
    width: 36,
    height: 36,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: '#d1d1d1',
    borderWidth: 1,
  },
  innerCircle: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 30,
  },

  anomodalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 7,
    // height: "90%",
    padding: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  anocenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    // marginTop: 22,
    backgroundColor: '#00000066',
  },
});
export default memo(Menu);
