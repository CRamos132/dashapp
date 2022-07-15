import { Box, Flex } from "@chakra-ui/react"

interface ITableComponentProp {
  value: any
}

interface IData {
  id: any;
  [key: string]: any;
}

interface IProps {
  headers: { key: string, label: string, component?: React.FunctionComponent<ITableComponentProp>, width?: number }[]
  data: IData[]
}

export default function Table({ headers, data }: IProps) {
  return (
    <Box as='table'>
      <Flex as='thead' direction='row'>
        {
          headers.map(item => {
            return <Flex justifyContent='center' width={item?.width ? `${item?.width}px` : '200px'} key={item.key}>{item.label}</Flex>
          })
        }
      </Flex>
      <Flex as='tbody' direction='column'>
        {data?.map((row) => {
          return (
            <Flex flex={1} direction='row' key={row.id}>
              {headers.map((header) => {
                const columnValue = row?.[header.key]
                if (header?.component) {
                  const Component = header?.component
                  return <Component value={columnValue} key={columnValue} />
                }
                if (typeof columnValue === 'boolean') {
                  return columnValue ? 'Yes' : 'No'
                }
                if (header.key === 'action') {
                  return (
                    <Flex
                      justifyContent='center'
                      title={row?.[header.key] ?? '--'}
                      overflow='hidden'
                      width={header?.width ? `${header?.width}px` : '200px'}
                      key={columnValue}
                    >
                      <button type="button" key={columnValue}>{header.label}</button>
                    </Flex>
                  )
                }
                return (
                  <Flex
                    justifyContent='center'
                    title={row?.[header.key] ?? '--'}
                    overflow='hidden'
                    width={header?.width ? `${header?.width}px` : '200px'}
                    key={columnValue}
                  >
                    {row?.[header.key] ?? '--'}
                  </Flex>
                )
              })}
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}