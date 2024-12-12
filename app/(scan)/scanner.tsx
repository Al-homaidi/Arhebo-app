import React from "react";
import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useEffect, useRef } from "react";

import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const { width, height } = Dimensions.get("window");

  const innerDimension = 300;

  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      width / 2 - innerDimension / 2,
      height / 2 - innerDimension / 2,
      innerDimension,
      innerDimension
    ),
    50,
    50
  );
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Scan",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              await Linking.openURL(data);
            }, 500);
          }
        }}
      />
      <Canvas
        style={
          Platform.OS === "android"
            ? { flex: 1 }
            : StyleSheet.absoluteFillObject
        }
      >
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      </Canvas>
    </SafeAreaView>
  );
}
