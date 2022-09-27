import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import {
  useToast,
} from "@chakra-ui/react";
import { firestore } from "../../../lib/firebase";
import PageWrapper from "../../../components/PageWrapper";
import { IEvent, IEventSubscriber } from "../../../interfaces/Event";
import { getUsers } from "../../../lib/firebase/UsersRepository";
import EventForm from "../../../components/EventForm";

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

  const handleCheckbox = (value: any) => {
    const newEventData = { ...eventData, jogos: value };
    setEventData(newEventData);
  }

  const handleRemoveFidelidash = (user?: IEventSubscriber) => {
    if (!eventData?.inscritos?.length) return
    const listWithoutUSer = eventData.inscritos?.filter(item => item.id !== user?.id)
    const newEventData = {
      ...eventData,
      inscritos: listWithoutUSer
    }
    setEventData(newEventData)
  }

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
    submitData.org = 'Team DASH'
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
        <EventForm
          addFidelidashUsers={addFidelidashUsers}
          eventData={eventData}
          handleChange={handleChange}
          handleCheckbox={handleCheckbox}
          handleRemoveFidelidash={handleRemoveFidelidash}
        />
      </form>
    </PageWrapper>
  );
}
