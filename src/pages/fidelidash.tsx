import { Box, Flex, Grid, Heading, Text, Image } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { IUser } from "../interfaces/User";
import { getUsers } from "../lib/firebase/UsersRepository";
import { rankBorders } from "../utils/rank";
import { CustomLink } from "../components/CustomLink";
import Head from "next/head";

const fidelidashOrder = {
  platina: 0,
  ouro: 1,
  prata: 2,
  bronze: 3,
  last: 1000,
};

const sortFidelidash = (fidelidash: IUser[]) => {
  return fidelidash.sort(
    (a, b) =>
      fidelidashOrder[a?.firebaseData?.fidelidash || "last"] -
      fidelidashOrder[b.firebaseData?.fidelidash || "last"]
  );
};

export default function FidelidashPage() {
  const [fidelidash, setFidelidash] = useState<IUser[]>([] as IUser[]);

  async function getFidelidash() {
    const fidelidashUsers = await getUsers({ orderBy: "fidelidash" });
    const fidelidashUsersFiltered = fidelidashUsers.filter(
      (u) => u.firebaseData?.fidelidash
    );
    setFidelidash(sortFidelidash(fidelidashUsersFiltered));
    return fidelidashUsers;
  }

  useQuery("getFidelidash", getFidelidash);

  return (
    <PageWrapper>
      <Head>
        <title>Ligas</title>
      </Head>
      <Heading mt="4" fontSize={30} textAlign="center">
        Fidelidash
      </Heading>

      <Flex direction="column" gap="4" mt="4" alignItems="center">
        {fidelidash.map((user) => {
          return (
            <CustomLink
              key={user.id}
              width="100%"
              href={`/user/${user.id}`}
              color="initial"
              maxWidth="300px"
            >
              <Grid
                minWidth="fit-content"
                templateColumns=".2fr .8fr"
                alignItems="center"
                justifyContent="center"
              >
                {user.firebaseData?.foto !== "img/default-profile.png" ? (
                  <Image
                    height={12}
                    width={12}
                    borderRadius="50%"
                    src={user.firebaseData?.foto}
                    alt={user.firebaseData?.apelido}
                    border={
                      user.firebaseData?.fidelidash
                        ? rankBorders[user.firebaseData?.fidelidash]
                        : ""
                    }
                  />
                ) : (
                  <Box
                    height={12}
                    width={12}
                    borderRadius="50%"
                    backgroundColor="gray.400"
                    border={
                      user.firebaseData?.fidelidash
                        ? rankBorders[user.firebaseData?.fidelidash]
                        : ""
                    }
                  />
                )}
                <Text ml={4}>{user.firebaseData?.apelido}</Text>
              </Grid>
            </CustomLink>
          );
        })}
      </Flex>
    </PageWrapper>
  );
}
