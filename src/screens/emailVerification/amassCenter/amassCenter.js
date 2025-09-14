import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {Suspense, useContext, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {TruncateText} from '../../helper/truncateText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {MainContext} from '../../../App';
import ErrMessage from '../../components/errMessage/errMessage';
import Button from '../../components/button';

const PersonalAmass = React.lazy(() => import('./personalAmass'));
const OtherAmass = React.lazy(() => import('./otherAmass'));
const AmassCenter = ({
  onRefreshOthers,
  loading,
  item,
  userAmass,
  otherAmass,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [aloading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(null);
  const [ID, setID] = useState(null);
  const [isModalDelete, setIsModalDelete] = useState(false);

  const navigation = useNavigation();
  const CTX = useContext(MainContext);

  const pressHeaderHere = () => {
    navigation.goBack();
  };

  const onRefresh = () => {
    setRefreshing(true);
    onRefreshOthers().then(() => setRefreshing(false));
  };

  const onShowModalHere = (isDeleting, index, ID) => {
    setIndex(index);
    setIsDeleting(isDeleting);
    setID(ID);
    setIsModalDelete(true);
  };

  const onPressHandler = async (isDeleting, index, ID) => {
    if (aloading) return;
    setIndex(index);
    setIsDeleting(isDeleting);

    const url = isDeleting
      ? `${CTX.systemConfig?.am}account/amass/invitation/reject/${ID}`
      : `${CTX.systemConfig?.am}account/amass/invitation/accept/${ID}`;

    setLoading(true);
    try {
      const fetching = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${CTX.sessionToken}`,
        },
      });
      const parsedJson = await fetching.json();
      if (parsedJson?.isRemoved) {
        return CTX.logoutUser();
      }
      if (parsedJson?.error) {
        setLoading(false);
        setErrMsg(parsedJson?.msg);
        setShowMsg(true);
        return;
      }
      // remove the deleted from list of data
      console.log(
        '_id of the post after approving the post => ',
        parsedJson.data?.data?._id,
      );
      setErrMsg(parsedJson.data?.msg);
      setShowMsg(true);
      onRefreshOthers();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error fetching data for session! => ', error);
      setErrMsg('Network request failed');
      setShowMsg(true);
    }
  };

  return (
    <>
      {showMsg && (
        <ErrMessage msg={errMsg} closeErr={() => setShowMsg(!showMsg)} />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalDelete}
        onRequestClose={() => setIsModalDelete(!isModalDelete)}>
        <Pressable style={styles.anocenteredView}>
          <View style={{...styles.anomodalView}}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                }}>
                <MaterialIcons
                  name="delete"
                  size={40}
                  color={'#e20154'}
                  style={{marginBottom: 12}}
                />

                <TouchableOpacity activeOpacity={0.8}
                  onPress={() => setIsModalDelete(!isModalDelete)}
                  style={styles.closeLine}>
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: '#555',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                Remove amass!
              </Text>

              <Text
                style={{
                  color: '#555',
                  fontWeight: '300',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                Once you remove this amass, you won't be able to manage it again
                as one of its team
              </Text>
              <Button
                loading={aloading}
                onPress={() => onPressHandler(isDeleting, index, ID)}
                label={'Continue'}
                style={{width: '100%', marginTop: 30, height: 50}}
              />
            </>
            {/* )} */}
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '100%',
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{padding: 20, paddingTop: 16}}>
          <TouchableOpacity activeOpacity={0.8}
            onPress={pressHeaderHere}
            style={{paddingTop: 0, width: 35}}>
            <Ionicons name="arrow-back" color="#000" size={25} />
          </TouchableOpacity>
          <Text style={styles.personalInfo}>Amass center</Text>

          <Text style={styles.topText}>
            Here, you manage your amass team or add teams to your personal amass
            account if any.
          </Text>
        </View>
        <Suspense fallback={null}>
          <View style={{padding: 20}}>
            <PersonalAmass
              loading={loading}
              item={item}
              userAmass={userAmass}
              navigation={navigation}
              regetAllStuff={onRefreshOthers}
            />
          </View>
          {!loading && (
            <Text style={styles.commentOwner}>
              List of amass you are managing
            </Text>
          )}
          <View style={{padding: 20, marginTop: 10, paddingTop: 0}}>
            <OtherAmass
              loading={loading}
              otherAmass={otherAmass}
              navigation={navigation}
              onPressHandler={onPressHandler}
              isDeleting={isDeleting}
              index={index}
              aloading={aloading}
              onShowModalHere={onShowModalHere}
            />
          </View>
        </Suspense>
      </ScrollView>
    </>
  );
};

export default AmassCenter;
