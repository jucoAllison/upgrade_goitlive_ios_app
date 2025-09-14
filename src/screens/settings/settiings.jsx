import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import {useNavigation, useIsFocused} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './settiings.styles';
import {MainContext} from '../../../App';
import Button from '../../components/button';
import { useWebSocket } from '../../../WebSocketContext';

const Settiings = () => {
  const CTX = useContext(MainContext);
  const navigator = useNavigation();
  const isFocused = useIsFocused();
  const [isModal, setIsModal] = useState(false);
    const {latestMessage, connectionStatus} = useWebSocket();
    const [profileDetails, setProfileDetails] = useState(null);
  
    useEffect(() => {
      // getUserDetails();
      // setProfileDetails(profileData);
      if (latestMessage) {
        setProfileDetails(latestMessage);
      }
    }, [latestMessage]);
  

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

  const blockHandler = () => {
    if (profileDetails?.blocked?.length < 1) {
      return null;
    }
    navigator.navigate('BlockedAccount');
  };

  useEffect(() => {
    if (isFocused) {
      CTX.setStatusBarColor('#fff');
    }
  }, [isFocused]);

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
                  activeOpacity={0.8}
                    onPress={() => setIsModal(false)}
                  style={{marginLeft: 'auto', marginBottom: 10}}>
                  <Ionicons
                    name="close"
                    size={26}
                    color="#00000085"
                  />
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

      <ScrollView
        style={styles.containerCover}
        contentInsetAdjustmentBehavior="automatic">
        <StatusBar
          animated={true}
          backgroundColor={CTX.statusBarColor}
          // hidden={true}
          barStyle="dark-content"
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigator.navigate('TogglePublishLive')}
          style={styles.coverUserCommentSection}>
          <MaterialCommunityIcons name="publish" size={20} color={'#3b3b3b'} />
          <Text style={styles.sortText}>Publish live</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigator.navigate('RequestNewBackup')}
          style={styles.coverUserCommentSection}>
          <MaterialCommunityIcons name="login" size={20} color="#3b3b3b" />
          <Text style={styles.sortText}>Request new backup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigator.navigate('ExternalLink')}
          style={styles.coverUserCommentSection}>
          <Feather name="external-link" size={20} color="#3b3b3b" />
          <Text style={styles.sortText}>External link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigator.navigate('TogglePrivacyStatus')}
          style={styles.coverUserCommentSection}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={20}
            color="#3b3b3b"
          />
          <Text style={styles.sortText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigator.navigate('ToggleActivityStatus')}
          style={styles.coverUserCommentSection}>
          <Feather name="activity" size={20} color="#3b3b3b" />
          <Text style={styles.sortText}>Activity status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigator.navigate('ToggleShowHint')}
          style={styles.coverUserCommentSection}>
          <Feather name="alert-octagon" size={20} color="#3b3b3b" />
          <Text style={styles.sortText}>Show hint</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigator.navigate('EventAmassCenter')}
          style={styles.coverUserCommentSection}>
          <Feather name="align-center" size={20} color="#3b3b3b" />
          <Text style={styles.sortText}>Amass center</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={blockHandler}
          style={styles.coverUserCommentSection}>
          <Entypo name="block" size={20} color="#3b3b3b" />

          <Text style={styles.sortText}>Blocked</Text>
          <Text
            style={{
              ...styles.sortText,
              marginLeft: 'auto',
              fontSize: 13,
              color: '#909090',
            }}>
            {profileDetails?.blocked?.length < 1
              ? 'none'
              : profileDetails?.blocked?.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={contactHandler}
          style={styles.coverUserCommentSection}>
          <FontAwesome name="support" size={20} color="#3b3b3b" />
          <Text style={styles.sortText}>Contact support</Text>
        </TouchableOpacity>

        <Text style={styles.smallFollowing}>Danger Zone</Text>

        {/* {profileDetails?.hasAmass && !profileDetails?.is_deleting_amass && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigator.navigate('DeleteAmassAccount')}
            style={{
              ...styles.coverUserCommentSection,
              borderBottomColor: '#fff',
            }}>
            <Feather name="delete" size={20} color="#d00" />
            <Text style={{...styles.sortText, color: '#d00'}}>
              Delete amass account
            </Text>
          </TouchableOpacity>
        )} */}

        {profileDetails?.private_life && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigator.navigate('DeletePrivateAccount')}
            style={{
              ...styles.coverUserCommentSection,
              borderBottomColor: '#fff',
            }}>
            <Octicons name="repo-deleted" size={20} color="#d00" />
            <Text style={{...styles.sortText, color: '#d00'}}>
              Delete private account
            </Text>
          </TouchableOpacity>
        )}

        {!profileDetails?.is_deleting_account && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigator.navigate('DeleteAccount')}
            style={{
              ...styles.coverUserCommentSection,
              borderBottomColor: '#fff',
            }}>
            <MaterialCommunityIcons
              name="delete-alert-outline"
              size={20}
              color="#d00"
            />
            <Text style={{...styles.sortText, color: '#d00'}}>
              Delete account
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
            onPress={() => setIsModal()}

          style={{
            ...styles.coverUserCommentSection,
            borderBottomColor: '#fff',
          }}>
          <MaterialIcons name="logout" size={20} color="#d00" />
          <Text style={{...styles.sortText, color: '#d00'}}>Logout</Text>
        </TouchableOpacity>
        <View style={{height: 30}}></View>
      </ScrollView>
    </>
  );
};

export default Settiings;
