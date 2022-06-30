import { Box, GridProps, Image } from "@chakra-ui/react";
import { FidelidashRanks } from "../../interfaces/User";
import { rankBorders } from "../../utils/rank";

interface IProps extends GridProps {
  userData: {
    foto?: string;
    nome: string;
    fidelidash?: FidelidashRanks;
  };
}

export function UserPicture({ userData }: IProps) {
  return (
    <Box>
      {userData.foto !== "img/default-profile.png" ? (
        <Image
          height={24}
          width={24}
          borderRadius="50%"
          src={userData.foto || ""}
          alt={userData.nome}
          border={userData.fidelidash ? rankBorders[userData.fidelidash] : ""}
        />
      ) : (
        <Box
          height={24}
          width={24}
          borderRadius="50%"
          backgroundColor="gray.400"
          border={userData.fidelidash ? rankBorders[userData.fidelidash] : ""}
        />
      )}
    </Box>
  );
}
