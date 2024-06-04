import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import authConfig from 'src/configs/auth'

const Usersetting = () => {
  const [rows, setRows] = useState([])

  const columns = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'ID'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: '이름'
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'email',
      headerName: 'Email'
    },
    {
      flex: 0.15,
      type: 'date',
      minWidth: 130,
      headerName: '가입날짜',
      field: 'date',
      valueGetter: params => (params.value ? new Date(params.value) : null)
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: 'etc',
      headerName: '승인 및 ETC',
      renderCell: params => (
        <Select
          labelId='approval-select-label'
          id='approval-select'
          value={params.row.role === 1 ? '승인' : '미승인'}
          label='Approval'
          onChange={async event => {
            const newStatus = event.target.value === '승인' ? 1 : 0
            console.log(newStatus)

            const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
            try {
              await axios.patch(
                `https://api.knori.or.kr/users/approve/${params.id}`,
                {
                  state: newStatus
                },
                {
                  headers: {
                    Authorization: `Bearer ${storedToken}`
                  }
                }
              )

              // rows 상태 업데이트 로직
              setRows(prevRows => prevRows.map(row => (row.id === params.id ? { ...row, role: newStatus } : row)))
            } catch (error) {
              console.error('상태 변경에 실패했습니다.', error)
            }
          }}
          size='small'
          sx={{ width: '100%' }}
        >
          <MenuItem value={'승인'}>승인</MenuItem>
          <MenuItem value={'미승인'}>미승인</MenuItem>
        </Select>
      )
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      try {
        const response = await axios.get('https://api.knori.or.kr/users/userlist', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        console.log(response.data)
        setRows(response.data) // API 응답에서 데이터 설정
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다.', error)
      }
    }

    fetchData()
  }, []) // 의존성 배열을 빈 배열로 설정하여 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <Card>
      <CardHeader title='Basic' />
      <Box sx={{ height: '500px' }}>
        <DataGrid columns={columns} rows={rows} />
      </Box>
    </Card>
  )
}

export default Usersetting
