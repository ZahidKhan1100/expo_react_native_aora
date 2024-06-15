import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import icons from "../../constants/icons";
import { Video, ResizeMode } from "expo-av";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideoPost } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    // const result = await DocumentPicker.getDocumentAsync({
    //   type:
    //     selectType === "image"
    //       ? ["image/png", "image/jpg"]
    //       : ["video/mp4", "video/gif"],
    // });

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submitForm = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      Alert.alert("Please fill in all the fields");
    }
    setUploading(true);

    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView className="bg-purple-400 h-full">
        <ScrollView className="px-4 my-6">
          <Text className="text-white text-2xl font-psemibold">
            Upload a Video
          </Text>
          <FormField
            title="Video Title"
            value={form.title}
            placeholder="Give your video a catchy title"
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyle="mt-10"
          ></FormField>
          <View className="mt-6 space-y-2">
            <Text className="text-gray-600 text-base font-pmedium">
              Upload Video
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => openPicker("video")}
            >
              {form.video ? (
                <Video
                  source={{ uri: form.video.uri }}
                  className="w-full h-40 rounded-2xl"
                  resizeMode={ResizeMode.COVER}
                ></Video>
              ) : (
                <View className="w-full h-40 justify-center items-center px-4 rounded-2xl bg-purple-200">
                  <View className="border border-dashed w-14 h-14 justify-center items-center border-secondary-100">
                    <Image
                      source={icons.upload}
                      className="w-[90%] h-[90%]"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="mt-6 space-y-2">
            <Text className="text-gray-600 text-base font-pmedium">
              Thumbnail Image
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => openPicker("image")}
            >
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="cover"
                  className="w-full h-40 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 border-2 border-purple-200 bg-purple-200 justify-center items-center rounded-2xl space-x-2 flex-row">
                  <Image
                    source={icons.upload}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="text-sm text-black-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title="AI Prompt"
            value={form.prompt}
            placeholder="The prompt you use to create this video"
            handleChangeText={(e) => setForm({ ...form, prompt: e })}
            otherStyle="mt-7"
          ></FormField>
          <CustomButton
            title="Submit & Publish"
            handlePress={submitForm}
            containerStyles="w-full mt-7"
            isLoading={uploading}
          ></CustomButton>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Create;
