import { Box, Flex, Grid, Heading, Text, Image } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { IUser } from "../interfaces/User";
import { getUsers } from "../lib/firebase/UsersRepository";
import { rankBorders } from "../utils/rank";
import { CustomLink } from "../components/CustomLink";
import Head from "next/head";

export default function FidelidashPage() {
  const [fidelidash, setFidelidash] = useState<IUser[]>([] as IUser[]);

  async function getFidelidash() {
    const fidelidashUsers = await getUsers({ orderBy: "fidelidash" });
    setFidelidash(fidelidashUsers);
    return fidelidashUsers;
  }

  useQuery("getFidelidash", getFidelidash);

  return (
    <PageWrapper>
      <Head>
        <title>Ligas</title>
      </Head>
      <Flex direction="column" alignItems="center">
        <Heading mt="4" fontSize={30}>
          Fidelidash
        </Heading>

        <Flex direction="column" gap="4" mt="4">
          {fidelidash.map((user) => {
            return (
              <CustomLink
                key={user.id}
                width="100%"
                href={`/user/${user.id}`}
                color="initial"
              >
                <Grid
                  width="100%"
                  templateColumns=".25fr .75fr"
                  alignItems="center"
                  justifyContent="center"
                >
                  {user.firebaseData?.foto !== "img/default-profile.png" ? (
                    <Image
                      height={12}
                      width={12}
                      borderRadius="50%"
                      src={user.firebaseData?.foto}
                      alt={user.firebaseData?.nome}
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
                  <Text ml={4}>{user.firebaseData?.nome}</Text>
                </Grid>
              </CustomLink>
            );
          })}
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
