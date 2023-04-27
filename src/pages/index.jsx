import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { api } from '../services/api';

Amplify.configure(awsExports);

function App() {
  const [loading, setLoading] = useState(false);
  const [createLivenessApiData, setCreateLivenessApiData] = useState(null);
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
    try {
      await api.get(`/api/getFaceLivenessResults?sessionId=${createLivenessApiData}`)
      .then(response => {
        console.log(response)
        if (response.data.confidence > 90) {
          setLoading(true)
        }
      })
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    createSession()

    if(loading) {
      return <></>
    }
  },[])

  return (
    <>
      <>
        {loading ? 
        <h1>User verified</h1> : (
          <ThemeProvider theme={theme}>

          {createLivenessApiData ? (
            <FaceLivenessDetector
              sessionId={createLivenessApiData}
              region='us-east-1'
              onAnalysisComplete={handleAnalysisComplete}
            />
          ) : (
            <p>Carregando...</p>
          )}
        </ThemeProvider>
        )
      }
      </>
      </>
  );
}

export default App;