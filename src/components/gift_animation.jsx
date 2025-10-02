import { View, Text, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { MainContext } from '../../App';

const GiftAnimation = ({ override }) => {
  const CTX = useContext(MainContext);
  const timeoutRef = useRef(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const dismissedRef = useRef(false); // To avoid double close
  const [gift, setGift] = useState(
    //   {
    //   type: 'gift',
    //   from: 'allison',
    //   to: 'streamer123',
    //   gift: {
    //     name: 'dragon',
    //     emoji: '🐉',
    //     price: 5000000,
    //   },
    // }

    null,
  );

  const displayGiftMessageHandler = ({ gift }) => {
    setGift(gift);
    setShowAnimation(true);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!dismissedRef.current) {
        setShowAnimation(false);
      }
    }, 4000);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [gift]);

  useEffect(() => {
    if (override) {
    setShowAnimation(true);
      setGift(override);
    }
  }, [override]);

  useEffect(() => {
    if (CTX.socketObj) {
      CTX.socketObj.on('display-gift-message', displayGiftMessageHandler);
    }

    return () => {
      CTX.socketObj?.off('display-gift-message');
    };
  }, [CTX.socketObj]);

  return (
    <>
      {showAnimation && (
        <Animated.View
          entering={FadeInDown.duration(500)}
          exiting={FadeOutUp.duration(500)}
          style={styles.banner}
        >
          <Text style={styles.text}>
            🎉 @{gift.from} gifted {gift.gift.emoji} {gift.gift.name}!
          </Text>
        </Animated.View>
      )}
    </>
  );
};

export default GiftAnimation;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 50,
    zIndex: 10000,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 12,
  },
  text: {
    fontFamily: 'Gilroy-Medium',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
});
