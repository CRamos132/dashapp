import { Box, Button, Flex, Grid, Heading, Image, Menu, MenuButton, MenuItem, MenuList, useToast } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import { CustomLink } from "../../components/CustomLink";
import { query, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { ILiga } from "../../interfaces/Liga";
import Head from "next/head";
import { useAuth } from "../../contexts/AuthContext";

export default function LigasPage() {
  const auth = useAuth();
  const [ligas, setLigas] = useState<ILiga[]>([] as ILiga[]);
  const toast = useToast()

  async function getLigas() {
    const ligasQuery = query(collection(firestore, "ligas"));

    const ligasQuerySnapshot = await getDocs(ligasQuery);
    const ligas: ILiga[] = [];
    ligasQuerySnapshot.forEach((doc) => {
      const firebaseData = doc.data();
      const ligasData = { id: doc.id, ...firebaseData };
      ligas.push(ligasData as ILiga);
    });
    setLigas(ligas);
    return ligas;
  }

  const { refetch } = useQuery("getLigas", getLigas);

  const handleDelete = (id: string) => {
    return () => {
      deleteDoc(doc(firestore, "ligas", id))
        .then(() => {
          toast({
            title: "Liga deletada",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          refetch()
        })
        .catch((error) => {
          console.log("🚀 ~ error", error)
          toast({
            title: "Algo deu errado",
            description: "Por favor tente novamente mais tarde",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        })
    }
  }

  return (
    <PageWrapper>
      <Head>
        <title>Ligas</title>
      </Head>
      <Flex direction="column" alignItems="center">
        <Heading mt="4" fontSize={30}>
          Ligas
        </Heading>

        {auth.isAdmin && (
          <Flex gap="4" position="absolute" right="5" top="5">
            <CustomLink
              background="gray.100"
              textAlign="center"
              borderRadius="6px"
              padding="2"
              paddingX="4"
              fontWeight="bold"
              color="black"
              _hover={{
                backgroundColor: "gray.200",
              }}
              href={`/ligas/criar`}
            >
              Criar
            </CustomLink>
          </Flex>
        )}

        <Flex direction="column" gap="4" mt="4">
          {ligas.map((liga) => {
            return (
              <Box key={liga.id}>
                <CustomLink
                  width="100%"
                  href={`https://${liga.url}`}
                  target="_blank"
                  color="initial"
                  _hover={{
                    color: "inherit",
                  }}
                >
                  <Flex
                    minHeight="150px"
                    width="250px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    borderRadius="24px"
                    backgroundColor="blue.200"
                    padding="8px"
                    textAlign="center"
                    position="relative"
                  >
                    <Box
                      width="100%"
                      as="h2"
                      fontSize="1.2rem"
                      fontWeight="bold"
                    >
                      {liga?.nome || liga.titulo}
                    </Box>
                    <Grid
                      padding="2"
                      gridTemplateColumns="1fr 1fr"
                      alignItems="center"
                      gap="4"
                    >
                      <Box justifySelf="flex-start">
                        {liga?.org === "Team DASH" ? (
                          <Image
                            src="https://firebasestorage.googleapis.com/v0/b/dash-app-87d27.appspot.com/o/img_org%2FTeam_DASH?alt=media&token=fd810331-ab45-49c5-9bac-2b1013f172a5"
                            alt="Team Dash"
                          />
                        ) : (
                          <Box>lista.org</Box>
                        )}
                      </Box>
                      <Box
                        backgroundColor="white"
                        borderRadius="6"
                        color="blue.400"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {liga.jogo}
                      </Box>
                    </Grid>
                  </Flex>
                </CustomLink>
                {
                  auth.isAdmin ? (
                    <Flex>
                      <Menu>
                        <MenuButton as={Button} >
                          ...
                        </MenuButton>
                        <MenuList>
                          <MenuItem>
                            <CustomLink
                              background="gray.100"
                              textAlign="center"
                              borderRadius="6px"
                              padding="2"
                              paddingX="4"
                              fontWeight="bold"
                              color="black"
                              _hover={{
                                backgroundColor: "gray.200",
                              }}
                              href={`/ligas/${liga.id}/editar`}
                            >
                              Editar
                            </CustomLink>
                          </MenuItem>
                          <MenuItem>
                            <Button onClick={handleDelete(liga.id)}>
                              Deletar
                            </Button>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  ) : null
                }
              </Box>
            );
          })}
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
