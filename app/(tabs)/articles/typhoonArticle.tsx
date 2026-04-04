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
    <View className="bg-surface-default mt-9 mb-14">
      {/* Animated Floating Pill Header */}
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className="absolute -top-3 left-0 right-0 z-10 pt-8 px-6"
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
        contentContainerClassName="px-9 pb-12 gap-6"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <View className="gap-3">
          <View className="-mx-9">
            <Image
              source={require("@/assets/images/typhoon.jpg")}
              className="w-full h-[420px]"
              resizeMode="cover"
            />
          </View>
          <View className="bg-surface-light -mx-9 px-9 -mt-3 py-3 border-border-secondary border-b border-t">
            <Text className="leading-7 text-sm text-text-subtle ">
              Image Courtesy: FreePik
            </Text>
          </View>

          <Text className="text-h3 font-bold leading-8">
            Ready Your Home: How to Prepare for a Typhoon
          </Text>

          <Text className="leading-7 text-text-subtle">
            Article From: Camella
          </Text>
        </View>

        {/* Main Article */}
        <View className="gap-10">
          <Text className="leading-7 text-xl">
            As we enter the wet season, severe tropical cyclones and heavy rains
            become a regular threat. Protect your property and keep your family
            safe with this essential typhoon preparedness checklist.
          </Text>

          {/* Exterior Checks */}
          <View className="gap-4">
            <Text className="text-2xl font-medium leading-7">
              Exterior Checks
            </Text>

            {/* Roof Inspection */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Inspect the Roof:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Check for holes, cracks, or loose panels. Patch minor issues
                with sealant and ensure screws are tight to prevent wind damage
                and leaks.
              </Text>
            </View>

            {/* Clear Gutters and Drains */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Clear Gutters & Drains:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Sweep away leaves and dirt from your gutters. Ensure community
                street drains are free of garbage to prevent flash flooding.
              </Text>
            </View>

            {/* Trim Trees and Plants */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Trim Trees & Plants:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Cut back weak branches and overgrown plants to minimize
                dangerous flying debris during high winds.
              </Text>
            </View>
          </View>

          {/* Interior Safety */}
          <View className="gap-4">
            <Text className="text-2xl font-medium leading-7">
              Interior Safety
            </Text>

            {/* Secure Windows & Doors */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Secure Windows & Doors:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Ensure frames are sturdy and can withstand heavy wind. Bring all
                outdoor furniture inside.
              </Text>
            </View>

            {/* Check Wiring & Plumbing */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Check Wiring & Plumbing:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Fix any faulty wiring or grounded switches to prevent electric
                shock during power outages. Have a plumber fix pipe leaks early.
              </Text>
            </View>
          </View>

          {/* Emergency Supplies */}
          <View className="gap-4">
            <Text className="text-2xl font-medium leading-7">
              Emergency Supplies
            </Text>

            {/* Stock the Pantry */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Stock the Pantry:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Buy enough non-perishable food, canned goods, and energy bars to
                last a few days without leaving the house.
              </Text>
            </View>

            {/* Build an Emergency Kit */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Build an Emergency Kit:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Pack a "grab-and-go" bag with flashlights, extra batteries, a
                first-aid kit, personal hygiene items, power banks, and
                essential medications.
              </Text>
            </View>

            {/* Store Clean Water */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Store Clean Water:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Keep a stockpile of drinking water—aim for at least one gallon
                per person, per day.
              </Text>
            </View>

            {/* Protect Documents */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Protect Documents:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Place important IDs, prescriptions, and property documents in a
                secure, waterproof box.
              </Text>
            </View>
          </View>

          {/* Family Action Plan */}
          <View className="gap-4">
            <Text className="text-2xl font-medium leading-7">
              Family Action Plan
            </Text>

            {/* Save Emergency Numbers */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Save Emergency Numbers:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Keep a list of local disaster response teams, hospitals, and
                utility companies saved on your phone and written on paper.
              </Text>
            </View>

            {/* Plan Your Evacuation */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Plan Your Evacuation:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Map out exit routes and establish a designated meeting point in
                case family members get separated.
              </Text>
            </View>

            {/* Check on Loved Ones */}
            <View>
              <Text className="leading-7 font-medium text-xl">
                {"\u2022"} Check on Loved Ones:
              </Text>
              <Text className="leading-7 ml-4 text-xl">
                Discuss survival measures with your household, and regularly
                check in on elderly relatives or family members with special
                needs..
              </Text>
            </View>
          </View>

          <Text className="leading-7 italic text-xl">
            Stay safe, stay indoors, and keep your phones charged! arrives.
          </Text>

          {/* Divider */}
          <View className="h-[2px] bg-border-secondary my-4" />

          {/* Source Information */}
          <View className="bg-surface-light p-4 rounded-xl border border-border-secondary/30 gap-1 mb-2">
            <Text className="text-xl font-bold text-text-subtle uppercase tracking-wider mb-1">
              Source Information
            </Text>
            <Text className="leading-6 text-xl">
              This content was originally published by Camella.
            </Text>

            <Pressable
              className="mt-1 active:opacity-70"
              onPress={() => {
                router.push(
                  "https://www.camella.com.ph/preparing-your-home-for-the-rainy-season/",
                );
              }}
            >
              <Text className="text-xl leading-6 text-blue-600 font-semibold">
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
                  router.push("/articles/earthquakeArticle");
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
                  router.push("/articles/fireArticle");
                }}
              />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
