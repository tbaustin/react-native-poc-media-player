import React, { createContext, useContext, useRef } from "react"
import { useInterpret } from "@xstate/react"
import { ActorRefFrom } from "xstate"
import {
  Video,
} from "expo-av"
import { createVideoMachine } from "../machines/video.machine"

interface GlobalStateContextType {
  videoService: ActorRefFrom<typeof createVideoMachine>
}

export const GlobalStateContext = createContext(
  // Odd way to type this but the Stately docs claim it's
  // the only way: https://stately.ai/blog/how-to-manage-global-state-with-xstate-and-react
  {} as GlobalStateContextType,
)

export const GlobalStateProvider = (props: any) => {
  const videoRef = useRef<Video>(new Video({}))
  const videoMachine = createVideoMachine({
    ref: videoRef
  })
  const videoService = useInterpret(videoMachine)


  return (
    <GlobalStateContext.Provider
      value={{
        videoService
      }}
    >
      {props.children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => useContext(GlobalStateContext)
