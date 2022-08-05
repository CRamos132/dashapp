import { useEffect, useState } from 'react'
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

interface ITableHeadersProps {
  headers: IHeader[]
  activeSort: string
  isAsc: boolean
  handleSort: (key: string) => void
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

const TableHeaders = ({ headers, activeSort, isAsc, handleSort }: ITableHeadersProps) => {
  return (
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
  )
}

const BasicHeaders = ({ data }: { data: IData[] }) => {
  const [headerKeys, setHeaderKeys] = useState<string[]>([])

  const getHeaders = () => {
    const sample = data.slice(0, 3)
    let keys = new Set()
    sample.forEach(item => {
      const objKeys = Object.keys(item)
      const newSet = new Set([...keys, ...objKeys])
      keys = newSet
    })
    const keysArray = Array.from(keys)
    setHeaderKeys(keysArray as string[])
  }

  useEffect(() => {
    getHeaders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Flex as='tr' direction='row'>
      {
        headerKeys.map(item => {
          return (
            <Flex
              as='td'
              justifyContent='center'
              title={item ?? '--'}
              overflow='hidden'
              width='200px'
              key={item}
            >
              {item ?? '--'}
            </Flex>
          )
        })
      }
    </Flex>
  )
}

export default function Table({ headers, data }: IProps) {
  const [tableData, setTableData] = useState(data)
  const [activeSort, setActiveSort] = useState('')
  const [isAsc, setIsAsc] = useState(true)

  function compareNumber(a: Number, b: Number, order: boolean) {
    if (a < b) {
      return order ? -1 : 1;
    }
    if (a > b) {
      return order ? 1 : -1;
    }
    return 0;
  }

  function compareString(a: any, b: any, order: boolean) {
    const itemOne = a
    const itemTwo = b
    const sort = itemOne.localeCompare(itemTwo)

    if (sort === 0) {
      return sort
    }
    return order ? sort : sort * (-1)
  }

  const compare = (a: IData, b: IData, key: string, order: boolean) => {
    const itemOne = a[key]
    const itemTwo = b[key]
    if (typeof itemOne === 'number') {
      return compareNumber(itemOne, itemTwo, order)
    }
    return compareString(itemOne, itemTwo, order)
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
        {
          headers ? (
            <TableHeaders
              activeSort={activeSort}
              handleSort={handleSort}
              headers={headers}
              isAsc={isAsc} />
          ) : (
            <BasicHeaders data={data} />
          )
        }
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