import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { firestore } from "../../../lib/firebase";
import PageWrapper from "../../../components/PageWrapper";
import { IEvent, IEventSubscriber } from "../../../interfaces/Event";
import { getUsers } from "../../../lib/firebase/UsersRepository";
import { getEventById } from "../../../lib/firebase/EventRepository";
import EventForm from "../../../components/EventForm";

export default function EditEventPage() {
  const [eventData, setEventData] = useState<IEvent>({} as IEvent);
  const toast = useToast();
  const router = useRouter();
  const { eventId } = router.query;


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

    const actualSubscribers = eventData.inscritos || [];
    const subscribers = [...actualSubscribers, ...fidelidashUsersParsed];

    // remove duplicated
    const ids: any[] = [];
    const deduplicatedSubscribers = subscribers.filter((subscriber) => {
      const alreadyExists = ids.includes(subscriber.id);
      if (alreadyExists) {
        return false;
      }

      ids.push(subscriber.id);
      return subscriber;
    });

    setEventData({ ...eventData, inscritos: deduplicatedSubscribers });
  }

  const getEvent = async () => {
    if (!eventId || eventId === "[eventId]") return;
    const eventData = await getEventById(eventId as string);

    if (eventData) {
      if (eventData?.local) {
        const clean = eventData.local.replace(/<br>/g, "\r\n");
        eventData.local = clean;
      }
      if (eventData?.sobre) {
        const clean = eventData.sobre.replace(/<br>/g, "\r\n");
        eventData.sobre = clean;
      }
      if (eventData?.regras) {
        const clean = eventData.regras.replace(/<br>/g, "\r\n");
        eventData.regras = clean;
      }
      if (eventData?.stagelist) {
        const clean = eventData.stagelist.replace(/<br>/g, "\r\n");
        eventData.stagelist = clean;
      }
      eventData.inscritos = eventData.inscritos || [];
      setEventData(eventData);
    }
  };

  useEffect(() => {
    getEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const handleChange = (e: any) => {
    const newEventData = { ...eventData, [e.target.name]: e.target.value };
    setEventData(newEventData);
  };

  const handleCheckbox = (value: any) => {
    const newEventData = { ...eventData, jogos: value };
    setEventData(newEventData);
  }

  const handleDelete = () => {
    deleteDoc(doc(firestore, "eventos", eventId as string))
      .then(() => {
        toast({
          title: "Evento deletado com sucesso.",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
        router.push('/')
      })
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
    submitData.sobre = submitData.sobre.replaceAll(/\r?\n/g, "<br>");
    submitData.stagelist = submitData.stagelist.replaceAll(/\r?\n/g, "<br>");
    submitData.regras = submitData.regras.replaceAll(/\r?\n/g, "<br>");
    submitData.org = 'Team DASH'
    if (submitData.socialMediaText) {
      submitData.socialMediaText = encodeURIComponent(
        submitData.socialMediaText
      );
    }

    updateDoc(doc(firestore, "eventos", eventId as string), {
      ...submitData,
    })
      .then((data) => {
        toast({
          title: "Evento editado com sucesso.",
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
      <Flex>
        <Button onClick={handleDelete}>Deletar evento</Button>
      </Flex>
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
