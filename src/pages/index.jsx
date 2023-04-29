import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { api } from '../services/api';
import { Buffer } from 'buffer';
import { ReferenceImage} from '../components/referenceImage'

Amplify.configure(awsExports);

function App() {
  const [verified, setVerified] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [ confidence, setConfidence] = useState(null);
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

  const createSession = async () => {
    try {
      await api.get("/api/createSession")
      .then(response => {
        const { sessionId } = response.data
        setSessionId(sessionId)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleAnalysisComplete = async () => {
    //console.log("Called analysisComplete")
    try {
      await api.get(`/api/getFaceLivenessResults?sessionId=${sessionId}`)
      .then(async response => {
        //Descomentar hoje
        //console.log(response)
        if (response.data.confidence >= 85) {
          setVerified(true)
          const byteData = Object.values(response.data.referenceImage.Bytes)
          const buffer = Buffer.from(byteData)
          const base64String = buffer.toString('base64')
          const src = `data:image/jpeg;base64,${base64String}`
          setReferenceImage(src)
          const { confidence } = response.data
          setConfidence(confidence)
          
        } else {
          alert("User not verified! Please, try again")
          setSessionId(null)
          createSession()
        }
        // if (response.data.status === "SUCCEEDED" || response.data.status === "FAILED" || response.data.status === "EXPIRED") {
        //   createSession()
        // }
      })
    } catch (error) {
      console.log("Catch error: " + error)
    }
  };

  useEffect(() => {
    if(!sessionId) {
      createSession()
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
              onAnalysisComplete={handleAnalysisComplete}
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