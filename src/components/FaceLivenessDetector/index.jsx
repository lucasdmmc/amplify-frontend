import React from 'react';
import { GlobalStyle } from '../../styles/global';
import { ThemeProvider, Loader } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { useFaceLiveness } from '../../hook/useFaceLiveness';
import { Loading, ReferenceImage } from './styles';


export const FaceLiveness = () => {
  const {
    theme,
    verified, 
    sessionId, 
    confidence, 
    referenceImage, 
    callCreateSession, 
    callHandleAnalysisComplete, 
  } = useFaceLiveness()
  
  return (
    <>
      <GlobalStyle />
      {verified && referenceImage ? (
        <ReferenceImage>
          <h1>The user is validated as a real person</h1>
          <img src={referenceImage} alt="" />
          <h2>Aproximated assurance: {Math.round(confidence)}%</h2>
        </ReferenceImage>
      ) : sessionId ? (
        <ThemeProvider theme={theme}>
          <FaceLivenessDetector
            sessionId={sessionId}
            region='us-east-1'
            onAnalysisComplete={callHandleAnalysisComplete}
            onUserCancel={() => callCreateSession()}
          />
        </ThemeProvider>
      ) : (
        <Loading>
          <Loader />
        </Loading>
      )}
    </>
  );
}