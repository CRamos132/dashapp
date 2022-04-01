import { IconButton as ButtonComponente, IconButtonProps } from "@chakra-ui/react";


export default function IconButton({ ...props }: IconButtonProps) {
  return (
    <ButtonComponente  {...props} aria-label={props['aria-label']} backgroundColor='transparent' />
  )
}