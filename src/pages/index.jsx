import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { api } from '../services/api';
import { Buffer } from 'buffer';

Amplify.configure(awsExports);

function App() {
  const [verified, setVerified] = useState(false);
  const [createLivenessApiData, setCreateLivenessApiData] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
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
      .then(response => setCreateLivenessApiData(response.data.sessionId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleAnalysisComplete = async () => {
    console.log("Called analysisComplete")
    try {
      await api.get(`/api/getFaceLivenessResults?sessionId=${createLivenessApiData}`)
      .then(response => {
        console.log(response)
        if (response.data.confidence >= 85) {
          setVerified(true)
          // const referenceImageBytes = response.data.referenceImage.Bytes
          // const referenceImageBytesAsArray = Object.keys(referenceImageBytes)
          // const referenceImageBuffering = Buffer.from(referenceImageBytesAsArray)
          // const blob = new Blob([referenceImageBuffering], {type: "image/jpeg"})
          // const referenceImageURL = URL.createObjectURL(blob)
          // console.log(referenceImageURL)
          // setReferenceImage(referenceImageURL)
        } else {
          alert("User not verified! Please, try again")
          setCreateLivenessApiData(null)
          createSession()
          // window.location.reload(false)
        }
        // console.log(response.data.status)
        // if (response.data.status === "SUCCEEDED" || response.data.status === "FAILED" || response.data.status === "EXPIRED") {
        //   createSession()
        // }
      })
    } catch (error) {
      console.log("Catch error: "+error)
    }
  };

  useEffect(() => {
    createSession()
  },[])

  return (
    <>
      <>
        {verified ? 
        //<img src={referenceImage} alt="" />
        <h1 style={{margin: "auto"}}>User is verified</h1>
        : (
          <ThemeProvider theme={theme}>

          {createLivenessApiData ? (
            <FaceLivenessDetector
              sessionId={createLivenessApiData}
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