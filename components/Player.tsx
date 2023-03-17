import { AVPlaybackStatusSuccess, ResizeMode, Video, Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Button, Dimensions } from "react-native";
import {
  GestureDetector,
  Gesture
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { getBottomSpace } from "react-native-iphone-x-helper"
import { useSelector } from "@xstate/react";
import { useGlobalState } from "../context/xstate";

const { height } = Dimensions.get("window");
const TABBAR_HEIGHT = getBottomSpace() + 0; // 0 will be replaced with tabbar height 
const MINIMIZED_PLAYER_HEIGHT = 100;
const SNAP_TOP = 0;
const SNAP_BOTTOM = height - TABBAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT;
const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"



export default () => {
  const { videoService } = useGlobalState()
  const videoRef = useSelector(videoService, ({ context }) => {
    return context.ref
  })
  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatusSuccess>({} as AVPlaybackStatusSuccess);
  const [audioStatus, setAudioStatus] = useState<AVPlaybackStatusSuccess>({} as AVPlaybackStatusSuccess);
  const audioRef = useRef<Audio.Sound>(new Audio.Sound()) // I'm lazy and don't wanna make another machine :D
  const translateY = useSharedValue(0);
  const prevTransLateY = useSharedValue(0);

  useEffect(() => {
    (async () => {
      audioRef.current.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setAudioStatus(status)
        }
      })
      await audioRef.current.loadAsync({ uri: audioUrl })
    })();

    return audioRef.current
      ? () => {
        audioRef.current.unloadAsync();
      }
      : undefined;
  }, [])

  const playAudio = async () => {
    await audioRef.current.playAsync()
  }

  const pauseAuio = async () => {
    await audioRef.current.pauseAsync()
  }

  const playVideo = async () => {
    await videoRef.current.playAsync()
  }

  const pauseVideo = async () => {
    await videoRef.current.pauseAsync()
  }

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      prevTransLateY.value = translateY.value
    })
    .onUpdate((e) => {
      translateY.value = prevTransLateY.value + e.translationY
    })
    .onEnd(() => {
      if (translateY.value > height / 2) {
        // need to pause video if it's playing 
        // need to play audio if video was playing
        if (videoStatus.isPlaying) {
          runOnJS(pauseVideo)()
          runOnJS(playAudio)()
        }
        translateY.value = withTiming(SNAP_BOTTOM, { easing: Easing.linear })
      } else {
        // need to pause audio if it's playing
        // need to play video if audio was playing
        if (audioStatus.isPlaying) {
          runOnJS(pauseAuio)()
          runOnJS(playVideo)()
        }
        translateY.value = withTiming(SNAP_TOP, { easing: Easing.linear })
      }
    })

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(translateY.value, { duration: 100, easing: Easing.linear })
      }
    ]
  }));

  const animatedVideoStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SNAP_TOP, SNAP_BOTTOM],
      [1, 0],
      Extrapolation.CLAMP
    )

    return { opacity }
  })

  const animatedMiniPlayerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SNAP_TOP, SNAP_BOTTOM],
      [0, 1],
      Extrapolation.CLAMP
    )

    return { opacity }
  })



  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <Animated.View style={[styles.header, animatedVideoStyle]}>
        <Text style={styles.headerText}>
          This is the video player component
        </Text>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={status => {
            if (status.isLoaded) {
              setVideoStatus(() => status)
            }
          }}
        />
        <View style={styles.buttons}>
          <Button
            title={videoStatus.isPlaying ? 'Pause' : 'Play'}
            onPress={() =>
              videoStatus.isPlaying ? videoRef?.current?.pauseAsync() : videoRef?.current?.playAsync()
            }
          />
        </View>
      </Animated.View>
      <Animated.View style={[styles.miniPlayer, animatedMiniPlayerStyle]}>
        <Text>
          I am the mini media player component
        </Text>
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.animatedView} />
      </GestureDetector>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: MINIMIZED_PLAYER_HEIGHT,
    backgroundColor: "purple"
  },
  container: {
    flex: 1,
    width: "100%"
  },
  header: {
    padding: 24,
  },
  headerText: {
    fontSize: 16,
  },
  video: {
    width: "100%",
    height: 200
  },
  buttons: {},
  animatedView: {
    position: "absolute",
    width: "100%",
    height: MINIMIZED_PLAYER_HEIGHT,
    top: 0,
    left: 0,
  },
});