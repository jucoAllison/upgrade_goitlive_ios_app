import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useContext} from 'react';


import styles from './requestVerification.styles';
import {MainContext} from '../../../App';
const RequestVerification = ({
  full_name,
  setFull_name,
  youtube,
  documentFileHere,
  details,
  selectImageHandler,
  setYoutube,
  showBottomSheetHandler,
  country,
  setCountry,
  category,
  setCategory,
  aka,
  setAka,
  link,
  linkk,
  linkkk,
  linkkkk,
  setLink,
  setLinkk,
  setLinkkk,
  setLinkkkk,
  isFoundDetails,
  submitForVerificaction,
  loading,
  checkVerificaction,
  createThreeButtonAlert,
}) => {
  const CTX = useContext(MainContext);
  const [refreshing, setRefreshing] = React.useState(false);
  // console.log('documentFileHere !! =>>>', documentFileHere);
  var maxLength = 43;
  var result = documentFileHere?.uri?.substring(0, maxLength) + '...';

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    checkVerificaction().then(() => setRefreshing(false));
  }, []);

  return (
    <>
      {CTX.userObj?.verify && (
        <View style={styles.isVerified}>
          <Text style={styles.isVerifiedText}>
            This account has been verified
          </Text>
        </View>
      )}

      {CTX.userObj?.hasAppliedForVerification && !isFoundDetails && (
        <View style={{...styles.isVerified, backgroundColor: '#9e005d'}}>
          <Text style={styles.isVerifiedText}>Verification declined</Text>
        </View>
      )}

      {CTX.userObj?.hasAppliedForVerification && isFoundDetails && (
        <View style={{...styles.isVerified, backgroundColor: '#077e8c'}}>
          <Text style={styles.isVerifiedText}>Verification pending</Text>
        </View>
      )}

      <ScrollView
        style={styles.containerCover}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{paddingHorizontal: 20}}>
          <Text style={styles.commentOwner}>
            Apply for GoItLive Verification
          </Text>
          <Text
            style={{
              ...styles.upperText,
              fontSize: 16,
              marginTop: 10,
              textAlign: 'center',
            }}>
            Verified accounts have checkmarks
            <MaterialIcons
              style={{paddingTop: 12}}
              name="verified"
              color="#91ff91"
              size={17}
            />
            {}
            next to their names to show that Goit Live has confirmed they are
            real presence of the public figures, celebrities, and brands they
            represent
          </Text>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <Text
            style={{...styles.commentOwner, fontSize: 17, textAlign: 'left'}}>
            Step 1: confirm authenticity
          </Text>
          <Text
            style={{
              ...styles.upperText,
              fontSize: 16,
              marginTop: 10,
            }}>
            Add an official identification document for yourself or your
            business
          </Text>

          <Pressable
            style={{...styles.eachNameCover, backgroundColor: '#dddddd49'}}>
            <Text style={{...styles.upperText, fontSize: 13}}>Username</Text>
            <View style={styles.viewCover}>
              <Text style={{...styles.mainText, color: '#9f9f9f'}}>
                {CTX.userObj.username}
              </Text>
            </View>
          </Pressable>

          <Pressable style={styles.eachNameCover}>
            <Text style={{...styles.upperText, fontSize: 13}}>Full name</Text>
            <View style={styles.viewCover}>
              <TextInput
                style={styles.mainText}
                value={full_name}
                onChangeText={setFull_name}
                placeholderTextColor="#3b3b3b"
                placeholder={'Full name'}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={showBottomSheetHandler}
            style={styles.linkSection}>
            <Text style={styles.upperText}>Document type</Text>

            <Text
              style={{
                fontSize: 14,
                color: '#9f9f9f',
                marginTop: 8,
                marginLeft: 'auto',
              }}>
              {details}
            </Text>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={28}
              style={{
                marginTop: 8,
              }}
              color="#9f9f9f"
            />
          </Pressable>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if(details){
                
                selectImageHandler()
              } else {
                createThreeButtonAlert("Select document type")
              }
            }}
            style={{paddingTop: 20}}>
            <View style={{...styles.eachBtnCover, height: 40}}>
              <Text style={styles.eachBtnText}>Choose file</Text>
            </View>
          </TouchableOpacity>

          <Text style={{...styles.comment, fontSize: 15, marginTop: 5}}>
            {documentFileHere && result}
          </Text>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <Text
            style={{...styles.commentOwner, fontSize: 17, textAlign: 'left'}}>
            Step 2: confirm notability
          </Text>
          <Text
            style={{
              ...styles.upperText,
              fontSize: 16,
              marginTop: 10,
            }}>
            Show that the public figure, celebrity, or brand your account
            represents is in the public interest.
          </Text>

          <Pressable style={styles.eachNameCover}>
            <Text style={{...styles.upperText, fontSize: 13}}>
              Country/region
            </Text>
            <View style={styles.viewCover}>
              <TextInput
                style={styles.mainText}
                value={country}
                onChangeText={setCountry}
                placeholder="Your country"
                placeholderTextColor="#3b3b3b"
              />
            </View>
          </Pressable>

          <Pressable style={styles.eachNameCover}>
            <Text style={{...styles.upperText, fontSize: 13}}>Occupation</Text>
            <View style={styles.viewCover}>
              <TextInput
                style={styles.mainText}
                value={category}
                onChangeText={setCategory}
                placeholder="Your occupation"
                placeholderTextColor="#3b3b3b"
              />
            </View>
          </Pressable>

          <Pressable style={styles.eachNameCover}>
            <Text style={{...styles.upperText, fontSize: 13}}>
              Also know as (optional)
            </Text>
            <View style={styles.viewCover}>
              <TextInput
                style={styles.mainText}
                value={aka}
                onChangeText={setAka}
                placeholder={'Other names'}
                placeholderTextColor="#3b3b3b"
              />
            </View>
          </Pressable>
        </View>

        <View style={{paddingHorizontal: 20, marginBottom: 20}}>
          <Text
            style={{...styles.commentOwner, fontSize: 17, textAlign: 'left'}}>
            Links (optional)
          </Text>
          <Text
            style={{
              ...styles.upperText,
              fontSize: 16,
              marginTop: 10,
            }}>
            Prior to links, make sure your profile links are setup already. Add
            articles, social media accounts, and other links that show your
            account is in the public interest. Paid or promotional content won't
            be considered.
          </Text>

          <Text style={{...styles.sortText}}>Link 1</Text>
          <View style={styles.textInputLinkCover}>
            <MaterialCommunityIcons name="web" size={22} color="#3b3b3b" />
            <TextInput
              style={styles.inputTextInput}
              placeholder={'Link URL'}
              placeholderTextColor={'#262626'}
              value={link}
              onChangeText={setLink}
            />
          </View>

          <Text style={{...styles.sortText}}>Link 2</Text>
          <View style={styles.textInputLinkCover}>
            <MaterialCommunityIcons name="web" size={22} color="#3b3b3b" />
            <TextInput
              style={styles.inputTextInput}
              placeholder={'Link URL'}
              placeholderTextColor={'#262626'}
              value={linkk}
              onChangeText={setLinkk}
            />
          </View>

          <Text style={{...styles.sortText}}>Link 3</Text>
          <View style={styles.textInputLinkCover}>
            <MaterialCommunityIcons name="web" size={22} color="#3b3b3b" />
            <TextInput
              style={styles.inputTextInput}
              placeholder={'Link URL'}
              placeholderTextColor={'#262626'}
              value={linkkk}
              onChangeText={setLinkkk}
            />
          </View>

          <Text style={{...styles.sortText}}>Link 4</Text>
          <View style={styles.textInputLinkCover}>
            <MaterialCommunityIcons name="web" size={22} color="#3b3b3b" />
            <TextInput
              style={styles.inputTextInput}
              placeholder={'Link URL'}
              placeholderTextColor={'#262626'}
              value={linkkkk}
              onChangeText={setLinkkkk}
            />
          </View>
          {!CTX.userObj?.verify && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => submitForVerificaction()}
              style={{paddingTop: 20, marginBottom: 50}}>
              <View style={styles.eachBtnCover}>
                {loading ? (
                  <ActivityIndicator color="#262626" size={30} />
                ) : (
                  <Text style={styles.eachBtnText}>Submit</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default RequestVerification;
