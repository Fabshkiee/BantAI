import SaveIcon from "@/assets/icons/SaveIcon";
import * as React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "cancel" | "return" | "returnLg" | "save";
  size?: "default" | "compact";
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
  size = "default",
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
    returnLg: "bg-surface-default",
    save: "bg-surface-primary border-transparent",
  };

  const textColors = {
    primary: "text-text-inverse",
    secondary: "text-text-primary",
    cancel: "text-text-critical",
    return: "text-text-default",
    returnLg: "text-text-default  ",
    save: "text-text-inverse",
  };

  const fontSize = {
    primary: "text-lg",
    secondary: "text-lg",
    cancel: "text-lg",
    return: "text-lg",
    returnLg: "text-h3",
    save: "text-lg",
  };

  const sizes = {
    default: "p-4",
    compact: "px-3 py-2",
  };

  const resolvedIcon =
    icon ??
    (variant === "save" ? <SaveIcon color="white" size={14} /> : undefined);
  const resolvedIconPosition =
    variant === "save" && !icon ? "left" : iconPosition;
  const iconGapClass = size === "compact" ? "mr-1.5" : "mr-3";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
    flex-row items-center justify-center rounded-[56px] transition-all
    ${sizes[size]}
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
              {resolvedIcon && resolvedIconPosition === "left" && (
                <View className={iconGapClass}>{resolvedIcon}</View>
              )}

              <Text
                className={`font-text font-bold ${fontSize[variant]} ${textColors[variant]} ${pressed ? "" : ""}`}
              >
                {label}
              </Text>

              <View className="flex-row items-center">
                {resolvedIcon && resolvedIconPosition === "right" && (
                  <View className="ml-2">{resolvedIcon}</View>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
