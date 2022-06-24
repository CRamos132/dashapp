/* eslint-disable react-hooks/rules-of-hooks */
import { firestore } from "../firebase";
import {
  collection,
  query,
  getDocs,
  orderBy as firestoreOrderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { IFirebaseUserData, IUser } from "../../interfaces/User";

interface IGetUsersArgs {
  orderBy?: string;
}

export async function getUsers({ orderBy }: IGetUsersArgs): Promise<IUser[]> {
  const queryArguments = [];
  if (orderBy) {
    queryArguments.push(firestoreOrderBy(orderBy));
  }

  const usersQuery = query(collection(firestore, "users"), ...queryArguments);

  const usersQuerySnapshot = await getDocs(usersQuery);
  const users: IUser[] = [];
  usersQuerySnapshot.forEach((doc) => {
    const firebaseData = doc.data() as IUser["firebaseData"];
    const userData: IUser = { id: doc.id, firebaseData };
    users.push(userData);
  });

  return users;
}

export async function getUserById(userId: string): Promise<IFirebaseUserData> {
  const docRef = doc(firestore, "users", userId as string);
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() } as IFirebaseUserData;
}

interface IUpdateUserArgs {
  userId: string;
  userData: IFirebaseUserData;
}

export async function updateUser({ userId, userData }: IUpdateUserArgs) {
  const response = updateDoc(doc(firestore, "users", userId as string), {
    ...userData,
  })
    .then((data) => {
      return {success: true, error: false};
    })
    .catch((error) => {
      return { success: false, error };
    });
  return response;
}
