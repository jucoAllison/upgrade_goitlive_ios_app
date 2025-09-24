import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { RtcSurfaceView } from 'react-native-agora';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AllUsersMap = ({ allUsers }) => {
  return (
    <View>
      <FlatList
        style={{ width: '100%' }}
        keyExtractor={item => item}
        horizontal
        data={allUsers}
        renderItem={({ item, index }) => (
          <View
            style={{
              ...styles.itemVideoHere,
              borderRadius: 17,
            }}
          >
            <View
              style={{ position: 'absolute', top: 12, left: 8, zIndex: 20 }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 9,
                  color: '#ffffff99',
                  fontFamily: 'Gilroy-Bold',
                }}
              >
                Anonymous
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#fff',
                  fontFamily: 'Gilroy-Bold',
                  paddingRight: 20,
                }}
              >
                {item}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                backgroundColor: '#e20154',
                borderRadius: 100,
                position: 'absolute',
                top: 6,
                right: 6,
                zIndex: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FontAwesome name="close" color="#fff" size={17} />
            </TouchableOpacity>
            <RtcSurfaceView
              canvas={{ uid: item }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default AllUsersMap;

// https://dribbble.com/shots/11957171-Group-Video-Calls-Feature-Viber

const styles = StyleSheet.create({
  itemVideoHere: {
    flex: 1,
    width: 143,
    height: 224,
    overflow: 'hidden',
    marginLeft: 20,
    position: 'relative',
  },
});
