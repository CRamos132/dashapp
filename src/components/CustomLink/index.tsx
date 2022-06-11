import { Text, TextProps } from "@chakra-ui/react";
import Link from "next/link";

interface IProps extends TextProps {
  href: string;
  children: React.ReactNode;
}

export function CustomLink(props: IProps) {
  return (
    <Link passHref href={props.href}>
      <Text
        as="a"
        background="none"
        color="blue.500"
        padding="0"
        height="fit-content"
        _hover={{
          backgroundColor: "initial",
          color: "orange",
          textDecoration: "none",
        }}
        {...props}
      >
        {props.children}
      </Text>
    </Link>
  );
}
