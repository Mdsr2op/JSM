import { TNewPost, TNewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Models, Query } from "appwrite";

export async function createUserAccount(user: TNewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.fullname
    );

    if (!newAccount) {
      throw new Error("Account not created");
    }

    const avatarUrl = avatars.getInitials(user.fullname);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  username: string;
  fullname: string;
  imageUrl: URL;
  email: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAccount() {
  try {
    const currentUser = await account.get();
    return currentUser;
  } catch (error) {
    console.error(error);
  }
}

export async function getUser() {
  try {
    const account = await getAccount();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", account ? account.$id : "")]
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user.documents[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(post: TNewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) {
      throw new Error("Failed to upload file");
    }

    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw new Error("Failed to fetch file URL");
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Could not create a new post");
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) {
      throw new Error("Failed to fetch posts");
    }

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) {
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const newSave = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        posts: postId,
        user: userId,
      }
    );

    if (!newSave) {
      throw Error;
    }

    return newSave;
  } catch (error) {
    console.log(error);
  }
}

export async function unsavePost(saveRecordID: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      saveRecordID
    );
    if (!statusCode) {
      throw Error;
    }

    return { status: "ok" };
  } catch (error) {
    console.log(error)
  }
}
