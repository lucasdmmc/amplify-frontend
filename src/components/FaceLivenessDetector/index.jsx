import React, { Fragment } from 'react';
import { GlobalStyle } from '../../styles/global';
import { ThemeProvider, Loader } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { useFaceLiveness } from '../../hook/useFaceLiveness';
import { Loading } from './styles';

export const FaceLiveness = () => {
  const {
    theme,
    verified, 
    sessionId, 
    callCreateSession,
    callHandleAnalysisComplete, 
  } = useFaceLiveness()
  
  return (
    <Fragment>
      <GlobalStyle />
      {sessionId && !verified && (
        <ThemeProvider theme={theme}>
          <FaceLivenessDetector
            sessionId={sessionId}
            region='us-east-1'
            onAnalysisComplete={callHandleAnalysisComplete}
            onUserCancel={callCreateSession}
          />
        </ThemeProvider>
      )}
      {!sessionId && (
        <Loading>
          <Loader />
        </Loading>
      )}
    </Fragment>
  );
}