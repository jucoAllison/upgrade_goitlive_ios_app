import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import React, {useState} from 'react';
import styles from '../amassCenter/styles';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PublishLive = ({data, togglePublish}) => {
  const navigation = useNavigation();

  const pressHeaderHere = () => {
    navigation.goBack();
  };

  return (
    <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
      }}>
      <View style={{padding: 20, paddingTop: 16}}>
        <TouchableOpacity activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, width: 35}}>
      <Ionicons name="chevron-back" size={26} color="#000" />
          {/* <Ionicons name="arrow-back" color="#000" size={25} /> */}
        </TouchableOpacity>
        <Text style={styles.personalInfo}>Publish live</Text>

        <Text style={styles.topText}>
          Publish your live whenever you are live so other will be notified and
          can join your stream.
        </Text>
      </View>

      <Pressable style={styles.coverUserCommentSection}>
        <MaterialCommunityIcons
          name={data?.isPrivateLivePublish ? 'publish' : 'publish-off'}
          size={20}
          color={'#3b3b3b'}
        />
        <Text style={styles.sortText}>Publish live</Text>

        <Switch
          style={{marginLeft: 'auto'}}
          onValueChange={() => togglePublish()}
          value={data?.isPrivateLivePublish}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={data?.isPrivateLivePublish ? '#e20154' : '#bbb'}
          colo
        />
      </Pressable>
    </ScrollView>
  );
};

export default PublishLive;
