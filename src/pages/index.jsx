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
    setCreateLivenessApiData(null)
    const response = await api.get(`/api/getFaceLivenessResults?sessionId=${createLivenessApiData}`);
    setCreateLivenessApiData(response.data.sessionId)
    console.log(response)
    const data = await response.json();
    console.log(data)
  }
  useEffect(() => {
    const fetchCreateLiveness = async () => {
      
      api.get("/api/createSession")
      .then(response => setCreateLivenessApiData(response.data.sessionId))
      
    }
    
    fetchCreateLiveness();
  },[])
  return (
    <ThemeProvider theme={theme} >
      {!createLivenessApiData ? (
        <Loader width={200}/>
      ) : (
        
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
            )
          },
          PhotosensitiveWarning: () => {
            return (
              <Alert
                variation="warning"
                isDismissible={false}
                hasIcon={true}
                heading="Testing"
              >
                Hello world
              </Alert>
            )
          },
         
        }}
      />
      //catch
      )}
    </ThemeProvider>
  );
}

export default App;