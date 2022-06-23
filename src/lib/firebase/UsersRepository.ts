import { firestore } from "../firebase";
import { collection, query, getDocs, orderBy as firestoreOrderBy } from "firebase/firestore";
import { IUser } from "../../interfaces/User";

interface IGetUsersArgs {
  orderBy?: string;
}

export async function getUsers({ orderBy }: IGetUsersArgs): Promise<IUser[]> {
  const queryArguments = [];
  if (orderBy) {
    queryArguments.push(firestoreOrderBy(orderBy));
  }

  const usersQuery = query(
    collection(firestore, "users"),
    ...queryArguments
  );

  const usersQuerySnapshot = await getDocs(usersQuery);
  const users: IUser[] = [];
  usersQuerySnapshot.forEach((doc) => {
    const firebaseData = doc.data() as IUser["firebaseData"];
    const userData: IUser = { id: doc.id, firebaseData };
    users.push(userData);
  });

  return users;
}
