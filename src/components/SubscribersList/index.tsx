import { Button, Flex, Grid } from "@chakra-ui/react";
import { IEvent } from "../../interfaces/Event";
import { SubscriberCard } from "./SubscriberCard";

interface IProps {
  subscribers: IEvent["inscritos"];
  isManageable?: boolean;
  addFidelidashUsers?: () => void;
}

export function SubscribersList({
  subscribers,
  isManageable = false,
  addFidelidashUsers,
}: IProps) {
  return (
    <Grid
      direction="column"
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
        <SubscriberCard key={user.id} subscriber={user} />
      ))}
    </Grid>
  );
}
