import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import styles from '../amassCenter/styles';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Privacy = ({toogles,  toggleHandler, createThreeButtonAlert, selected}) => {
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pressHeaderHere}
          style={{paddingTop: 0, width: 35}}>
          <Ionicons name="chevron-back" size={26} color="#000" />
          {/* <Ionicons name="chevron-back" color="#000" size={25} /> */}
        </TouchableOpacity>
        <Text style={styles.personalInfo}>Privacy</Text>

        <Text style={styles.topText}>
          By managing your privacy preferences, you can create a personalized
          and comfortable experience that aligns with your needs, allowing you
          to stay focused on what matters most. You have the flexibility to turn
          on or off specific types of updates, such as comments, likes, tags, or
          mentions. However, some settings are essential and will remain active
          for now, ensuring you receive important information when needed.
        </Text>
      </View>

      <Pressable style={styles.coverUserCommentSection}>
        <FontAwesome name="tags" size={20} color="#3b3b3b" />
        <Text style={styles.sortText}>Tag</Text>

        {selected?.includes("block_tag") ? <ActivityIndicator size={20} color={"#e20154"} style={{marginLeft: 'auto', marginRight: 14}} /> : <Switch
          style={{marginLeft: 'auto'}}
          // onValueChange={() => setSwitch1Value(!switch1Value)}
          onValueChange={() => toggleHandler("block_tag")}
          value={toogles?.block_tag}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={toogles?.block_tag ? '#e20154' : '#bbb'}
        />}
      </Pressable>

      <Pressable style={styles.coverUserCommentSection}>
        <MaterialCommunityIcons
          name="comment-processing"
          size={20}
          color="#3b3b3b"
        />
        <Text style={styles.sortText}>Comments</Text>

        {selected?.includes("block_comment") ? <ActivityIndicator size={20} color={"#e20154"} style={{marginLeft: 'auto', marginRight: 14}} /> :<Switch
          style={{marginLeft: 'auto'}}
          // onValueChange={() => setSwitch1Value(!switch1Value)}
          onValueChange={() => toggleHandler("block_comment")}
          value={toogles?.block_comment}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={toogles?.block_comment ? '#e20154' : '#bbb'}
        />}
      </Pressable>

      <Pressable style={styles.coverUserCommentSection}>
        <AntDesign name="heart" size={20} color="#3b3b3b" />
        <Text style={styles.sortText}>Like </Text>

        {selected?.includes("block_like") ? <ActivityIndicator size={20} color={"#e20154"} style={{marginLeft: 'auto', marginRight: 14}} /> :<Switch
          style={{marginLeft: 'auto'}}
          // onValueChange={() => setSwitch1Value(!switch1Value)}
          onValueChange={() => toggleHandler("block_like")}
          value={toogles?.block_like}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={toogles?.block_like ? '#e20154' : '#bbb'}
        />}
      </Pressable>

      <Pressable style={styles.coverUserCommentSection}>
        <MaterialCommunityIcons name="post-outline" size={23} color="#3b3b3b" />
        <Text style={styles.sortText}>Posts</Text>

        {selected?.includes("block_posts") ? <ActivityIndicator size={20} color={"#e20154"} style={{marginLeft: 'auto', marginRight: 14}} /> :<Switch
          style={{marginLeft: 'auto'}}
          // onValueChange={() => setSwitch1Value(!switch1Value)}
          onValueChange={() => toggleHandler("block_posts")}
          value={toogles?.block_posts}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={toogles?.block_posts ? '#e20154' : '#bbb'}
        />}
      </Pressable>

      <Pressable style={styles.coverUserCommentSection}>
        <Ionicons name="barcode" size={25} color="#3b3b3b" />
        <Text style={styles.sortText}>New backup</Text>

        <Switch
          style={{marginLeft: 'auto'}}
          onValueChange={() => createThreeButtonAlert(`Check back later At the moment you cannot disable this feature`)}
          value={true}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={true ? '#e20154' : '#bbb'}
        />
      </Pressable>

      <Pressable style={styles.coverUserCommentSection}>
        <Fontisto name="radio-btn-active" size={22} color="#3b3b3b" />
        <Text style={styles.sortText}>Active</Text>

        <Switch
          style={{marginLeft: 'auto'}}
          onValueChange={() => createThreeButtonAlert(`Check back later At the moment you cannot disable this feature`)}
          value={true}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={true ? '#e20154' : '#bbb'}
        />
      </Pressable>

      <Pressable style={styles.coverUserCommentSection}>
        <MaterialIcons name="system-security-update-warning" size={23} color="#3b3b3b" />
        <Text style={styles.sortText}>System info</Text>

        <Switch
          style={{marginLeft: 'auto'}}
          onValueChange={() => createThreeButtonAlert(`Check back later At the moment you cannot disable this feature`)}
          value={true}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={true ? '#e20154' : '#bbb'}
        />
      </Pressable>
    </ScrollView>
  );
};

export default Privacy;
