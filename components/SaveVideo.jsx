import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { likeVideo } from "../lib/appwrite";

const SaveVideo = ({ videoId, userId }) => {
  const [showIcon, setShowIcon] = useState(true);

  const data = {
    videoId: videoId,
    userId: userId,
  };

  const handleLike = async () => {
    try {
      await likeVideo(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setShowIcon(false);
    }
  };

  return (
    <View className="flex flex-col w-20 h-12 bg-purple-400  bg-opacity-50 backdrop-blur-md rounded-lg items-center justify-start absolute right-3 transform -translate-x-1/2 -translate-y-1/2">
      <TouchableOpacity activeOpacity={0.7} onPress={handleLike}>
        {showIcon ? (
          <Image
            source={icons.bookmark}
            className="w-12 h-8 justify-center items-center"
            resizeMode="contain"
          />
        ) : (
          ""
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SaveVideo;
