import {
  FormLabel,
  Input,
  FormLabelProps,
  InputProps,
  FormControl,
  FormControlProps,
} from "@chakra-ui/react";
import { capitalizeFirstLetter } from "../../utils/string";

interface IProps {
  field: string;
  formControl?: FormControlProps;
  label?: FormLabelProps;
  input?: InputProps;
  isEditable: boolean;
}

export function FieldText({
  field,
  formControl = {},
  label = {},
  input = {},
  isEditable = false,
}: IProps) {
  const inputProps = isEditable
    ? input
    : ({ border: "none", ...input, readOnly: true } as InputProps);
  return (
    <FormControl {...formControl}>
      <FormLabel
        htmlFor={field}
        {...label}
        mb="1"
        color="blue.500"
        fontWeight="600"
      >
        {label.children || capitalizeFirstLetter(field)}
      </FormLabel>
      <Input
        id={field}
        name={field}
        {...inputProps}
        padding={isEditable ? "2" : "1"}
      />
    </FormControl>
  );
}
