import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Textarea,
  Button
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEventHandler } from "react";
import { IEvent, IEventSubscriber } from "../../interfaces/Event";
import { capitalizeFirstLetter } from "../../utils/string";
import { SubscribersList } from "../SubscribersList";

interface IProps {
  eventData: IEvent
  handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  addFidelidashUsers: () => Promise<void>
  handleRemoveFidelidash: (user?: IEventSubscriber) => void
}

export default function EventForm({ eventData, handleChange, addFidelidashUsers, handleRemoveFidelidash }: IProps) {
  const router = useRouter()
  const location = router.pathname.split('/')
  const locationName = capitalizeFirstLetter(location[location.length - 1])
  return (
    <Flex
      direction="column"
      width="70%"
      margin="50px auto"
      align="center"
      gridRowGap="24px"
    >
      <h1>{locationName} evento</h1>
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
          type="date"
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
          type="datetime"
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
        <FormLabel htmlFor="sobre">Local</FormLabel>
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
          removeSubscriber={handleRemoveFidelidash}
        />
      </Flex>
      <Button colorScheme="blue" type="submit">
        Editar
      </Button>
    </Flex>
  )
}