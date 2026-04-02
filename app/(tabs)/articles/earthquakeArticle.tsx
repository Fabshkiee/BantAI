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
    <View className="flex-1 bg-surface-default">
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
        <View className="gap-3">
          <Text className="leading-7">
            Living in an area prone to earthquakes demands more than just casual
            awareness; it requires proactive steps to ensure the safety of your
            home and family. Earthquakes strike without warning, turning
            everyday objects into potential hazards. By taking some
            straightforward yet critical measures, you can significantly reduce
            the risks and protect your loved ones and property. And since a
            claim may still be necessary, it is essential to understand the
            claims process from reporting to settlement.
          </Text>

          {/* Tip 1 */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Lock Your Cabinets
            </Text>
            <Text className="leading-7">
              Unsecured cabinets can swing open during an earthquake, causing
              contents to fall out and potentially injure someone or break
              valuable items. Installing latches on your cabinet doors is an
              easy and effective way to keep everything securely inside.
            </Text>
          </View>

          {/* Tip 2 */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Keep a Clear Path to the Exits
            </Text>
            <Text className="leading-7">
              In an earthquake, a quick and unobstructed escape is crucial.
              Ensure that the paths to all exits are clear of any obstacles.
              Regularly check these paths and keep them free from clutter. This
              not only helps in case of an emergency but also promotes a more
              organized and safer living space.
            </Text>
          </View>

          {/* Tip 3 */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Know How to Protect Yourself
            </Text>
            <Text className="leading-7">
              Understanding how to protect yourself during an earthquake is
              vital. Teach your family the “Drop, Cover, and Hold On” method.
              Practice earthquake drills periodically so everyone knows what to
              do. Identify safe spots in each room, like under sturdy furniture
              or against an interior wall, away from windows and heavy objects
              that might topple.
            </Text>
          </View>

          {/* Tip 4 */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Relocate or Anchor Any Large/Heavy Objects
            </Text>
            <Text className="leading-7">
              Tall, heavy furniture, like bookcases, dressers, and shelving
              units, should be securely anchored to the walls. This prevents
              them from falling over during an earthquake, which could cause
              injury or block escape routes. Consider relocating heavy objects
              to lower shelves and secure items like TVs and computer monitors.
            </Text>
          </View>

          {/* Tip 5 */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Secure Water Fixtures and Any Flammable or Toxic Substances
            </Text>
            <Text className="leading-7">
              Water heaters, gas fixtures, and other utilities should be
              anchored and fitted with flexible connectors to prevent breaks and
              leaks. Flammable or toxic substances, such as cleaning supplies or
              paint, should be stored in a secure, low area where they cannot
              spill and create additional hazards.
            </Text>
          </View>

          {/* Tip 6 */}
          <View className="gap-2">
            <Text className="text-xl font-medium leading-7">
              Secure Any Fixtures or Electronics That Can Hurt Someone, Cause
              Damage, or Break
            </Text>
            <Text className="leading-7">
              Beyond the larger pieces of furniture, pay attention to smaller
              fixtures and electronics. Secure items like picture frames,
              mirrors, and lamps. Use cord organizers to prevent tripping over
              cables during an evacuation. Additionally, consider using safety
              film on windows to prevent shattering.
            </Text>
          </View>

          <Text className="leading-7">
            Preparing your home for an earthquake involves a series of
            thoughtful and deliberate actions. While it may initially seem
            overwhelming, taking these steps can immensely reduce the risks and
            provide peace of mind. Remember, safety is not just about reacting
            in the moment of crisis but about being prepared long before it
            arrives.
          </Text>

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
