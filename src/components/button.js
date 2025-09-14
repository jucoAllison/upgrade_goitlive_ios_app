import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  textTransform,
} from 'react-native';

const Button = ({
  onPress,
  disable,
  label,
  pressableStyle,
  style,
  loading,
  color = '#fff',
  loadingSide,
}) => {
  const onPressHandler = () => {
    if (disable) {
      return null;
    } else {
      onPress();
    }
  };

  return (
    <>
      {loading ? (
        <View
          style={{
            ...styles.BTN,
            ...pressableStyle,
            ...style,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator color={'#fff'} size={30} />
          {loadingSide && (
            <Text
              style={{
                marginLeft: 3,
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: 'Satoshi',
              }}
            >
              {loadingSide}
            </Text>
          )}
        </View>
      ) : disable ? (
        <View
          style={{
            ...styles.BTN,
            ...pressableStyle,
            // backgroundColor: '#ffa3eb',
            backgroundColor: '#e2015488',
            ...style,
          }}
        >
          <Text style={styles.labelStyle}>{label}</Text>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressHandler}
          style={{
            ...styles.BTN,
            ...pressableStyle,
            backgroundColor: '#e20154',
            ...style,
          }}
        >
          <Text
            style={{
              ...styles.labelStyle,
              color,
              textTransform,
              fontFamily: 'Gilroy-Bold',
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  BTN: {
    // backgroundColor: '#e20154',
    backgroundColor: '#e20154',

    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowColor: '#000',
    elevation: 1,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Button;
