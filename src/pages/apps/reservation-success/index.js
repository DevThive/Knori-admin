// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import Link from 'next/link'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import QuickSearchToolbar from 'src/views/apps/reservation-success/QuickSearchToolbar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { rows } from 'src/@fake-db/table/static-data'

import OptionsMenu from 'src/@core/components/option-menu'
import Icon from 'src/@core/components/icon'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

// ** renders client column
const renderClient = params => {
  const { row } = params

  // console.log(row)
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]
  if (row.length) {
    // return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
        {getInitials(row.client_name ? row.client_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const statusObj = {
  0: { title: '개인', color: 'info' },
  1: { title: '단체', color: 'success' },
  2: { title: 'rejected', color: 'error' },
  3: { title: 'resigned', color: 'warning' },
  4: { title: 'applied', color: 'primary' }
}

const escapeRegExp = value => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const columns = (updateData, handleEditClick) => [
  {
    flex: 0.275,
    minWidth: 290,
    field: 'full_name',
    headerName: '고객명',
    renderCell: params => {
      const { row } = params

      // console.log(row)

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(params)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
              {row.client_name}
            </Typography>
            <Typography noWrap variant='caption'>
              {row.client_email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    type: 'date',
    minWidth: 120,
    headerName: '날짜',
    field: 'start_date',
    valueGetter: params => new Date(params.value),
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.date}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 110,
    field: 'totalPeople',
    headerName: '인원수',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.totalPeople}
      </Typography>
    )
  },
  {
    flex: 0.2,
    field: 'client_phonenumber',
    minWidth: 80,
    headerName: '핸드폰 번호',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.client_phonenumber}
      </Typography>
    )
  },

  {
    flex: 0.125,
    minWidth: 100,
    field: 'status',
    headerName: '개인/단체',
    renderCell: params => {
      const status = statusObj[params.row.client_type]

      return (
        <CustomChip
          color={status.color}
          label={status.title}
          rounded
          size='small'
          skin='light'
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
  },
  {
    flex: 0.2,
    field: 'reservation_check',
    minWidth: 80,
    headerName: '상태',
    renderCell: params => (
      <Select
        labelId='reservation-status-select-label'
        id='reservation-status-select'
        value={params.row.state}
        onChange={event => {
          const newState = event.target.value
          console.log(`상태 변경: ${newState}`)
          console.log(params)
          const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

          // 상태 변경 API 호출
          axios
            .patch(
              `https://api.knori.or.kr/reservation/success/approve/${params.row.id}`,
              {
                state: newState
              },
              {
                headers: {
                  Authorization: `Bearer ${storedToken}`
                }

                // data: { yourDataKey: yourDataValue }, // DELETE 요청에 본문이 필요한 경우
              }
            )
            .then(response => {
              // 성공적으로 상태가 변경되었을 때의 로직
              console.log('상태 변경 성공', response)

              // 필요하다면 여기에서 테이블 데이터 갱신 로직을 추가
              updateData({ id: params.row.id, state: newState })
            })
            .catch(error => {
              // API 호출 실패 시의 로직
              console.error('상태 변경 실패', error)
            })
        }}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        size='small'
        sx={{ minWidth: 120 }}
      >
        <MenuItem value={1}>취소</MenuItem>
        <MenuItem value={2}>완료</MenuItem>
      </Select>
    )
  },

  {
    flex: 0.1,
    minWidth: 140,
    sortable: false,
    field: 'actions',
    headerName: 'ETC',
    renderCell: params => {
      // console.log(params.row.id) // 콘솔에 params 출력

      // 예약 취소 함수
      const cancelReservation = async () => {
        // console.log(params.row.id)
        const id = params.row.id

        const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
        try {
          const response = await axios.delete(`https://api.knori.or.kr/reservation/admin/${id}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }

            // data: { yourDataKey: yourDataValue }, // DELETE 요청에 본문이 필요한 경우
          })
          console.log('예약 취소 성공', response.data)

          window.location.reload()

          // 성공적으로 예약 취소 후 필요한 상태 업데이트나 UI 반영 로직 추가
        } catch (error) {
          console.error('API 호출 중 에러 발생:', error.response)
        }
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'right' }}>
          <Tooltip title='예약삭제'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={cancelReservation}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title='예약수정'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleEditClick(params)}>
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip> */}

          {/* <Tooltip title='청구서 보기'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={moveinvoice}>
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip> */}
          {/* <Tooltip title='수정'>
            <IconButton size='small' sx={{ color: 'text.secondary' }} href={`/apps/invoice/edit/${params.row.id}`}>
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip> */}
          {/* <OptionsMenu
            menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
            iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
            options={[
              {
                text: '예약취소',
                icon: <Icon icon='tabler:edit' fontSize={20} />,
                onClick: () => cancelReservation(params.row.id) // 예약 취소 버튼 클릭 이벤트
              },
              {
                text: '예약수정',
                icon: <Icon icon='tabler:edit' fontSize={20} />

                // 예약 수정 기능을 여기에 추가
              }
            ]}
          /> */}
        </Box>
      )
    }
  }
]

const TableColumns = () => {
  // ** States
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)

  const fetchData = async () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      // Axios를 사용하여 API 요청을 보냄
      const response = await axios.get('https://api.knori.or.kr/reservation/admin/success', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      setData(response.data) // 불러온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching data with axios:', error)
    }
  }

  const updateData = updatedRow => {
    // 상태 변경에 따라 테이블 데이터 업데이트
    const newData = data.map(row => (row.id === updatedRow.id ? { ...row, state: updatedRow.state } : row))

    // 상태가 업데이트된 데이터로 UI 업데이트
    setData(newData)
  }

  // 컴포넌트가 마운트될 때 fetchData 함수를 호출하여 데이터를 불러옴
  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = searchValue => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

    const filteredRows = data.filter(row => {
      return Object.keys(row).some(field => {
        console.log(field)

        // @ts-ignore
        return searchRegex.test(row[field].toString())
      })
    })

    // console.log(filteredRows)
    if (searchValue.length) {
      setFilteredData(filteredRows)

      // console.log(filteredData)
    } else {
      setFilteredData([])
    }
  }

  const openModal = reservation => {
    setSelectedReservation(reservation) // 선택된 예약 정보 저장
    setIsModalOpen(true) // 모달 열기
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // 예약 수정 버튼 클릭 이벤트
  const handleEditClick = params => {
    console.log(params)
    openModal(params.row) // 선택된 예약 정보와 함께 모달 열기
  }

  const handleChange = event => {
    const { name, value } = event.target
    setSelectedReservation(prevInfo => ({
      ...prevInfo,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    // 예약 수정 로직 구현
    // 예를 들면, axios를 사용하여 서버에 수정된 예약 정보를 전송
    // try {
    //   const response = await axios.put(`YOUR_API_ENDPOINT/${reservationInfo.id}`, reservationInfo);
    //   console.log('예약 수정 성공', response.data);
    //   closeModal(); // 모달 닫기
    // } catch (error) {
    //   console.error('예약 수정 실패', error);
    // }

    console.log('Modified reservation info:', selectedReservation)

    // closeModal() // 실제 구현 시, 요청 성공 후 모달을 닫습니다.
  }

  return (
    <Card>
      <CardHeader title='예약현황' />
      <DataGrid
        autoHeight
        columns={columns(updateData, handleEditClick)}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: QuickSearchToolbar }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData.length ? filteredData : data}
        sx={{
          '& .MuiSvgIcon-root': {
            fontSize: '1.125rem'
          }
        }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            value: searchText,
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value)
          }
        }}
      />
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth={true} maxWidth='md'>
        <DialogTitle>예약 수정</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {' '}
              {/* xs={6}으로 설정하여 화면을 반으로 나눔 */}
              <TextField
                autoFocus
                margin='dense'
                name='name'
                label='이름'
                type='text'
                fullWidth // fullWidth를 유지하되 Grid 아이템 크기로 반응형 조정
                variant='outlined'
                defaultValue={selectedReservation ? selectedReservation.client_name : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              {' '}
              {/* xs={6}으로 설정하여 화면을 반으로 나눔 */}
              <TextField
                margin='dense'
                name='email'
                label='메일'
                type='text'
                fullWidth // fullWidth를 유지하되 Grid 아이템 크기로 반응형 조정
                variant='outlined'
                defaultValue={selectedReservation ? selectedReservation.client_email : ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {' '}
              {/* xs={6}으로 설정하여 화면을 반으로 나눔 */}
              <TextField
                autoFocus
                margin='dense'
                name='phone'
                label='번호'
                type='number'
                fullWidth // fullWidth를 유지하되 Grid 아이템 크기로 반응형 조정
                variant='outlined'
                defaultValue={selectedReservation ? selectedReservation.client_phonenumber : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              {' '}
              {/* xs={6}으로 설정하여 화면을 반으로 나눔 */}
              <TextField
                margin='dense'
                name='totalPeople'
                label='인원 수'
                type='text'
                fullWidth // fullWidth를 유지하되 Grid 아이템 크기로 반응형 조정
                variant='outlined'
                defaultValue={selectedReservation ? selectedReservation.totalPeople : ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin='dense'
              name='note'
              label='메모'
              type='textarea'
              fullWidth // fullWidth를 유지하되 Grid 아이템 크기로 반응형 조정
              variant='outlined'
              defaultValue={selectedReservation ? selectedReservation.etc : ''}
              onChange={handleChange}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>취소</Button>
          <Button onClick={handleSubmit}>저장</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default TableColumns
