import { TNewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID, Models, Query} from "appwrite";

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

export async function signInAccount(user: { username: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.username, user.password);
    return session;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAccount() {
  try {
    const currentUser = account.get();
    return currentUser;
  } catch (error) {
    console.error(error)
  }
}

export async function getUserAccount(){
  try {
    const account = await getAccount();
    
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", account ? account.$id : "")]
    );
    
    if(!user){
      throw new Error("User not found");
    }

    return user.documents[0];
  } catch (error) {
    console.error(error)
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
