import { TNewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID } from "appwrite";

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
    return error;
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
