import styled from "styled-components";

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

export const InstructionsContainer = styled.div`
  color: #52347c; 
  display: flex;
  flex-direction: column;
  gap: 12;
`

export const InstructionsText = styled.span`
  font-weight: bold;
  font-size: 16px;
`

export const OvalAppearsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20;
`

export const FaceExempleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 280px;
  background: #4597af;
  margin: 12px 0 12px 0;
  padding: 16px;
`

export const FaceSquare = styled.div`
  width: 120px;
  height: 140px;
  background: white;
  position: relative;
  border: 1px solid ${(props) => (props.borderColor ? props.borderColor : '#35533b')};
  /* margin:  */
  /* margin-left: 16px; */
  /* margin-right: 16px; */

`

export const GoodFit = styled.div`
  background: #d7f2d7;
  padding: 4px 6px 4px 6px;
  font-size: 12px;
`

export const TooFar = styled.div`
  background: #e9b6b3;
  padding: 4px 6px 4px 6px;
  font-size: 12px;
`