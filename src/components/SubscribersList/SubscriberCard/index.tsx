import { Box, Button, Grid, GridProps, Image, Text } from "@chakra-ui/react";
import { IEventSubscriber } from "../../../interfaces/Event";
import { rankBorders } from "../../../utils/rank";
import { CustomLink } from "../../CustomLink";

interface IProps extends GridProps {
  eventId: string;
  subscriber: IEventSubscriber;
  removeSubscriber?: (someUser?: IEventSubscriber) => void;
}

export function SubscriberCard({
  eventId,
  subscriber,
  removeSubscriber,
  ...props
}: IProps) {
  return (
    <CustomLink width="100%" href={`/user/${subscriber.id}`} color="initial">
      <Grid
        width="100%"
        templateColumns=".25fr .75fr"
        alignItems="center"
        justifyContent="center"
        justifyItems={["center", "center", "initial"]}
        position="relative"
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
        {removeSubscriber && (
          <Button
            position="absolute"
            right="0"
            onClick={(e: any) => {
              e.preventDefault()
              removeSubscriber(subscriber);
            }}
          >
            X
          </Button>
        )}
      </Grid>
    </CustomLink>
  );
}
