import { View, Text } from "react-native";
import React from "react";

const InfoBox = ({ title, containerStyles, titleStyles, subtitle }) => {
  return (
    <View className={`${containerStyles}`}>
      <Text className={`text-white text-center font-semibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className={`text-white text-center text-sm font-pregular`}>
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
