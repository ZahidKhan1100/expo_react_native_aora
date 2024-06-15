import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.zahid.aora",
  projectId: "666a2834003b05ca5300",
  databaseId: "666a29cf0019ecfb34e4",
  userCollectionId: "666a2a1200221cf302fd",
  videoCollectionId: "666a2a49003d42e06b55",
  storageId: "666a2c8d000b3441fb5d",
  likesCollectionId: "666db7d5002f2ea56279",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
  likesCollectionId,
} = config;
// Init your React Native SDK
const client = new Client();
const storage = new Storage(client);
const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatar.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVideoPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const formData = {
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creator: form.userId,
    };

    console.log("formData", formData); // Correct logging

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      formData
    );

    return newPost;
  } catch (error) {
    console.error("Error creating video post:", error);
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  console.log("Uploading asset:", asset.name);

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    console.log("Uploaded file:", uploadedFile);

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    console.log("File URL:", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    console.log(`Getting preview for file ID: ${fileId} of type: ${type}`);

    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
      console.log(`Video URL returned by storage.getFileView: ${fileUrl}`);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
      console.log(`Image URL returned by storage.getFilePreview: ${fileUrl}`);
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("Failed to get file URL");

    return fileUrl;
  } catch (error) {
    console.error("Error getting file preview:", error);
    throw new Error(error);
  }
};

export const likeVideo = async (data) => {
  try {
    const result = await databases.createDocument(
      databaseId,
      likesCollectionId,
      ID.unique(),
      {
        userId: [data.userId],
        userId_plain: data.userId,
        videoId: [data.videoId],
        videoId_plain: data.videoId,
      }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLikedVideos = async (userId) => {
  console.log("userId", userId);
  try {
    const likedVideos = await databases.listDocuments(
      databaseId,
      likesCollectionId,
      [Query.equal("userId_plain", userId)]
    );

    console.log("likedVideos", likedVideos);

    const videoIds = likedVideos.documents.map((doc) => doc.videoId_plain);

    if (videoIds.length === 0) {
      return []; 
    }

    const videoDetailsPromises = videoIds.map((videoId) => {
      return databases.getDocument(databaseId, videoCollectionId, videoId);
    });

    const videoDetails = await Promise.all(videoDetailsPromises);

    return videoDetails;
  } catch (error) {
    throw new Error(error);
  }
};
