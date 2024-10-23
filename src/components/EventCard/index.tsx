import {
  Box,
  Flex,
  Menu,
  Button,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GamesTypes, IEvent } from "../../interfaces/Event";

interface IProps {
  event: IEvent;
}

function GamesSection({ games }: { games: string[] }) {
  const getGame = (game: GamesTypes) => {
    const games = {
      ult: "Ultimate",
      mq: "64",
      melee: "Melee",
      pm: "P+",
      mk: "Mario Kart",
      sf: "Street Fighter",
      tekken: "Tekken",
      rivals: "Rivals of Aether 2",
    };
    const currentGame = games?.[game];
    return currentGame ?? "--";
  };

  const mainGames = useMemo(() => {
    return games.slice(0, 2);
  }, [games]);

  const aditionalGames = useMemo(() => {
    const gamesList = games.slice(2);
    const gamesNames = gamesList.map((item) => getGame(item as any));
    return gamesNames;
  }, [games]);

  return (
    <Flex
      direction="row"
      wrap="wrap"
      width="100%"
      justifyContent="space-evenly"
      marginTop="8px"
    >
      {mainGames.map((item) => {
        return (
          <Image
            key={item}
            src={`/${item}.png`}
            width={100}
            height={45}
            alt={getGame(item as any)}
          />
        );
      })}
      {Boolean(aditionalGames.length) && (
        <Tooltip label={aditionalGames.join(", ")}>
          <Button
            fontSize={24}
            marginTop="8px"
            backgroundColor="transparent"
            colorScheme="blue"
            type="button"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            +
          </Button>
        </Tooltip>
      )}
    </Flex>
  );
}

export default function EventCard({ event }: IProps) {
  const auth = useAuth();
  const getDate = () => {
    const date = new Date(event?.tempo);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const gamesList = useMemo(() => {
    const jogos = event?.jogos ?? {};
    const games = Object.keys(jogos).filter(
      (item) => (event?.jogos as any)?.[item]
    );
    return games.sort().reverse();
  }, [event?.jogos]);

  return (
    <Flex as="button" direction="column" alignItems="flex-end" cursor="pointer">
      <Link href={`/evento/${event.id}`} passHref>
        <Flex
          minHeight="150px"
          width="250px"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          borderRadius="24px"
          backgroundColor="#162542"
          color="white"
          padding="8px"
        >
          <Box width="100%" as="h2" fontSize="1.2rem" fontWeight="bold">
            {event?.apelido || event.titulo}
          </Box>
          <Box>
            {getDate()} - {event?.cidade}, {event?.uf}
          </Box>
          <GamesSection games={gamesList} />
        </Flex>
      </Link>
      {auth.isAdmin ? (
        <Flex>
          <Menu>
            <MenuButton as={Button}> {"..."} </MenuButton>
            <MenuList>
              <MenuItem>
                <Link href={`/evento/${event.id}/duplicar`}> Duplicar </Link>
              </MenuItem>
              <MenuItem>
                <Link href={`/evento/${event.id}/editar`}> Editar </Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : null}
    </Flex>
  );
}
