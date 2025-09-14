import { View, Text, Image, Pressable, Modal } from 'react-native';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import styles from './profileTop.styles';
import Lottie from 'lottie-react-native';
import animationData from '../../assets/json/loading.json';
import Fallback from '../fallback/fallback';
import { PostContext } from '../../../postVideoCTX';
import { useWebSocket } from '../../../WebSocketContext';

const ProfileTop = React.lazy(() => import('./profileTop'));

const EventProfileTop = ({ profileDetails }) => {
  const { connectionStatus } = useWebSocket();
  const PostCTX = useContext(PostContext);
  const [loadingImg, setLoadingImg] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);

  const [middleMan, setMiddleMan] = useState({});

  const toggleCheckCaring = () => {
    PostCTX.toggleCareHandler(middleMan._id);
    if (middleMan.checkCaring) {
      setMiddleMan({
        ...middleMan,
        checkCaring: !middleMan.checkCaring,
        caring: middleMan.caring - 1,
      });
    } else {
      setMiddleMan({
        ...middleMan,
        checkCaring: !middleMan.checkCaring,
        caring: middleMan.caring + 1,
      });
    }
  };

  useEffect(() => {
    setMiddleMan(profileDetails);
  }, [profileDetails]);

  // console.log('middleMan HERE!! =>>> ', middleMan);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalDelete}
        onRequestClose={() => setIsModalDelete(!isModalDelete)}
      >
        <Pressable
          onPress={() => setIsModalDelete(!isModalDelete)}
          style={styles.anocenteredView}
        >
          <View style={{ ...styles.anomodalView }}>
            <>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsModalDelete(false)}
                  style={styles.closeLine}>
                  <Ionicons color={'#838289'} name="close" size={23} />
                </TouchableOpacity>
              </View> */}
              {loadingImg ? (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lottie
                    style={styles.Lottie}
                    source={animationData}
                    autoPlay
                    loop
                  />
                  {/* <Text style={styles.loadingText}>Loading...</Text> */}
                </View>
              ) : (
                <Image
                  source={{
                    uri:
                      // bigImg.img ||
                      profileDetails?.photo ||
                      'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358',
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </>
          </View>
        </Pressable>
      </Modal>

      {profileDetails && (
        <Suspense fallback={<Fallback />}>
          <ProfileTop
            profileDetails={middleMan}
            // profileDetails={{photo: 'https://ik.imagekit.io/7p9j0gn28d3j/avatar_6Eg2VLCXp.png?updatedAt=1699355756358'}}
            loading={connectionStatus !== 'connected'}
            // loading={connectionStatus !== 'disconnected'}
            toggleCheckCaring={toggleCheckCaring}
            setIsModalDelete={setIsModalDelete}
          />
        </Suspense>
      )}
    </>
  );
};

export default EventProfileTop;
