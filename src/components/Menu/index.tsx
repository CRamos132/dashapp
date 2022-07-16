import { Flex } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill, BsFillPersonCheckFill } from "react-icons/bs";
import { FaTrophy, FaUsers } from "react-icons/fa";

import { useAuth } from "../../contexts/AuthContext";
import { CustomLink } from "../CustomLink";
import IconButton from "../IconButton";

function MenuContent() {
  const auth = useAuth();
  return (
    <>
      <Flex flexDir={["row", "column"]} gridGap="18px">
        <CustomLink href="/" color="initial" _hover={{ color: "initial" }}>
          <IconButton aria-label="Home" as={AiFillHome} w={12} h={12} />
        </CustomLink>
        <CustomLink
          href="/fidelidash"
          color="initial"
          _hover={{ color: "initial" }}
        >
          <IconButton aria-label="Fidelidash" as={FaUsers} w={12} h={12} />
        </CustomLink>
        <CustomLink
          href="/ligas"
          color="initial"
          _hover={{ color: "initial" }}
        >
          <IconButton aria-label="Ligas" as={FaTrophy} w={12} h={12} />
        </CustomLink>
        {auth.isAdmin ? (
          <CustomLink
            href="/admin"
            color="initial"
            _hover={{ color: "initial" }}
          >
            <IconButton
              aria-label="Admin"
              as={BsFillPersonCheckFill}
              w={12}
              h={12}
            />
          </CustomLink>
        ) : null}
      </Flex>
      <CustomLink
        href={auth.user ? `/user/${auth.user.uid}` : "/login"}
        color="initial"
        _hover={{ color: "initial" }}
      >
        <IconButton
          aria-label={auth.user ? "Profile" : "Login"}
          justifySelf="flex-end"
          as={BsFillPersonFill}
          w={12}
          h={12}
        />
      </CustomLink>
    </>
  );
}

export default function Menu() {
  return (
    <Flex
      direction={["row", "column"]}
      position="fixed"
      alignItems="center"
      justifyContent="space-between"
      padding="10px"
      top={["90vh", "0"]}
      left={["0", "0"]}
      width={["100%", "100px"]}
      height={["10vh", "100vh"]}
      backgroundColor="blue.500"
    >
      <MenuContent />
    </Flex>
  );
}
