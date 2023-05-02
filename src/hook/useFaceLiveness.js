import { useContext } from "react"
import { FaceLivenessContext } from "../context/FaceLivenessContext"

export const useFaceLiveness = () => {
  const context = useContext(FaceLivenessContext)

  return context
}