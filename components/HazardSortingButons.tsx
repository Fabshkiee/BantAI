import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Defines UI labels for sorting
const HAZARD_OPTIONS = [
  {
    id: "all",
    label: "All",
    activeColor: "bg-surface-primary",
    sqlFilter: "all",
  },
  {
    id: "earthquake",
    label: "Earthquake",
    activeColor: "bg-orange-800",
    sqlFilter: "earthquake",
  },
  {
    id: "typhoon",
    label: "Typhoon",
    activeColor: "bg-cyan-700",
    sqlFilter: "typhoon",
  },
  {
    id: "fire",
    label: "Fire",
    activeColor: "bg-red-700",
    sqlFilter: "fire",
  },
];

// Define the props to pass the SQL command back to your parent screen
type HazardSortingProps = {
  tableName?: string;
  onSortQueryChange: (sqlCommand: string) => void;
};

export default function HazardSortingButtons({
  tableName = "articles", // TODO: Define default Table
  onSortQueryChange,
}: HazardSortingProps) {
  const [activeId, setActiveId] = useState<string>("all");

  const handlePress = (option: (typeof HAZARD_OPTIONS)[0]) => {
    setActiveId(option.id);

    // TODO: Adjust String based on SQLite
    let sqlCommand = "";
    if (option.sqlFilter === "all") {
      sqlCommand = `SELECT * FROM ${tableName} ORDER BY created_at DESC;`;
    } else {
      sqlCommand = `SELECT * FROM ${tableName} WHERE category = '${option.sqlFilter}' ORDER BY created_at DESC;`;
    }

    onSortQueryChange(sqlCommand);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {HAZARD_OPTIONS.map((option) => {
          const isActive = activeId === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => handlePress(option)}
              className={`px-5 py-2 rounded-full border transition-all active:scale-95 ${
                isActive
                  ? `${option.activeColor} border-transparent`
                  : "bg-surface-light border-border-default"
              }`}
            >
              <Text
                className={`font-semibold ${
                  isActive ? "text-text-inverse" : "text-text-subtle"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
