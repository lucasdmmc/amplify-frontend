import { api } from './api'
import { Buffer } from 'buffer';

export const createSessionId = async () => {
    try {
      const response = await api.get("/api/createSession")
      const { sessionId } = response.data
      return sessionId
    } catch (error) {
      console.log(error)
    }
}

export const handleAnalysisComplete = async (sessionId) => {

    const analysisResponse = await api.get(`/api/getFaceLivenessResults?sessionId=${sessionId}`)
    console.log(analysisResponse)

    let responseTemplate = {
        verified: Boolean,
        referenceImageURL: String,
        confidence: String,
    }

    let myResponse = responseTemplate

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

    const { confidence } = analysisResponse.data

    if(confidence >= 65) {
        try {
            const referenceImageSrc = await parseImageBytesToString(analysisResponse.data.referenceImage.Bytes)
            console.log(referenceImageSrc)
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