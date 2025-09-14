import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React, {useContext, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {TruncateText} from '../../helper/truncateText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import PersonalAmass from './personalAmass';
import Button from '../../components/button';
import {MainContext} from '../../../App';

const OtherAmass = ({
  loading,
  otherAmass,
  navigation,
  onPressHandler,
  isDeleting,
  index,
  aloading,
  onShowModalHere,
}) => {
  const CTX = useContext(MainContext);

  const amassLoading = Array(3)
    .fill('as')
    .map((v, i) => (
      <View
        key={i}
        style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        <View style={styles.loadingImg}>
          <SkeletonPlaceholder backgroundColor="#dddddd99" speed={1500}>
            <SkeletonPlaceholder.Item width={42} height={42} />
          </SkeletonPlaceholder>
        </View>

        <View>
          <SkeletonPlaceholder backgroundColor="#dddddd99" speed={1500}>
            <SkeletonPlaceholder.Item width={90} height={10} />
          </SkeletonPlaceholder>
          <View style={{marginTop: 3}}>
            <SkeletonPlaceholder backgroundColor="#dddddd99" speed={1500}>
              <SkeletonPlaceholder.Item width={90} height={7} />
            </SkeletonPlaceholder>
          </View>
        </View>
      </View>
    ));

  const mapOtherAmassHere = otherAmass
    // .filter(v => v.owner?._id !== CTX.userObj?._id)
    .map((item, i) => {
      const getDD = item?.admin?.filter(
        b => b?._id?._id === CTX?.userObj?._id,
      )[0];

      return (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            position: 'relative',
          }}
          key={i}>
          <View
            style={{
              ...styles.coverStatusRound,
              borderWidth: 0,
            }}>
            <Image
              style={styles.styleImage}
              source={{
                uri: item?.photo
                  ? `${item.photo}`
                  : 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
              }}
            />
          </View>
          <View style={{marginLeft: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.mappedDatasCoverFullname}>
                {TruncateText(item?.name, 24)}
              </Text>
              {item?.isAmassVerified && (
                <MaterialIcons
                  style={{marginLeft: 5}}
                  name="verified"
                  color="#91ff91"
                  size={17}
                />
              )}
            </View>
            <Text style={styles.mappedDatasCoverUsername}>
              {item?.isPublic ? 'Public amass' : 'Private amass'}
            </Text>
          </View>

          {item?.owner?._id !== CTX.userObj?._id && (
            <View
              style={{position: 'absolute', right: 20, flexDirection: 'row'}}>
              {/* <View style={{marginLeft: 'auto', flexDirection: 'row'}}> */}
              <TouchableOpacity activeOpacity={0.8}
                onPress={() => onShowModalHere(true, i, item?._id)}>
                <View style={{...styles.boxStuff}}>
                  {aloading && isDeleting && index == i ? (
                    <ActivityIndicator size={18} color={'#fff'} />
                  ) : (
                    <FontAwesome name="close" color="#fff" size={20} />
                  )}
                </View>
              </TouchableOpacity>

              {!getDD?.isApproved && (
                <TouchableOpacity activeOpacity={0.8}
                  style={{marginLeft: 14}}
                  onPress={() => onPressHandler(false, i, item?._id)}>
                  <View
                    style={{...styles.boxStuff, backgroundColor: '#008400'}}>
                    {aloading && !isDeleting && index == i ? (
                      <ActivityIndicator size={20} color={'#fff'} />
                    ) : (
                      <FontAwesome name="check" color="#fff" size={20} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      );
    });

  return (
    <>
      <View style={styles.smallBgColor}>
        {loading ? (
          <View style={{height: 300, overflow: 'hidden', position: 'relative'}}>
            <View
              style={{
                ...styles.coverNot,
                flexDirection: 'column',
                top: 0,
                alignItems: 'flex-start',
                marginTop: 0,
              }}>
              {amassLoading}
            </View>
          </View>
        ) : mapOtherAmassHere.length < 1 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <FontAwesome5 size={40} color="#000" name="holly-berry" />
            <Text style={{...styles.pleaseRetry, marginTop: 10}}>
              No user has added you to there team to help manage there amass
            </Text>
          </View>
        ) : (
          <View
            style={{
              // height: 130,
              overflow: 'hidden',
              position: 'relative',
            }}>
            <View
              style={{
                ...styles.coverNot,
                flexDirection: 'column',
                position: 'relative',
                paddingBottom: 20,
              }}>
              {mapOtherAmassHere}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default OtherAmass;
