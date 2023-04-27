import React, { useEffect, useState } from 'react';
import { Loader, ThemeProvider, useTheme, Theme, View, Heading, Text, Alert, Card } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { api } from '../services/api';

Amplify.configure(awsExports);



function App() {
  const [createLivenessApiData, setCreateLivenessApiData] = useState("");
  const [ loading, setLoading ] = useState(Boolean);
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
    const fetchCreateLiveness = async () => {
      
      api.get("/api/createSession")
      .then(response => setCreateLivenessApiData(response.data.sessionId))
      
    }
    
    fetchCreateLiveness();
  },[])
  return (
    <>
    <>
      {loading ? <h1>User verified</h1> : <h1>User not verified</h1>}
    </>
    <ThemeProvider theme={theme}>

        {createLivenessApiData ? (
          <FaceLivenessDetector
            sessionId={createLivenessApiData}
            region='us-east-1'
            onAnalysisComplete={handleAnalysisComplete}
            components={{
              Header: () => {
                return (
                  <View>
                    <Heading>{createLivenessApiData}</Heading>
                    <Text>
                      You will go through a face verification process to prove that
                      you are a real person.
                    </Text>
                  </View>
                );
              },
            }} />
        ) : (
          <p>Carregando...</p>
        )}
      </ThemeProvider></>
  );
}

export default App;