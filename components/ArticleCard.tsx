import { Href, router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
} from "react-native";

type articleProp = {
  imageSource: ImageSourcePropType;
  titleKey: string;
  descKey: string;
  route: Href;
};

const articleProps: articleProp[] = [
  {
    imageSource: require("@/assets/images/earthquake.jpg"),
    titleKey: "articles.earthquake_title",
    descKey: "articles.earthquake_desc",
    route: "/articles/earthquakeArticle",
  },
  {
    imageSource: require("@/assets/images/typhoon.jpg"),
    titleKey: "articles.typhoon_title",
    descKey: "articles.typhoon_desc",
    route: "/articles/typhoonArticle",
  },
  {
    imageSource: require("@/assets/images/fire.jpg"),
    titleKey: "articles.fire_title",
    descKey: "articles.fire_desc",
    route: "/articles/fireArticle",
  },
];

export default function ArticleCard() {
  const { t } = useTranslation();

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
            {t(article.titleKey)}
          </Text>

          <Text
            className="text-md text-text-subtle leading-5"
            numberOfLines={3}
          >
            {t(article.descKey)}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
