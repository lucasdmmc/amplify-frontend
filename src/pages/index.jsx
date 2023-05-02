import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme, Alert } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { handleAnalysisComplete, createSessionId } from '../services/LivenessHelper';
import { GlobalStyle } from '../styles/global';

Amplify.configure(awsExports);

function App() {
  const [verified, setVerified] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const { tokens } = useTheme();

  const theme = {
    name: "Face Lucas",
    tokens: {
      colors: {
        font: {
          primary: {
            value: tokens.colors.white.value,
          },
        },
      }
    }
  }

  const callCreateSession = async () => {
    if(sessionId) {
      setSessionId(null)
    }
    const sessionid = await createSessionId()
    setSessionId(sessionid)
  }

  const callHandleAnalysisComplete = async () => {
    try {
        const analysisResult = await handleAnalysisComplete(sessionId)
        if(analysisResult.verified) {
          setVerified(true)
          setReferenceImage(analysisResult.referenceImageURL)
          setConfidence(analysisResult.confidence)
        } else {
          alert("User not verified! Please, try again")
          callCreateSession()
        }
    } catch (error){
        alert("It was not possible to handle the analysis results " + error)
        callCreateSession()
    }
  }
  

  useEffect(() => {
    if(!sessionId) {
      callCreateSession()
    }
  },[])

  return (
    <>
      <>
        <GlobalStyle />
        {verified && referenceImage ? 
        //<ReferenceImage src={{referenceImage}}/>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <h1 style={{margin: "auto", color: "#07eb07"}}>The user is validated as a real person</h1>
          <img src={referenceImage} alt="" style={{width: '400px', margin: "auto"}}/>
          <h2 style={{margin: "auto"}}>Aproximated assurance: {Math.round(confidence)}%</h2>
        </div>
        //<h1 style={{margin: "auto"}}>User is verified</h1>
        : (
          <ThemeProvider theme={theme}>

          {sessionId ? (
            <FaceLivenessDetector
            sessionId={sessionId}
            region='us-east-1'
            onAnalysisComplete={callHandleAnalysisComplete}
            onUserCancel={() => callCreateSession()}
              components={{
                PhotosensitiveWarning: () => {
                  return (
                    <Alert
                      backgroundColor={"#e7c35e"}
                      variation='info'
                      isDismissible={false}
                      hasIcon={true}
                      heading="Caution"
                    >
                    This check displays colored lights. Use caution if you are
                    photosensitive.
                   </Alert>
                  )
                },
              }}

            />
          ) : (
            <p>Loading...</p>
          )}
        </ThemeProvider>
        )
      }
      </>
      </>
  );
}

export default App;