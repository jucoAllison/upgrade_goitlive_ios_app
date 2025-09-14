import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

const Stats = ({lastComments, loading}) => {
  return (
    <>
      <Pressable
        onPress={() => {
          return null;
        }}
        style={styles.coverScrollView}>
        {loading ? (
          <View style={styles.activiityCover}>
            <ActivityIndicator color={'#0a171e'} size={27} />
          </View>
        ) : (
          <View style={{marginTop: 16}}>
            <View style={styles.coverUserCommentSection}>
              <Text style={styles.sortText}>Repeated Views</Text>
              <Text style={{...styles.sortText, color: '#000'}}>
                {lastComments?.views}
              </Text>
            </View>
            <View style={styles.coverUserCommentSection}>
              <Text style={styles.sortText}>Main Views</Text>
              <Text style={{...styles.sortText, color: '#000'}}>
                {lastComments?.mainViews}
              </Text>
            </View>

            <View style={styles.coverUserCommentSection}>
              <Text style={styles.sortText}>Watched to completion</Text>
              <Text style={{...styles.sortText, color: '#000'}}>
                {lastComments?.watchedToCompletion}
              </Text>
            </View>
          </View>
        )}
      </Pressable>
    </>
  );
};

export default Stats;

const styles = StyleSheet.create({
  activiityCover: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  coverScrollView: {
    backgroundColor: '#fff',
    // backgroundColor: 'red',
    height: '100%',
    padding: 20,
    paddingTop: 0,
  },
  coverUserCommentSection: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    marginBottom: 7,
    // paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortText: {
    color: '#111',
    fontSize: 16,
  },
});
