// // usePermissions.js
// import { useState, useEffect } from "react";
// import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
// import { Platform } from "react-native";

// export const usePermissions = () => {
//   const [granted, setGranted] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       try {
//         const cameraPermission =
//           Platform.OS === "ios"
//             ? PERMISSIONS.IOS.CAMERA
//             : PERMISSIONS.ANDROID.CAMERA;

//         const micPermission =
//           Platform.OS === "ios"
//             ? PERMISSIONS.IOS.MICROPHONE
//             : PERMISSIONS.ANDROID.RECORD_AUDIO;

//         const checkCamera = await check(cameraPermission);
//         const checkMic = await check(micPermission);

//         if (checkCamera !== RESULTS.GRANTED) {
//           await request(cameraPermission);
//         }
//         if (checkMic !== RESULTS.GRANTED) {
//           await request(micPermission);
//         }

//         const finalCamera = await check(cameraPermission);
//         const finalMic = await check(micPermission);

//         setGranted(finalCamera === RESULTS.GRANTED && finalMic === RESULTS.GRANTED);
//       } catch (err) {
//         console.error("Permission check failed:", err);
//         setGranted(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     requestPermissions();
//   }, []);

//   return { granted, loading };
// };

import { useState, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const usePermissions = () => {
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const cameraPerm =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;
        const micPerm =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.MICROPHONE
            : PERMISSIONS.ANDROID.RECORD_AUDIO;

        // const handleStatus = async (status, perm) => {
        //   if (status === RESULTS.DENIED) {
        //     return await request(perm);
        //   } else if (status === RESULTS.BLOCKED) {
        //     Alert.alert(
        //       "Permission Blocked",
        //       "Please enable permissions from settings"
        //     );
        //     Linking.openSettings();
        //     return status;
        //   }
        //   return status;
        // };

        const handleStatus = async (status, perm) => {
          if (status === RESULTS.DENIED) {
            return await request(perm);
          } else if (status === RESULTS.BLOCKED) {
            Alert.alert(
              'Permission Blocked',
              'Please enable permissions from settings',
              [
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
            return status;
          }
          return status;
        };

        // check initial
        const cameraStatus = await check(cameraPerm);
        const micStatus = await check(micPerm);

        // resolve final
        const finalCamera = await handleStatus(cameraStatus, cameraPerm);
        const finalMic = await handleStatus(micStatus, micPerm);

        if (finalCamera === RESULTS.GRANTED && finalMic === RESULTS.GRANTED) {
          setGranted(true);
        } else {
          setGranted(false);
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        Alert.alert('Error', 'Unable to request camera/mic permissions.');
        setGranted(false);
      } finally {
        setLoading(false);
      }
    };

    requestPermissions();
  }, []);

  return { granted, loading };
};
