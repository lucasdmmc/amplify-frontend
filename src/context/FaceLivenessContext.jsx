import React, { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useTheme } from '@aws-amplify/ui-react';

export const FaceLivenessContext = createContext()

export const FaceLivenessProvider = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { tokens } = useTheme();

  const theme = {
    name: 'Face Liveness Example Theme',
    tokens: {
      colors: {
        background: {
          primary: {
            value: tokens.colors.neutral['90'].value,
          },
          secondary: {
            value: tokens.colors.neutral['100'].value,
          },
        },
        font: {
          primary: {
            value: tokens.colors.white.value,
          },
        },
        brand: {
          primary: {
            '10': tokens.colors.teal['100'],
            '80': tokens.colors.teal['40'],
            '90': tokens.colors.teal['20'],
            '100': tokens.colors.teal['10'],
          },
        },
      },
    },
  };

  const sendResultToParentWindow = (windowObj, payload) => {
      windowObj.postMessage(payload, "*")
  }

  const createSessionId = async () => {
    try {
      const response = await api.get('/api/createSession')
      return response.data.sessionId
    } catch (error) {
      console.error(error)
    }
  };

  const callCreateSession = async () => {
    if (sessionId) {
      setSessionId(null)
    }
  
    const newSessionId = await createSessionId()
    setSessionId(newSessionId)
  };

  const handleAnalysisComplete = async (sessionId) => {
    const analysisResponse = await api.get(`/api/getFaceLivenessResults?sessionId=${sessionId}`)
    const { confidence } = analysisResponse.data
  
    let responseTemplate = { verified: false, confidence }
    let myResponse = { ...responseTemplate }
  
    if (confidence >= 65) {
      try {
        myResponse.confidence = confidence
        myResponse.verified = true
      } catch (error) {
        console.log(`It was not possible to set either referenceImageURL, confidence, or verified fields: ${error}`)
      }
    }
  
    return myResponse
  };

  const callHandleAnalysisComplete = async () => {
    try {
      const analysisResult = await handleAnalysisComplete(sessionId)
      const parentWindow = window.parent
  
      if (analysisResult.verified) {
        setVerified(true)
        sendResultToParentWindow(parentWindow, "verified")
      } else {
        sendResultToParentWindow(parentWindow, "invalid")
        alert("User not verified! Please, try again")
        callCreateSession()
      }
    } catch (error) {
      alert(`It was not possible to handle the analysis results: ${error}`)
      callCreateSession()
    }
  };
  

  useEffect(() => {
    if(!sessionId) {
      callCreateSession()
    }
  },[])

  return (
    <FaceLivenessContext.Provider value={{
      theme,
      verified,
      sessionId, 
      callCreateSession,
      callHandleAnalysisComplete,
    }}>
      {children}
    </FaceLivenessContext.Provider>
  )
}