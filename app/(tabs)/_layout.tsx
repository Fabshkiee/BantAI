import CameraIcon from "@/assets/icons/CameraIcon";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import HomeIcon from "@/assets/icons/HomeIcon";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // style cleanup
        headerShown: false,

        // state colors
        tabBarActiveTintColor: "#006ec2",
        tabBarInactiveTintColor: "#84888c",

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },

        // tabbar styling
        tabBarStyle: {
          // bg colors
          backgroundColor: "#f0f8ff",

          // border style
          borderStartWidth: 2,
          borderTopWidth: 2,
          borderEndWidth: 2,
          borderColor: "#e5e5e5",
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,

          // spacing
          paddingBottom: 28,
          paddingTop: 16,
          bottom: 38,

          // position
          position: "absolute",

          // shadow reset
          shadowOpacity: 0,
          elevation: 0,
        },

        // label styling
        tabBarLabelStyle: {
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIconStyle: {
            paddingBottom: 8,
          },
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={40} />,
        }}
      />
      <Tabs.Screen
        name="photoInstructions"
        options={{
          tabBarStyle: { display: "none" },
          title: "",
          tabBarIconStyle: {
            marginTop: -20,
          },
          tabBarIcon: ({ color }) => (
            <View
              className="flex-row bg-surface-primary rounded-[56px] p-4"
              style={{
                elevation: 14,
                shadowColor: "#005da3",
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 0 },
              }}
            >
              <CameraIcon color="#f5faff" size={60} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIconStyle: {
            paddingBottom: 8,
          },
          tabBarIcon: ({ color }) => <HistoryIcon color={color} size={32} />,
        }}
      />
    </Tabs>
  );
}
