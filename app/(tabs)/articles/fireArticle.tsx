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
    <View className="bg-surface-default mt-9">
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
              source={require("@/assets/images/fire.jpg")}
              className="w-full h-[420px]"
              resizeMode="cover"
            />
          </View>
          <View className="bg-surface-light -mx-9 px-9 -mt-3 py-3 border-border-secondary border-b border-t">
            <Text className="leading-7 text-sm text-text-subtle ">
              Image Courtesy: CritterGuard
            </Text>
          </View>

          <Text className="text-h3 font-bold leading-8">
            Home Fires: Essential Safety & Prevention Guide
          </Text>

          <Text className="leading-7 text-text-subtle">
            Article From: Ready
          </Text>
        </View>

        {/* Main Article */}
        <View className="gap-4">
          <Text className="leading-7">
            A fire can become life-threatening in just two minutes, and a
            residence can be completely engulfed in flames in five.
            Understanding fire behavior and taking simple preventative steps can
            save your home and your family.
          </Text>

          {/* Understanding Fire */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Understanding Fire
            </Text>

            {/* Fire is FAST */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Fire is FAST:
              </Text>
              <Text className="leading-7 ml-4">
                A small flame can turn into a major fire in less than 30
                seconds.
              </Text>
            </View>

            {/* Fire is HOT */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Fire is HOT:
              </Text>
              <Text className="leading-7 ml-4">
                Heat is more threatening than flames. Room temperatures can
                reach 600 degrees at eye level, which can instantly scorch your
                lungs.
              </Text>
            </View>

            {/* Fire is DARK & DEADLY */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Fire is DARK & DEADLY:
              </Text>
              <Text className="leading-7 ml-4">
                Fire quickly produces thick black smoke and toxic gases. These
                gases kill more people than actual flames by causing
                disorientation and drowsiness.
              </Text>
            </View>
          </View>

          {/* Preparation */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">Preparation</Text>

            {/* Map Two Exits */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Map Two Exits:
              </Text>
              <Text className="leading-7 ml-4">
                Find two ways out of every room in case the primary exit is
                blocked. Ensure windows and security bars can be opened quickly.
              </Text>
            </View>

            {/* Practice the Escape */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Practice the Escape:
              </Text>
              <Text className="leading-7 ml-4">
                Practice your fire escape plan twice a year, including feeling
                your way out in the dark with your eyes closed.
              </Text>
            </View>

            {/* Sleep Safely */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Sleep Safely:
              </Text>
              <Text className="leading-7 ml-4">
                Always sleep with your bedroom door closed to slow the spread of
                smoke and heat, and keep a fire extinguisher in the kitchen.
              </Text>
            </View>
          </View>

          {/* Everyday Fire Prevention */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Everyday Fire Prevention
            </Text>

            {/* Safe Cooking */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Safe Cooking:
              </Text>
              <Text className="leading-7 ml-4">
                Never leave a frying or broiling stove unattended. Keep outdoor
                barbecue grills at least 10 feet away from your home's siding
                and deck railings.
              </Text>
            </View>

            {/* Electrical Safety */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Electrical Safety:
              </Text>
              <Text className="leading-7 ml-4">
                Replace frayed or damaged appliance cords immediately. Never run
                cords under rugs, and never overload extension cords.
              </Text>
            </View>

            {/* Protect Children */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Protect Children:
              </Text>
              <Text className="leading-7 ml-4">
                Store matches and lighters in locked cabinets out of reach.
                Teach children early on that fire is a tool, not a toy.
              </Text>
            </View>
          </View>

          {/* During a Fire: How to Survive */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              During a Fire: How to Survive
            </Text>

            {/* Crawl Low */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Crawl Low:
              </Text>
              <Text className="leading-7 ml-4">
                Heavy smoke and poisonous gases collect at the ceiling first.
                Drop to the floor and crawl under the smoke to your exit.
              </Text>
            </View>

            {/* Feel the Doors */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Feel the Doors:
              </Text>
              <Text className="leading-7 ml-4">
                Before opening any door, feel the doorknob and the door itself.
                If either is hot, leave it closed and use your second way out.
              </Text>
            </View>

            {/* If You Are Trapped */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} If You Are Trapped:
              </Text>
              <Text className="leading-7 ml-4">
                Close the door and cover vents and door cracks with cloth or
                tape to keep smoke out. Call emergency services and signal for
                help from a window using a flashlight or light-colored cloth.
              </Text>
            </View>

            {/* Stop, Drop, and Roll */}
            <View>
              <Text className="leading-7 font-medium">
                {"\u2022"} Stop, Drop, and Roll:
              </Text>
              <Text className="leading-7 ml-4">
                If your clothes catch fire, stop immediately, drop to the
                ground, cover your face with your hands, and roll back and forth
                to smother the flames.
              </Text>
            </View>
          </View>
          <View className="gap-4">
            <Text>
              When it comes to home fires, every second counts. Make fire
              prevention a daily habit, test your alarms regularly, and ensure
              your family knows exactly what to do when the alarms sound.
            </Text>
            <Text className="leading-4 italic">
              Stay prepared, stay calm, and stay safe!.
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
              This content was originally published by Ready.
            </Text>

            <Pressable
              className="mt-1 active:opacity-70"
              onPress={() => {
                router.push("https://www.ready.gov/home-fires");
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
                  router.push("/articles/typhoonArticle");
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
                  router.push("/articles/earthquakeArticle");
                }}
              />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
