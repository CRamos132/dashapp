import { Box, Grid, GridProps, Image, Text } from "@chakra-ui/react";
import { IEventSubscriber } from "../../../interfaces/Event";
import { rankBorders } from "../../../utils/rank";

interface IProps extends GridProps {
  subscriber: IEventSubscriber;
}

export function SubscriberCard({ subscriber, ...props }: IProps) {
  return (
    <Grid
      width="100%"
      templateColumns=".25fr .75fr"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {subscriber.foto !== "img/default-profile.png" ? (
        <Image
          height={12}
          width={12}
          borderRadius="50%"
          src={subscriber.foto}
          alt={subscriber.nome}
          border={
            subscriber.fidelidash ? rankBorders[subscriber.fidelidash] : ""
          }
        />
      ) : (
        <Box
          height={12}
          width={12}
          borderRadius="50%"
          backgroundColor="gray.400"
          border={
            subscriber.fidelidash ? rankBorders[subscriber.fidelidash] : ""
          }
        />
      )}
      <Text ml={4}>{subscriber.nome}</Text>
    </Grid>
  );
}
