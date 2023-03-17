import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Player from "./components/Player";
import { GlobalStateProvider } from "./context/xstate";

export default function App() {
  return (
    <GlobalStateProvider>
      <GestureHandlerRootView style={styles.container}>
        <Player />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </GlobalStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 36,
  },
  animatedView: {
    backgroundColor: "red",
    position: "absolute",
    width: "100%",
    height: 100,
    bottom: 0,
    left: 0,
  },
});
