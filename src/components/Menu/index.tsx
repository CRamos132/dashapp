import React from "react";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { BsFillPersonFill, BsFillPersonCheckFill } from "react-icons/bs";
import { FaTrophy, FaUsers } from "react-icons/fa";
import { GiHamburgerMenu } from 'react-icons/gi'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

import { useAuth } from "../../contexts/AuthContext";
import { CustomLink } from "../CustomLink";
import IconButton from "../IconButton";

function MenuContent() {
  const { user, isAdmin } = useAuth();

  const userId = user?.uid

  return (
    <>
      <Flex flexDir='column' gridGap="18px">
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
        {isAdmin ? (
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
        href={user ? `/user/${userId}` : "/login"}
        color="initial"
        _hover={{ color: "initial" }}
      >
        <IconButton
          aria-label={user ? "Profile" : "Login"}
          justifySelf="flex-end"
          marginTop='auto'
          as={BsFillPersonFill}
          w={12}
          h={12}
        />
      </CustomLink>
    </>
  );
}

export default function Menu() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <>
      <Flex
        direction={["row", "column"]}
        display={['none', 'flex']}
        position="fixed"
        alignItems="center"
        justifyContent="space-between"
        padding="10px"
        top={["90vh", "0"]}
        left={["0", "0"]}
        width={["100%", "100px"]}
        height={["10vh", "100vh"]}
        backgroundColor="#b11e3a"
      >
        <MenuContent />
      </Flex>
      <Flex display={['flex', 'none']} position='fixed' top='0' left='0' width='100%' height='10vh'>
        <Flex direction='row' width='100%' justifyContent='start'>
          <Button ref={btnRef as any} backgroundColor='#162542' onClick={onOpen} height='50px' width='50px'>
            <GiHamburgerMenu color="white" height='24px' width='24px' />
          </Button>
        </Flex>
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          finalFocusRef={btnRef as any}
        >
          <DrawerOverlay />
          <DrawerContent >
            <Flex direction='column' width='100%' alignItems='center' height='100vh'>
              <MenuContent />
            </Flex>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
}
