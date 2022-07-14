import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDoc, doc, addDoc, collection } from "firebase/firestore";
import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import { firestore } from "../../../lib/firebase";
import PageWrapper from "../../../components/PageWrapper";
import { SubscribersList } from "../../../components/SubscribersList";
import { IEvent } from "../../../interfaces/Event";
import { getUsers } from "../../../lib/firebase/UsersRepository";

export default function DuplicateEventPage() {
  const [eventData, setEventData] = useState<IEvent>({} as IEvent);
  const toast = useToast();

  async function addFidelidashUsers() {
    const fidelidashUsers = await getUsers({ orderBy: "fidelidash" });

    const fidelidashUsersParsed = fidelidashUsers.map((user) => {
      return {
        nome: user.firebaseData?.apelido || "",
        foto: user.firebaseData?.foto || "",
        id: user.id,
        fidelidash: user.firebaseData?.fidelidash || "",
      };
    }) as Required<IEvent>["inscritos"];

    setEventData({ ...eventData, inscritos: fidelidashUsersParsed });
  }

  const handleChange = (e: any) => {
    const newEventData = { ...eventData, [e.target.name]: e.target.value };
    setEventData(newEventData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const submitData = eventData;

    if (submitData.tempo && typeof submitData.tempo !== "number") {
      submitData.tempo = Date.parse(String(submitData.tempo) as string);
    }
    if (submitData.limite && typeof submitData.limite !== "number") {
      submitData.limite = Date.parse(String(submitData.limite) as string);
    }
    submitData.local = submitData.local?.replaceAll(/\r?\n/g, "<br>");
    submitData.sobre = submitData.sobre?.replaceAll(/\r?\n/g, "<br>");
    submitData.stagelist = submitData.stagelist?.replaceAll(/\r?\n/g, "<br>");
    submitData.regras = submitData.regras?.replaceAll(/\r?\n/g, "<br>");
    if (submitData.socialMediaText) {
      submitData.socialMediaText = encodeURIComponent(
        submitData.socialMediaText
      );
    }

    addDoc(collection(firestore, "eventos"), {
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
          <h1>Duplicar evento</h1>
          <FormControl>
            <FormLabel htmlFor="titulo">Título</FormLabel>
            <Input
              id="titulo"
              name="titulo"
              type="text"
              value={eventData?.titulo || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="apelido">Apelido</FormLabel>
            <Input
              id="apelido"
              name="apelido"
              type="text"
              value={eventData?.apelido || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="tempo">Data</FormLabel>
            <Input
              id="tempo"
              name="tempo"
              type="datetime-local"
              value={
                (eventData.tempo &&
                  new Date(eventData.tempo).toISOString().split("Z")[0]) ||
                ""
              }
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="limite">Data limite</FormLabel>
            <Input
              id="limite"
              name="limite"
              type="datetime-local"
              value={
                (eventData.limite &&
                  new Date(eventData.limite).toISOString().split("Z")[0]) ||
                ""
              }
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="cidade">Cidade</FormLabel>
            <Input
              id="cidade"
              name="cidade"
              type="text"
              value={eventData?.cidade || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="uf">UF</FormLabel>
            <Input
              id="uf"
              name="uf"
              type="text"
              value={eventData?.uf || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="local">Local</FormLabel>
            <Textarea
              id="local"
              name="local"
              value={eventData?.local || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="sobre">Sobre</FormLabel>
            <Textarea
              id="sobre"
              name="sobre"
              value={eventData?.sobre || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="regras">Regras</FormLabel>
            <Textarea
              id="regras"
              name="regras"
              value={eventData?.regras || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="stagelist">Stagelist</FormLabel>
            <Textarea
              id="stagelist"
              name="stagelist"
              value={eventData?.stagelist || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="bracket">Bracket</FormLabel>
            <Input
              id="bracket"
              name="bracket"
              type="text"
              value={eventData?.bracket || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="fb">Link do FB</FormLabel>
            <Input
              id="fb"
              name="fb"
              type="text"
              value={eventData?.fb || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="socialMediaText">Texto do tweet</FormLabel>
            <Textarea
              id="socialMediaText"
              name="socialMediaText"
              maxLength={280}
              value={eventData?.socialMediaText || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="url">URL</FormLabel>
            <Input
              id="url"
              name="url"
              type="text"
              value={eventData?.url || ""}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="org">Org</FormLabel>
            <Input
              id="org"
              name="org"
              type="text"
              disabled
              defaultValue={eventData?.org || ""}
            />
          </FormControl>
          <Flex justifyContent="center" width="100%">
            <SubscribersList
              eventId={eventData.id}
              isManageable
              subscribers={eventData.inscritos}
              addFidelidashUsers={addFidelidashUsers}
            />
          </Flex>
          <Button colorScheme="blue" type="submit">
            Criar
          </Button>
        </Flex>
      </form>
    </PageWrapper>
  );
}
