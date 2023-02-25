import { Button, Flex, Grid } from "@chakra-ui/react";
import { IEvent, IEventSubscriber } from "../../interfaces/Event";
import { SubscriberCard } from "./SubscriberCard";

interface IProps {
  eventId: string;
  subscribers: IEvent["inscritos"];
  isManageable?: boolean;
  addFidelidashUsers?: () => void;
  removeSubscriber?: (someUser: IEventSubscriber | undefined) => void;
}

export function SubscribersList({
  eventId,
  subscribers,
  isManageable = false,
  addFidelidashUsers,
  removeSubscriber,
}: IProps) {
  return (
    <Grid
      justifyContent="center"
      alignItems="center"
      gap="6"
      borderRadius="16"
      padding="8"
      backgroundColor={"gray.100"}
      width="100%"
      alignSelf="center"
      templateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr 1fr"]}
      justifyItems="center"
    >
      {isManageable && addFidelidashUsers && (
        <Button
          alignSelf="start"
          justifySelf="left"
          gridColumn="1 / 3"
          onClick={() => addFidelidashUsers()}
        >
          Adicionar Fidelidashes
        </Button>
      )}
      {subscribers?.map((user) => (
        <SubscriberCard
          eventId={eventId}
          key={user.id}
          subscriber={user}
          removeSubscriber={removeSubscriber}
        />
      ))}
    </Grid>
  );
}
