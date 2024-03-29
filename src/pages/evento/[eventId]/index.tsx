import { useRouter } from "next/router";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  Flex,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import PageWrapper from "../../../components/PageWrapper";
import { firestore } from "../../../lib/firebase";
import { IEvent, IEventSubscriber } from "../../../interfaces/Event";
import convertToCSV from "../../../utils/convertToCSV";
import { useAuth } from "../../../contexts/AuthContext";
import { SubscribersList } from "../../../components/SubscribersList";
import { CustomLink } from "../../../components/CustomLink";
import { getEventById } from "../../../lib/firebase/EventRepository";

function EnterEventButton({ inscritos, handleRemove, handleAdd }: { inscritos?: IEventSubscriber[], handleRemove: (someUser?: IEventSubscriber | undefined) => void, handleAdd: () => void }) {
  const auth = useAuth();
  if (!auth?.user) {
    return null
  }

  const user = inscritos?.find(
    (user) => user.id === auth.user?.uid
  )
  const isUserInTourney = !!user
  return (
    <Flex
      width="80%"
      maxWidth="500px"
      direction="column"
    >
      {!isUserInTourney ? (
        <Button onClick={handleAdd}>Me inscrever</Button>
      ) : (
        <Button onClick={() => { handleRemove() }}>
          Cancelar inscrição
        </Button>
      )}
    </Flex >
  )
}

function EventInformation({
  title,
  information,
}: {
  title: string;
  information: string;
}) {
  return (
    <AccordionItem>
      <Button as="h2" width="100%">
        <AccordionButton>
          <Box flex="1" textAlign="center">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Button>
      <AccordionPanel
        padding="32px"
        backgroundColor="white"
        borderRadius="12px"
      >
        {information.split("<br>").map((text, index) => {
          return (
            (
              <>
                <p key={`${text}-${index}`}>{text}</p>
                <br />
              </>
            )
          )
        })}
      </AccordionPanel>
    </AccordionItem>
  );
}

export default function EventPage() {
  const auth = useAuth();
  const toast = useToast();
  const router = useRouter();
  const { eventId } = router.query;

  const { isLoading, data, refetch } = useQuery(
    `event-${eventId}`,
    async () => {
      const event = getEventById(eventId as string);
      return event
    }
  );

  const handleCopy = () => {
    if (data?.inscritos) {
      const userList = data?.inscritos.map((user) => {
        return { jogador: user.nome };
      });
      const csvData = convertToCSV(userList);
      navigator.clipboard.writeText(csvData).then(() => {
        toast({
          title: "Lista copiada.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      });
    }
  };

  const handleAdd = () => {
    const user = {
      id: auth.user?.uid,
      nome: auth.aditionalData?.apelido || auth.user?.displayName,
      foto: auth.aditionalData?.foto || "img/default-profile.png",
      ...(auth.aditionalData?.fidelidash && {
        fidelidash: auth.aditionalData?.fidelidash,
      }),
    };
    updateDoc(doc(firestore, "eventos", eventId as string), {
      inscritos: arrayUnion(user),
    })
      .then((data) => {
        refetch();
        toast({
          title: "Inscrição realizada com sucesso.",
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

  const handleRemove = (someUser?: IEventSubscriber) => {
    const user =
      someUser && auth.isAdmin
        ? someUser
        : {
          id: auth.user?.uid,
          nome: auth.user?.displayName,
          foto: auth.aditionalData?.foto || "img/default-profile.png",
          ...(auth.aditionalData?.fidelidash && {
            fidelidash: auth.aditionalData?.fidelidash,
          }),
        };
    updateDoc(doc(firestore, "eventos", eventId as string), {
      inscritos: arrayRemove(user),
    })
      .then(() => {
        refetch();
        toast({
          title: "Inscrição cancelada com sucesso.",
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

  const defaultSocialMediaText = `Eu%20me%20registrei%20em%20${data?.titulo}`;

  if (isLoading || !data) {
    <p>Carregando...</p>;
  }

  const isUserSubscribedToTheEvent = data?.inscritos?.find(
    (u) => u.id === auth.user?.uid
  );

  return (
    <PageWrapper>
      <Box padding="24px">
        <Flex
          direction="column"
          backgroundColor="gray.300"
          borderRadius="12px"
          padding="12px"
          position="relative"
        >
          {
            auth.isAdmin && (
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
                  href={`/evento/${eventId}/duplicar`}
                >
                  Duplicar
                </CustomLink>
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
                  href={`/evento/${eventId}/editar`}
                >
                  Editar
                </CustomLink>
              </Flex>
            )
          }
          <Box
            as="h1"
            fontSize="1.5rem"
            fontWeight="bold"
            width="100%"
            textAlign="center"
            margin="12px 0"
            mt={["14", "12", "12", "12", "4"]}
          >
            {data?.titulo}
          </Box>
          <Flex
            direction="column"
            gridRowGap="8px"
            alignItems="center"
            width="100%"
            margin="12px auto"
          >

            <Accordion allowMultiple width="80%" maxWidth="500px" display='flex' flexDir='column' rowGap='8px'>
              {data?.regras && (
                <EventInformation information={data.regras} title="Regras" />
              )}
              {data?.local && (
                <EventInformation information={data.local} title="Local" />
              )}
              {data?.stagelist && (
                <EventInformation
                  information={data.stagelist}
                  title="Stagelist"
                />
              )}
            </Accordion>
            {data?.bracket && (
              <Button
                as="a"
                href={data.bracket}
                target="_blank"
                rel="noopener"
                width="80%"
                maxWidth="500px"
              >
                Go to Bracket
              </Button>
            )}

            <Box maxW={500} margin="0px auto">
              {data?.sobre.split("<br>").map((text, index) => {
                return (
                  (
                    <>
                      <p key={`${text}-${index}`}>{text}</p>
                      <br />
                    </>
                  )
                )
              })}
            </Box>
          </Flex>
          {data?.inscricao === "local" ? (
            <>
              <Box
                as="h2"
                fontSize="1.3rem"
                width="100%"
                textAlign="center"
                fontWeight="bold"
                margin="12px 0 4px"
              >
                Lista de jogadores
              </Box>
              <Box
                as="h3"
                fontSize="1.1rem"
                width="100%"
                textAlign="center"
                fontWeight="bold"
                margin="8px 0"
              >
                {data?.inscritos?.length} Inscritos
              </Box>
              <Flex direction="column" alignItems="center" gridRowGap="8px">
                {auth.isAdmin ? (
                  <Button onClick={handleCopy}>
                    Copiar lista de jogadores
                  </Button>
                ) : (
                  ""
                )}
                <EnterEventButton inscritos={data?.inscritos} handleAdd={handleAdd} handleRemove={handleRemove} />
                {isUserSubscribedToTheEvent && (
                  <CustomLink
                    href={`https://twitter.com/intent/tweet?via=TeamDASHBR&text=${data?.socialMediaText || defaultSocialMediaText
                      }`}
                    width="80%"
                    maxWidth="500px"
                    background="gray.100"
                    textAlign="center"
                    borderRadius="6px"
                    padding="6px"
                    fontWeight="bold"
                    color="black"
                    _hover={{
                      backgroundColor: "gray.200",
                    }}
                  >
                    Tweet
                  </CustomLink>
                )}
                {data?.inscritos && (
                  <SubscribersList
                    eventId={data.id}
                    subscribers={data.inscritos}
                    removeSubscriber={auth.isAdmin ? handleRemove : undefined}
                  />
                )}
              </Flex>
            </>
          ) : (
            <Button as="a" href={data?.bracket} target="_blank" rel="noopener">
              Ir para o Start.gg
            </Button>
          )}
        </Flex>
      </Box>
    </PageWrapper>
  );
}
