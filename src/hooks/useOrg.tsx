import { collection, getDocs, query } from "firebase/firestore";
import { useQuery } from "react-query";
import { firestore } from "../lib/firebase";

export default function useOrg() {

    const queryResult = useQuery("getOrg", async () => {
        const usersQuery = query(collection(firestore, "dash"));

        const usersQuerySnapshot = await getDocs(usersQuery);
        const users: any[] = [];
        usersQuerySnapshot.forEach((doc) => {
            const firebaseData = doc.data();
            const userData = { id: doc.id, ...firebaseData };
            users.push(userData);
        });

        return users;
    });

    return queryResult
}