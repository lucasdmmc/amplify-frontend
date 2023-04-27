import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme, Theme, View, Heading, Text, Alert, Card } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../aws-exports';
import { api } from '../services/api';

Amplify.configure(awsExports);

function App() {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    function fetchTeste() {
      api.get("/api/createSession")
      .then(response => setCreateLivenessApiData(response.data.sessionId))
    }

    fetchTeste();
  },[])
  return (
    <ThemeProvider theme={theme} >
      <FaceLivenessDetector
        sessionId={createLivenessApiData}
        region='us-east-2'

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
          // Instructions: () => {
          //   return (
          //     <Card variation="elevated">
          //       Instructions to follow to use Face Liveness detector
          //       <ol>
          //         <li>
          //           Make sure your face is not covered with sunglasses or a mask.
          //         </li>
          //         <li>
          //           Move to a well-lit place that is not dark or in direct
          //           sunlight.
          //         </li>
          //         <li>
          //           Fill onscreen oval with your face and hold for colored lights.
          //         </li>
          //       </ol>
          //     </Card>
          //   )
          // }
          
        }}
      />
    </ThemeProvider>
  );
}

export default App;