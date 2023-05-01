import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { handleAnalysisComplete, createSessionId } from '../services/LivenessHelper';

import { ReferenceImage} from '../components/referenceImage'

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
        background: {
          primary: {
            value: tokens.colors.neutral["90"].value,
          },
          secondary: {
            value: tokens.colors.neutral["90"].value,
          },
        },
        font: {
          primary: {
            value: tokens.colors.white.value,
          },
        },
        brand: {
          primary: {
            "10": tokens.colors.teal["100"],
            "80": tokens.colors.teal["40"],
            "90": tokens.colors.teal["20"],
            "100": tokens.colors.teal["10"],
          }
        }
      }
    }
  }

  const callCreateSession = async () => {
    if(sessionId) {

      setSessionId(null)
      console.log("Session is null")
    }
    const sessionid = await createSessionId()
    console.log("Session is created")
    setSessionId(sessionid)
    console.log("Session is set")
  }

  const callHandleAnalysisComplete = async () => {
    try {
        const analysisResult = await handleAnalysisComplete(sessionId)
        console.log(analysisResult)
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