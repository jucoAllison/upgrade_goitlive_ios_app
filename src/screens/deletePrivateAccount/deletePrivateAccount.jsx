import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Btn from '../../components/button';

const DeletePrivateAccount = ({navigation, firstDelete}) => {
  const pressHeaderHere = () => {
    navigation.goBack();
  };

  return (
    <>
      <ScrollView style={styles.scrollViewCover}
      contentInsetAdjustmentBehavior="automatic"
      >
        <TouchableOpacity activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, paddingBottom: 4, width: 35}}>
          <Ionicons name="chevron-back" color="#000" size={25} />
        </TouchableOpacity>
        <Text style={styles.personalInfo}>Delete private account</Text>

        <Text style={styles.topText}>
          If you delete your GoItLive private account, your content will be
          deleted permanently and you can't be able to recover it again unless
          you create another private account
        </Text>
      </ScrollView>
      <View style={styles.bottomBtnColor}>
        <>
          <TouchableOpacity activeOpacity={0.8}
            onPress={pressHeaderHere}
            style={{flexDirection: 'row', width: 150, alignItems: 'center'}}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
            <Text
              style={{
                color: '#000',
                textDecorationLine: 'underline',
                fontWeight: 'bold',
              }}>
              Back
            </Text>
          </TouchableOpacity>
          <Btn
            // disable={!defaul && !latest && !earliest && !multiple && !trouble}
            label={'Continue'}
            onPress={firstDelete}
            style={{width: 150, marginTop: 0}}
          />
        </>
      </View>
    </>
  );
};

export default DeletePrivateAccount;

const styles = StyleSheet.create({
  scrollViewCover: {
    padding: 16,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  personalInfo: {
    color: '#111',
    fontSize: 24,
    fontWeight: '500',
    marginVertical: 18,
  },
  coverProfile: {
    flexDirection: 'row',
    paddingVertical: 19,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    paddingRight: 100,
    alignItems: 'center',
  },
  coverProfilePic: {
    backgroundColor: '#0a224e',
    width: 45,
    height: 45,
    marginRight: 7,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {fontWeight: '400', color: 'rgb(112, 122, 138)', fontSize: 12},
  inputTextInput: {
    flexWrap: 'wrap',
    padding: 0,
    color: '#000',
    fontSize: 14,
    marginTop: -1,
  },
  bottomBtnColor: {
    marginTop: 'auto',
    width: '100%',
    borderTopColor: '#ccc',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  coverUserCommentSection: {
    width: '100%',
    paddingHorizontal: 20,
    height: 60,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

    justifyContent: 'space-between',
  },

  sortText: {
    color: '#3b3b3b',
    fontSize: 18,
  },
  clickable: {
    width: 28,
    height: 28,
    borderRadius: 45,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d1d1d1',
    borderWidth: 2,
  },
  innerCircle: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  anotherText: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 0,
    paddingLeft: 14,
    paddingBottom: 9,
    fontSize: 13,
    color: '#000',
  },
});
