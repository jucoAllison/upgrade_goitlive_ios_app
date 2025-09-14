import {View, Text, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import ProgressBar from 'react-native-progress/Bar';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import styles from './profile.styles';
import {MainContext} from '../../../App';
import { useWebSocket } from '../../../WebSocketContext';
import AbbrNum from '../../helper/abbrev';
const Funds = ({loading = false, onPress}) => {
  const CTX = useContext(MainContext);
  const [balance, setBalance] = useState(0)
  const [perc, setPerc] = useState(0);
    const { sendMessage, latestMessage, connectionStatus } = useWebSocket();

  const fundLevels = [
    10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000,
    10000000000, 100000000000, 1000000000000, 10000000000000, 100000000000000,
    1000000000000000, 10000000000000000, 100000000000000000,
    1000000000000000000, 10000000000000000000,
  ];

  useEffect(() => {
    if (latestMessage) {
      setBalance(latestMessage?.balance)
    }
  }, [latestMessage]);


  const perNum = async () => {
    let num =
      (await balance) /
      fundLevels[balance?.toString().split('').length - 1];
    setPerc(num);
  };

  useEffect(() => {
    perNum();
  }, [balance]);

  return (
    <>
      {loading ? (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '70%',
              overflow: 'hidden',
              borderRadius: 20,
              height: 30,
              backgroundColor: '#efefef',
              width: 490,
              height: 40,
            }}>
            {/* <SkeletonPlaceholder backgroundColor="#efefef" speed={1500}>
              <SkeletonPlaceholder.Item width={490} height={40} />
            </SkeletonPlaceholder> */}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.coverFundsHere}>
          <ProgressBar
            progress={perc || 0}
            // color="#e010b4"
            // color="#9e005d"e20154
            color="#e20154"
            unfilledColor="#efefef"
            width={220}
            height={30}
            // borderColor="#9e005d"e20154
            borderColor="#e20154"
            borderRadius={50}
          />

          <Text style={{...styles.eachBtnText, marginLeft: 20, fontSize: 19, fontFamily: 'Satoshi',}}>
            {/* ₦{AbbrNum(fundLevels[balance?.toLocaleString()?.toString().split('').length - 1], 1)} */}
            ₦{AbbrNum(balance?.toLocaleString(), 1)}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Funds;
