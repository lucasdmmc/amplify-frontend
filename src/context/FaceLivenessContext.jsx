import React, { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { Buffer } from 'buffer';
import { useTheme } from '@aws-amplify/ui-react';


export const FaceLivenessContext = createContext()

export const FaceLivenessProvider = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
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

  const createSessionId = async () => {
    try {
      const response = await api.get("/api/createSession")
      const { sessionId } = response.data
      return sessionId
    } catch (error) {
      console.log(error)
    }
  }

  const callCreateSession = async () => {
    if(sessionId) {
      setSessionId(null)
    }
    const sessionid = await createSessionId()
    setSessionId(sessionid)
  }

  const handleAnalysisComplete = async (sessionId) => {

    const analysisResponse = await api.get(`/api/getFaceLivenessResults?sessionId=${sessionId}`)

    let responseTemplate = {
        verified: Boolean,
        referenceImageURL: String,
        confidence: String,
    }

    let myResponse = responseTemplate



    const { confidence } = analysisResponse.data

    if(confidence >= 65) {
        try {
            const referenceImageSrc = await parseImageBytesToString(analysisResponse.data.referenceImage.Bytes)
            myResponse.referenceImageURL = referenceImageSrc
            myResponse.confidence = confidence
            myResponse.verified = true
        } catch (error) {
            console.log("It was not possible to set either referenceImageURL, confidence or verified fields: " + error)
        }
    } else {
        myResponse.verified = false
    }

    return myResponse
  };

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

  const parseImageBytesToString = async (imageBytes) => {
    try {
        const byteData = Object.values(imageBytes)
        const buffer = Buffer.from(byteData)
        const base64String = buffer.toString('base64')
        const src = `data:image/jpeg;base64,${base64String}`
        return src
    } catch (error) {
        console.log("It was not possible to parse the referenceImage: " + error)   
    }
   
  }

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
      confidence,
      referenceImage,
      callCreateSession,
      callHandleAnalysisComplete,
    }}>
      {children}
    </FaceLivenessContext.Provider>
  )
}