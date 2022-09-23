import { Box, Flex } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useQuery } from "react-query";
import { firestore } from "../../lib/firebase";

interface IProps {
  name: string;
  id: string;
}

export default function DashMemberCard({ id, name }: IProps) {
  const { data } = useQuery(
    `dash-${id}`,
    async () => {
      const memberDocRef = doc(firestore, "users", id as string);
      const memberDocSnap = await getDoc(memberDocRef);
      return { id: memberDocSnap.data() && memberDocSnap.id, ...memberDocSnap.data() } as any;
    }
  );

  return (
    <Flex backgroundColor='gray.200' padding='20px' borderRadius='8px' direction='column' alignItems='center'>
      {data?.foto && !data?.foto?.includes('img/default-profile.png') && (
        <Box borderRadius='8px' overflow='hidden' height='50px' width='50px'>
          <Image src={data?.foto} alt='imagem de perfil' height={50} width={50} />
        </Box>
      )}
      {name}
    </Flex>
  )
}