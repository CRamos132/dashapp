import { useState } from 'react'
import { Box, Button, Flex } from "@chakra-ui/react"
import { BsArrowDownSquare, BsArrowDownSquareFill, BsArrowUpSquareFill } from 'react-icons/bs'

interface ITableComponentProp {
  value: any
}

interface IData {
  id: any;
  [key: string]: any;
}

interface IHeader {
  key: string
  label: string
  component?: React.FunctionComponent<ITableComponentProp>
  width?: number
  sort?: boolean
}

interface IProps {
  headers: IHeader[]
  data: IData[]
}

const ActiveFilter = ({ isAsc }: { isAsc: boolean }) => {
  return (
    <>
      {isAsc ? (
        <BsArrowDownSquareFill />
      ) : (
        <BsArrowUpSquareFill />
      )}
    </>
  )
}

export default function Table({ headers, data }: IProps) {
  const [tableData, setTableData] = useState(data)
  const [activeSort, setActiveSort] = useState('')
  const [isAsc, setIsAsc] = useState(true)

  function compare(a: IData, b: IData, key: string, order: boolean) {
    if (a[key] < b[key]) {
      return order ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return order ? 1 : -1;
    }
    return 0;
  }

  const handleSort = (key: string) => {
    if (activeSort === key) {
      const copy = new Array(...tableData)
      const sortedData = copy.sort((a, b) => compare(a, b, key, !isAsc))
      setIsAsc(oldState => !oldState)
      setTableData(sortedData)
    } else {
      setActiveSort(key)
      const copy = new Array(...tableData)
      const sortedData = copy.sort((a, b) => compare(a, b, key, true))
      setIsAsc(true)
      setTableData(sortedData)
    }
  }

  return (
    <Box as='table'>
      <thead>
        <Flex as='tr' direction='row'>
          {
            headers.map(item => {
              return (
                <Flex
                  justifyContent='center'
                  width={item?.width ? `${item?.width}px` : '200px'}
                  key={item.key}
                  as='th'
                >
                  {item.label}
                  {item?.sort && (
                    <Button onClick={() => { handleSort(item.key) }}>
                      {activeSort === item.key ? <ActiveFilter isAsc={isAsc} /> : <BsArrowDownSquare />}
                    </Button>
                  )}
                </Flex>
              )
            })
          }
        </Flex>
      </thead>
      <tbody>
        <Flex as='tr' direction='column'>
          {tableData?.map((row) => {
            return (
              <Flex flex={1} direction='row' key={row.id}>
                {headers.map((header) => {
                  const columnValue = row?.[header.key]
                  if (header?.component) {
                    const Component = header?.component
                    return <Component value={columnValue} key={columnValue} />
                  }
                  return (
                    <Flex
                      as='td'
                      justifyContent='center'
                      title={row?.[header.key] ?? '--'}
                      overflow='hidden'
                      width={header?.width ? `${header?.width}px` : '200px'}
                      key={`${columnValue}-${header.key}`}
                    >
                      {row?.[header.key] ?? '--'}
                    </Flex>
                  )
                })}
              </Flex>
            )
          })}
        </Flex>
      </tbody>
    </Box>
  )
}