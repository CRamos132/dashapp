import { updateDoc, doc, getDoc } from "firebase/firestore";
import { Button, Flex, FormControl, FormLabel, Heading, Input, useToast } from "@chakra-ui/react";
import { firestore } from "../../../lib/firebase";
import PageWrapper from "../../../components/PageWrapper";
import { ILiga } from "../../../interfaces/Liga";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditEventPage() {
  const [leagueData, setLeagueData] = useState<ILiga>({} as ILiga);
  const toast = useToast();
  const router = useRouter();
  const { asPath } = router;
  const ligaId = asPath.split("/")[2];

  const getLeague = async () => {
    if (!ligaId || ligaId === "[ligaId]") return;
    
    const ligaQuery = doc(firestore, "ligas", ligaId as string);
    const ligasQuerySnapshot = await getDoc(ligaQuery);
    const leagueData = { id: ligasQuerySnapshot.id, ...ligasQuerySnapshot.data() } as ILiga;

    setLeagueData(leagueData);
  };

  useEffect(() => {
    getLeague();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ligaId]);
  
  const handleChange = (e: any) => {
    const newEventData = { ...leagueData, [e.target.name]: e.target.value };
    setLeagueData(newEventData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const submitData = leagueData;
    if(!submitData.org) {
      submitData.org = 'Team DASH'
    }

    updateDoc(doc(firestore, "ligas", ligaId as string), {
      ...submitData,
    })
      .then((data) => {
        toast({
          title: "Evento criado com sucesso.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Algo deu errado.",
          description: error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <PageWrapper>
      <form onSubmit={handleSubmit}>
      <Flex
      direction="column"
      width="70%"
      margin="50px auto"
      align="center"
      gridRowGap="24px"
    >
      <Heading>Criar Liga</Heading>
      <FormControl>
        <FormLabel htmlFor="titulo">Título</FormLabel>
        <Input
          id="titulo"
          name="titulo"
          type="text"
          required
          value={leagueData?.titulo || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="nome">Nome</FormLabel>
        <Input
          id="nome"
          name="nome"
          type="text"
          required
          value={leagueData?.nome || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="prioridade">Prioridade</FormLabel>
        <Input
          id="prioridade"
          name="prioridade"
          type="number"
          required
          value={leagueData?.prioridade || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="jogo">Jogo</FormLabel>
        <Input
          id="jogo"
          name="jogo"
          type="text"
          required
          value={leagueData?.jogo || ""}
          onChange={handleChange}
        />
      </FormControl>
      
      <FormControl>
        <FormLabel htmlFor="url">URL</FormLabel>
        <Input
          id="url"
          name="url"
          type="text"
          value={leagueData?.url || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="org">Org</FormLabel>
        <Input
          id="org"
          name="org"
          type="text"
          required
          disabled
          defaultValue={'Team DASH' || ""}
        />
      </FormControl>
      
      <Button colorScheme="blue" type="submit">
        Editar
      </Button>
    </Flex>
      </form>
    </PageWrapper>
  );
}
