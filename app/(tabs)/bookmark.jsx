import { View, Text, SafeAreaView, FlatList } from "react-native";
import React from "react";
import useAppwrite from "../../lib/useAppwrite";
import { getLikedVideos } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getLikedVideos(user.$id));

  return (
    <SafeAreaView className="bg-purple-400 h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="text-white text-2xl font-psemibold">
              Saved Videos
            </Text>
           
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No Videos found for this serach query"
          />
        )}
      ></FlatList>
    </SafeAreaView>
  );
};

export default Bookmark;
