import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useState } from "react";
import icons from "../constants/icons";
const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyle,
  keyboardType,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyle}`}>
      <Text className="text-base text-gray-600 font-pmedium">{title}</Text>
      <View className="border-2 border-purple-700 w-full h-16 px-4 bg-purple-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-black font-psemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"

            ></Image>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
