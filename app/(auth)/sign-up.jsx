import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLogged } = useGlobalContext();

  const handleSubmit = async () => {
    if (!form.password || !form.email || !form.username) {
      Alert.alert("Error", "Please fill in all the fields");
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      const res = await getCurrentUser();
      setUser(res);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView className="bg-purple-400 h-full">
        <ScrollView>
          <View className="w-full min-h-[85vh] justify-center items-center px-4 my-6">
            <Image
              source={images.logo}
              className="w-[135px] h-[35px]"
              resizeMode="contain"
            ></Image>
            <Text className="text-2xl text-black-100 font-psemibold mt-5">
              Sign Up to Aora
            </Text>
            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyle="mt-7"
              placeholder="Enter Username"
            ></FormField>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyle="mt-7"
              keyboardType="email-address"
              placeholder="Enter Email Address"
            ></FormField>
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder="Enter Password"
              otherStyle="mt-7"
            ></FormField>
            <CustomButton
              title="Sign Up"
              handlePress={() => handleSubmit()}
              containerStyles="w-full mt-7"
              isLoading={isSubmitting}
            ></CustomButton>
            <View className="justify-center flex-row gap-2 pt-5">
              <Text className="text-lg text-black-100 font-pregular">
                Already have an account?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-psemibold text-red-700"
              >
                Sign In
              </Link>
            </View>
          </View>
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
export default SignUp;
