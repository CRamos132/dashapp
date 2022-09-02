import { useState } from "react";
import { useQuery } from "react-query";
import { IUser } from "../interfaces/User";
import { getUsers } from "../lib/firebase/UsersRepository";

const fidelidashOrder = {
  platina: 0,
  ouro: 1,
  prata: 2,
  bronze: 3,
  last: 1000,
};

const useFidelidash = (sortByName?: boolean) => {
  const [fidelidash, setFidelidash] = useState<IUser[]>([] as IUser[]);

  const sortFidelidash = (fidelidash: IUser[]) => {
    if (sortByName) {
      return fidelidash.sort(
        (a, b) => {
          const nameA = a?.firebaseData?.apelido || ''
          const nameB = b.firebaseData?.apelido || ''
          return nameA.localeCompare(nameB)
        }
      );
    }

    return fidelidash.sort(
      (a, b) =>
        fidelidashOrder[a?.firebaseData?.fidelidash || "last"] -
        fidelidashOrder[b.firebaseData?.fidelidash || "last"]
    );
  };

  async function getFidelidash() {
    const fidelidashUsers = await getUsers({ orderBy: "fidelidash" });
    const fidelidashUsersFiltered = fidelidashUsers.filter(
      (u) => u.firebaseData?.fidelidash
    );
    setFidelidash(sortFidelidash(fidelidashUsersFiltered));
    return fidelidashUsers;
  }

  useQuery("getFidelidash", getFidelidash);

  return (fidelidash)
}

export default useFidelidash