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
import Feather from 'react-native-vector-icons/Feather';

const ActivityStatus = () => {
  const navigation = useNavigation();
  const [switch1Value, setSwitch1Value] = useState(false);

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
      {/* <Ionicons name="chevron-back" color="#000" size={25} /> */}
        </TouchableOpacity>
        <Text style={styles.personalInfo}>Activity status</Text>

        <Text style={styles.topText}>
          Activity status generally refers to a feature that allows users to
          share their current activity with others. This can be useful for
          letting friends know what you're up to, or for joining relevant
          discussions or amass based on your current activity.
        </Text>
      </View>

      <Pressable style={styles.coverUserCommentSection}>
        <Feather name="activity" size={20} color="#3b3b3b" />
        <Text style={styles.sortText}>Activity status</Text>

        <Switch
          style={{marginLeft: 'auto'}}
          onValueChange={() => setSwitch1Value(!switch1Value)}
          value={switch1Value}
          trackColor={{true: '#e2015496', false: '#ddd'}}
          thumbColor={switch1Value ? '#e20154' : '#bbb'}
          colo
        />
      </Pressable>
    </ScrollView>
  );
};

export default ActivityStatus;
