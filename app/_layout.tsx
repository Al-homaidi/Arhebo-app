import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const isPermissionGranted = Boolean(permission?.granted);

  const handleScanPress = async () => {
    if (isPermissionGranted) {
      router.push("./scann/index");
    } else {
      const response = await requestPermission();
      if (response.granted) {
        router.push("./scann/index");
      }
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />


<Tabs.Screen
  name="scanner"
  options={{
    title: "Scan",
    tabBarIcon: ({ color, focused }) => (
      <MaterialCommunityIcons
        name={focused ? "qrcode-scan" : "barcode-scan"}
        color={color}
        size={24} // التحكم بحجم الأيقونة
      />
    ),
  }}
  listeners={{
    tabPress: (e) => {
      e.preventDefault();
      handleScanPress();
    },
  }}
/>

    </Tabs>
  );
}
