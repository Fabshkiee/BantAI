import ArrowIcon from "@/assets/icons/ArrowIcon";
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

const HEADER_HEIGHT = 80;

export default function earthquakeArticle() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollYClamped = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
  });

  return (
    <View className=" bg-surface-default mt-9">
      {/* Animated Floating Pill Header */}
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className="absolute top-0 left-0 right-0 z-10 pt-8 px-6"
      >
        <View className="rounded-full self-start overflow-hidden shadow-sm">
          <Button
            label="Back"
            variant="return"
            icon={<ArrowLeftIcon size={18} />}
            iconPosition="left"
            onPress={() => {
              router.push("/");
            }}
          />
        </View>
      </Animated.View>

      {/* Main Scrolling Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-9 pb-12 gap-4"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <View className="gap-3">
          <View className="-mx-9">
            <Image
              source={require("@/assets/images/earthquake.jpg")}
              className="w-full h-[420px]"
              resizeMode="cover"
            />
          </View>
          <View className="bg-surface-light -mx-9 px-9 -mt-3 py-3 border-border-secondary border-b border-t">
            <Text className="leading-7 text-sm text-text-subtle ">
              Image Courtesy: CubeSmart
            </Text>
          </View>

          <Text className="text-h3 font-bold leading-8">
            Preparing Your Home and Property for an Earthquake: 6 Essential Tips
          </Text>

          <Text className="leading-7 text-text-subtle">
            Article From: GeoVera
          </Text>
        </View>

        {/* Main Article */}
        <View className="gap-4">
          <Text className="leading-7">
            Living in an earthquake-prone area requires proactive preparation.
            Earthquakes strike without warning, but taking these straightforward
            steps can significantly reduce risks to your home and protect your
            family.
          </Text>

          {/* 1. Lock Your Cabinets */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              1. Lock Your Cabinets
            </Text>
            <Text className="leading-7">
              Unsecured cabinets can swing open during a quake, spilling their
              contents. Install safety latches on your cabinet doors to keep
              everything securely inside and prevent injuries or broken
              valuables.
            </Text>
          </View>

          {/* 2. Keep Exits Clear */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              2. Keep Exits Clear
            </Text>
            <Text className="leading-7">
              A quick, unobstructed escape is crucial during an emergency.
              Regularly check the paths to all your doors and windows and keep
              them completely free of clutter and tripping hazards.
            </Text>
          </View>

          {/* 3. Know How to Protect Yourself */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              3. Know How to Protect Yourself
            </Text>
            <Text className="leading-7">
              Teach your family the “Drop, Cover, and Hold On” method and
              practice drills periodically. Identify safe spots in every room,
              such as under sturdy furniture or against an interior wall, far
              away from windows and objects that could topple.
            </Text>
          </View>

          {/* 4. Anchor Heavy Furniture */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              4. Anchor Heavy Furniture
            </Text>
            <Text className="leading-7">
              Tall, heavy items like bookcases, dressers, and shelving units
              should be securely anchored directly to the walls. Relocate heavy
              objects to lower shelves, and make sure to secure items like TVs
              and computer monitors.
            </Text>
          </View>

          {/* 5. Secure Utilities & Flammables */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              5. Secure Utilities & Flammables
            </Text>
            <Text className="leading-7">
              Water heaters, gas fixtures, and other utilities should be
              anchored and fitted with flexible connectors to prevent dangerous
              leaks. Store flammable or toxic substances (like cleaning supplies
              or paint) in low, secure areas where they cannot spill.
            </Text>
          </View>

          {/* 6. Secure Small Hazards */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              6. Secure Small Hazards
            </Text>
            <Text className="leading-7">
              Pay attention to smaller fixtures that can cause damage or break.
              Secure picture frames, mirrors, and lamps. Organize loose cables
              to prevent tripping, and consider applying safety film to your
              windows to prevent glass from shattering.
            </Text>
          </View>

          {/* Divider */}
          <View className="h-[2px] bg-border-secondary my-4" />

          {/* Source Information */}
          <View className="bg-surface-light p-4 rounded-xl border border-border-secondary/30 gap-1 mb-2">
            <Text className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-1">
              Source Information
            </Text>
            <Text className="leading-6">
              This content was originally published by GeoVera.
            </Text>

            <Pressable
              className="mt-1 active:opacity-70"
              onPress={() => {
                router.push(
                  "https://geovera.com/2024/01/30/earthquake-preparedness-at-home-6-tips/",
                );
              }}
            >
              <Text className="leading-6 text-blue-600 font-semibold">
                Read original article ↗
              </Text>
            </Pressable>
          </View>
        </View>

        {/* More Articles Navigation */}
        <View className="mt-4 gap-5">
          <Text className="text-xl font-bold text-text-main">
            More Articles
          </Text>

          <View className="justify-between flex-row items-center">
            <View className="w-[110px] h-auto">
              <Button
                label="Previous"
                variant="return"
                icon={<ArrowLeftIcon size={18} />}
                iconPosition="left"
                onPress={() => {
                  router.push("/articles/fireArticle");
                }}
              />
            </View>
            <View className="w-[110px] h-auto">
              <Button
                label="Next"
                variant="return"
                icon={<ArrowIcon size={18} />}
                iconPosition="right"
                onPress={() => {
                  router.push("/articles/typhoonArticle");
                }}
              />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
