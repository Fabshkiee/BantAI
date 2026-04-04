import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
} from "react-native";

import { Href, router } from "expo-router";

type articleProp = {
  imageSource: ImageSourcePropType;
  title: string;
  desc: string;
  route: Href;
};

const articleProps: articleProp[] = [
  {
    imageSource: require("@/assets/images/earthquake.jpg"),
    title:
      "Preparing Your Home and Property for an Earthquake: 6 Essential Tips",
    desc: "Living in an area prone to earthquakes demands more than just casual awareness; it requires proactive steps to ensure the safety of your home and family.",
    route: "/articles/earthquakeArticle",
  },
  {
    imageSource: require("@/assets/images/typhoon.jpg"),
    title: "Ready Your Home: How to Prepare for a Typhoon",
    desc: "Still cannot believe that we are halfway through the year already? As we enter the months full of tropical cyclones and isolated rains, we bid farewell to our favorite summer activities and destinations and the daily humidity and relatively high temperature that it brings.",
    route: "/articles/typhoonArticle",
  },
  {
    imageSource: require("@/assets/images/fire.jpg"),
    title: "Learning About Home Fires",
    desc: "A fire can become life-threatening in just two minutes. A residence can be engulfed in flames in five minutes.",
    route: "/articles/fireArticle",
  },
];

export default function ArticleCard() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-4 px-3 pb-8 pt-2"
    >
      {articleProps.map((article, index) => (
        <Pressable
          key={index}
          className="bg-surface-light shadow-lg shadow-border-default p-3 w-[250px] rounded-2xl active:scale-95 transition-all"
          onPress={() => {
            router.push(article.route);
          }}
        >
          <Image
            source={article.imageSource}
            className="w-full h-32 rounded-xl mb-3"
            resizeMode="cover"
          />

          <Text className="text-xl font-semibold mb-2" numberOfLines={3}>
            {article.title}
          </Text>

          <Text
            className="text-md text-text-subtle leading-5"
            numberOfLines={3}
          >
            {article.desc}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
