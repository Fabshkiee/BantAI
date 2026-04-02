import * as React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "cancel" | "return";
  className?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  label,
  onPress,
  icon,
  variant = "primary",
  className = "",
  iconPosition = "left",
  loading = false,
  disabled = false,
}: ButtonProps) {
  const variants = {
    primary: "bg-surface-primary border-transparent",
    secondary: "border-border-primary border-2",
    cancel: "border-border-critical border-2",
    return: "bg-surface-default/75 backdrop-blur-3xl",
  };

  const textColors = {
    primary: "text-text-inverse",
    secondary: "text-text-primary",
    cancel: "text-text-critical",
    return: "text-text-default",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
    flex-row items-center justify-center p-4 rounded-[56px] transition-all
    ${variants[variant]} 
    ${!(disabled || loading) ? " active:opacity-75 active:scale-[0.96]" : "opacity-50"} 
    ${className}
  `}
    >
      {({ pressed }) => (
        <>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              {icon && iconPosition === "left" && (
                <View className="mr-3">{icon}</View>
              )}

              <Text
                className={`font-text font-bold text-lg ${textColors[variant]} ${pressed ? "" : ""}`}
              >
                {label}
              </Text>

              <View className="flex-row items-center">
                {icon && iconPosition === "right" && (
                  <View className="ml-2">{icon}</View>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
