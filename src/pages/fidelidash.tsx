import { Box, Flex, Grid, Heading, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { IUser } from "../interfaces/User";
import { getUsers } from "../lib/firebase/UsersRepository";

const userBorders = {
  ouro: "2px solid yellow",
  prata: "2px solid silver",
};

export default function FidelidashPage() {
  const [fidelidash, setFidelidash] = useState<IUser[]>([] as IUser[]);

  async function getFidelidash() {
    const fidelidashUsers = await getUsers({ orderBy: "fidelidash" });
    setFidelidash(fidelidashUsers);
  }

  useEffect(() => {
    getFidelidash();
  }, []);

  return (
    <PageWrapper>
      <Flex direction="column" alignItems="center">
        <Heading fontSize={30}>Fidelidash</Heading>

        <Flex direction="column" gap="4" mt="4">
          {fidelidash.map((user) => {
            return (
              <Grid
                key={user.id}
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
                        ? userBorders[user.firebaseData?.fidelidash]
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
                        ? userBorders[user.firebaseData?.fidelidash]
                        : ""
                    }
                  />
                )}
                <Text ml={4}>{user.firebaseData?.nome}</Text>
              </Grid>
            );
          })}
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
