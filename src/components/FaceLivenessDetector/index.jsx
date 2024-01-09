import React, { Fragment } from 'react';
import { GlobalStyle } from '../../styles/global';
import { ThemeProvider, Loader, Alert, Heading } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { useFaceLiveness } from '../../hook/useFaceLiveness';
import { FaceExempleContainer, FaceSquare, GoodFit, InstructionsContainer, InstructionsText, Loading, OvalAppearsContainer, TooFar } from './styles';
import { Check, X } from 'lucide-react';
import faceMan from "../../assets/face-man.png"
import faceManTwo from "../../assets/face-man-2.png"


export const FaceLiveness = () => {
  const {
    theme,
    verified, 
    sessionId, 
    callCreateSession,
    callHandleAnalysisComplete, 
  } = useFaceLiveness()
  
  return (
    <Fragment>
      <GlobalStyle />
      {sessionId && !verified && (
        <ThemeProvider theme={theme}>
          <FaceLivenessDetector
            sessionId={sessionId}
            region='us-east-1'
            onAnalysisComplete={callHandleAnalysisComplete}
            onUserCancel={callCreateSession}
            components={{
              PhotosensitiveWarning: () => {
                return (
                  <Alert
                    variation="warning"
                    isDismissible={false}
                    hasIcon={true}
                    heading="Caution"
                    style={{ border: '6px solid', borderColor: "#4597af"}}
                  >
                    This check displays colored lights. Use caution if you are
                    photosensitive.
                  </Alert>
                );
              },
              Header: () => {
                return (
                  <Heading
                    style={{ 
                      color: "#52347c", 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: 12,
                    }}
                  >
                    <span>Identity Verification</span>
                    <span>We need to verify if you're a real person</span>

                  </Heading>
                )
              },
              Instructions: () => {
                return (
                  <InstructionsContainer>
                    <InstructionsText>
                      Follow the instructions to complete the check
                    </InstructionsText>

                    <FaceExempleContainer>
                      <div>
                        <FaceSquare>
                          <div style={{ backgroundColor: "#35533b", width: 20, height: 20 }}>
                            <Check color='white' size={20}/>
                          </div>
                          <div style={{ 
                            position: "absolute", 
                            left: -25, 
                            top: -10,
                            
                            }}>
                            <img style={{ width: 170 }} src={faceMan} alt="" />
                          </div>

                        </FaceSquare>
                        <GoodFit>
                          <span style={{ color: "#627c61" }}>Good fit</span>
                        </GoodFit>
                      </div>
                    <div>
                    <FaceSquare borderColor="#4d1312">
                      <div style={{ backgroundColor: "#4d1312", width: 20, height: 20 }}>
                        <X color='white' size={20}/>
                      </div>
                      <div style={{ 
                        position: "relative",
                        border: "1px solid black", 
                        borderRadius: "50%", 
                        width: 80,
                        height: 120,
                        marginTop: -2,
                        marginLeft: 20,
                        overflow: "hidden",
                      }}>
                        <img style={{ 
                          position: "absolute",
                          bottom: -18,
                          width: "100%",
                          height: 130,
                          objectFit: "cover",
                          borderRadius: "50%" 
                        }} src={faceManTwo} alt="" />
                      </div>
                    </FaceSquare>
                      <TooFar>
                        <span style={{ color: "#8b5351" }}>Too Far</span>
                      </TooFar>
                    </div>
                    </FaceExempleContainer>
                    <OvalAppearsContainer>
                      <span>This photo will not be used on your profile!</span>
                      <ol style={{ marginTop: 14, paddingLeft: 30, display: "flex", flexDirection: "column", gap: 16 }}>
                        <li>When an oval appears, fill the oval with your face within 7 seconds.</li>
                        <li>Maximize your screen's brightness.</li>
                        <li>Make sure your face is not convered with sunglasses or a mask.</li>
                        <li>Move to a weel-lit place that is not in direct sunlight.</li>
                       
                      </ol>
                    </OvalAppearsContainer>

                    <span style={{ marginTop: 12, fontWeight: 'bold', textDecoration: "underline", cursor: "pointer" }}>
                      Report an issue
                    </span>
                  </InstructionsContainer>
                )
              },
              
            }}
          />
        </ThemeProvider>
      )}
      {!sessionId && (
        <Loading>
          <Loader />
        </Loading>
      )}
    </Fragment>
  );
}