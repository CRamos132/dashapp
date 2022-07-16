import { Box, Flex, Grid, Heading, Image } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import { CustomLink } from "../../components/CustomLink";
import { query, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../lib/firebase";
import { ILiga } from "../../interfaces/Liga";
import Head from "next/head";
import { useAuth } from "../../contexts/AuthContext";

export default function LigasPage() {
  const auth = useAuth();
  const [ligas, setLigas] = useState<ILiga[]>([] as ILiga[]);

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

  useQuery("getLigas", getLigas);

  return (
    <PageWrapper>
      <Head>
        <title>Ligas</title>
      </Head>
      <Flex direction="column" alignItems="center">
        <Heading mt="4" fontSize={30}>
          Ligas
        </Heading>

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

        <Flex direction="column" gap="4" mt="4">
          {ligas.map((liga) => {
            return (
              <CustomLink
                key={liga.id}
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
                  {auth.isAdmin && (
                    <Flex gap="4" position="absolute" right="5">
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
                    </Flex>
                  )}

                  <Box width="100%" as="h2" fontSize="1.2rem" fontWeight="bold" mt={`${auth.isAdmin ? "12" : "0"}`}>
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
            );
          })}
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
