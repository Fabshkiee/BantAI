import ArrowIcon from "@/assets/icons/ArrowIcon";
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import { router, useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useCallback, useRef } from "react";
import { Animated, Text, View } from "react-native";

export default function PhotoInstructionsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(
    require("@/assets/video/bantai-vid.mov"),
    (player) => {
      player.loop = true;
    },
  );

  useFocusEffect(
    useCallback(() => {
      // Fade in the screen
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      try {
        // Just resume playback. Seeking to 0 forces Android's ExoPlayer to drop
        // the current frame and re-buffer, which causes the black flash!
        player.play();
      } catch (e) {
        console.log("Could not start video:", e);
      }

      return () => {
        try {
          player.pause();
          player.currentTime = 0; // Rewind in the background for next time
        } catch (e) {
          console.log("Video player cleanup skipped (already released)");
        }
      };
    }, [fadeAnim, player]),
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <View className="bg-surface-default px-8 pt-36">
        <View className="absolute top-0 left-0 px-6 pt-8">
          <Button
            label="Return"
            variant="return"
            icon={<ArrowLeftIcon color="black" size={18} />}
            iconPosition="left"
            onPress={() => {
              router.back();
            }}
          />
        </View>
        <View className="items-center w-full">
          <Text className="text-h2 font-display font-bold text-center mb-3 leading-tight">
            How to Take the Photo
          </Text>
          <Text className="text-lg text-center font-text leading-7 mb-9">
            Position your phone in the area where you can see most of the room
            to ensure a complete scan of all sections.
          </Text>

          {/* Video Instruction */}
          <View
            className="w-full rounded-2xl mb-9 bg-surface-default"
            style={{ overflow: "hidden", aspectRatio: 9 / 12 }}
          >
            <VideoView
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                backgroundColor: "#f5faff",
              }}
              player={player}
              contentFit="contain"
              nativeControls={false}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
            />
          </View>

          <Button
            label="Proceed"
            className="w-full"
            onPress={() => {
              router.replace("/landscapeOrientation");
            }}
            icon={<ArrowIcon color="white" size={18} />}
            iconPosition="right"
          />
        </View>
      </View>
    </Animated.View>
  );
}
