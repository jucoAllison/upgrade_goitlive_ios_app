// AgoraEngineContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from 'react';
import { createAgoraRtcEngine } from 'react-native-agora';
import { MainContext } from './App';

const AgoraContext = createContext(null);

export const AgoraEngineProvider = ({ children }) => {
  const CTX = useContext(MainContext);
  const engineRef = useRef(null);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    if (!CTX.systemConfig?.A_appId) {
      // no appId yet, don’t initialize
      return;
    }

    if (!engineRef.current) {
      const engine = createAgoraRtcEngine();
      engine.initialize({ appId: CTX.systemConfig?.A_appId });
      engineRef.current = engine;
      setEngineReady(true);
    }

    return () => {
      engineRef.current?.release();
      engineRef.current = null;
      setEngineReady(false);
    };
  }, [CTX.systemConfig?.A_appId]);

  return (
    <AgoraContext.Provider value={engineReady ? engineRef.current : null}>
      {children}
    </AgoraContext.Provider>
  );
};

// custom hook to use Agora engine
export const useAgoraEngine = () => {
  return useContext(AgoraContext);
};
