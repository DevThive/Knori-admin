// ** React Imports
import { useState, useEffect } from 'react'

import axios from 'axios'

import authConfig from 'src/configs/auth'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import classDataDB from 'src/@real-db/app/classDB'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Typography, TextField, useMediaQuery, Collapse, List, ListItem, ListItemText } from '@mui/material'
import Classeditor from 'src/views/apps/class/classAdd'

import { makeStyles } from '@material-ui/core/styles'

import Classeditor2 from 'src/views/apps/class/classUpdate'
import ClassToggle from 'src/views/apps/class/classesSelector'
import ScheduleModal from 'src/views/apps/class/schedule'
import { minWidth } from '@mui/system'
import { useTheme } from '@mui/material/styles'

const columns = [
  { id: 'id', label: 'ID', minWidth: 80 },
  { id: 'title', label: '타이틀', minWidth: 200 },
  { id: 'date', label: '작성 날짜', minWidth: 150 },
  { id: 'price', label: '가격', minWidth: 100 },
  { id: 'EtcPrice', label: '단체가격', minWidth: 100 },
  { id: 'etc', label: '', align: 'right', minWidth: 100 }
]

const useStyles = makeStyles(theme => ({
  tableCell: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5)
    }
  },
  button: {
    padding: '5px 10px',
    [theme.breakpoints.down('sm')]: {
      padding: '3px 6px',
      fontSize: '0.8rem'
    }
  },
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  textField: {
    width: '100px',
    [theme.breakpoints.down('sm')]: {
      width: '80px'
    }
  }
}))

function createData(name, owner, date) {
  return { owner, name, date }
}

const TableStickyHeader = () => {
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [classes, setClasses] = useState([]) // 상태 추가
  const [editMode, setEditMode] = useState({})

  // const [editMode2, setEditMode2] = useState({})
  const [EtceditMode, setEtcEditMode] = useState({})
  const [openRow, setOpenRow] = useState(null)

  // const [title, setTitle] = useState('') // 제목을 위한 상태
  // const [content, setContent] = useState('') // 에디터 내용을 위한 상태
  // const [file, setFile] = useState(null)

  // 모달 열림/닫힘 상태를 관리하는 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false)

  //모바일
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // 가격 저장
  const savePrice = async (id, prices) => {
    const classId = id // classId를 id로 설정
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      // API 요청 보내기
      const response = await axios.put(
        `https://api.knori.or.kr/class/price/${classId}`,
        {
          price: prices.price, // price 값을 사용
          price2: prices.price2 // price2 값을 추가
        },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )

      // 응답 확인
      if (response.status !== 200) {
        throw new Error('가격 저장에 실패했습니다.')
      }

      console.log(`Saving new prices for ${classId}: ${prices.price}, ${prices.price2}`)

      // 저장 후 수정 모드 종료
      setEditMode({ ...editMode, [id]: false })
    } catch (error) {
      console.error('Error saving new price:', error)

      // 에러 처리 로직 추가 (예: 사용자에게 알림)
    }
  }

  const handleSave = (row, column) => {
    const priceValue = parseFloat(row[column.id])
    const price2Value = parseFloat(row.price2)

    // 가격이 숫자인지 확인
    if (isNaN(priceValue) || isNaN(price2Value)) {
      alert('가격은 유효한 숫자여야 합니다.')

      return // 유효하지 않은 경우 함수 종료
    }

    savePrice(row.id, { price: priceValue, price2: price2Value })
  }

  // //가격2 저장2
  // const savePrice2 = async (id, newPrice) => {
  //   const classId = id // classId를 id로 설정
  //   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  //   try {
  //     // API 요청 보내기
  //     const response = await axios.put(
  //       `https://api.knori.or.kr/class/price2/${classId}`,
  //       {
  //         price: newPrice
  //       },
  //       { headers: { Authorization: `Bearer ${storedToken}` } }
  //     )

  //     // 응답 확인
  //     if (response.status !== 200) {
  //       throw new Error('가격 저장에 실패했습니다.')
  //     }

  //     console.log(`Saving new price for ${classId}: ${newPrice}`)

  //     // 저장 후 수정 모드 종료
  //     setEditMode2({ ...editMode, [id]: false })
  //   } catch (error) {
  //     console.error('Error saving new price:', error)

  //     // 에러 처리 로직 추가 (예: 사용자에게 알림)
  //   }
  // }

  //단체 가격 저장
  const saveEtcPrice = async (id, newPrice) => {
    const classId = id // classId를 id로 설정
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      // API 요청 보내기
      const response = await axios.put(
        `https://api.knori.or.kr/class/etcprice/${classId}`,
        {
          etcprice: newPrice
        },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )

      // 응답 확인
      if (response.status !== 200) {
        throw new Error('가격 저장에 실패했습니다.')
      }

      console.log(`Saving new price for ${classId}: ${newPrice}`)

      // 저장 후 수정 모드 종료
      setEtcEditMode({ ...EtceditMode, [id]: false })
    } catch (error) {
      console.error('Error saving new price:', error)

      // 에러 처리 로직 추가 (예: 사용자에게 알림)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await classDataDB()
      setClasses(data)
    }
    fetchData()
  }, [])

  const updateClass = newClass => {
    setClasses([...classes, newClass])
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // 삭제 확인 모달을 띄우는 함수
  const handleOpenDeleteModal = id => {
    setSelectedId(id)
    setDeleteModalOpen(true)
  }

  // 모달 닫기 및 선택 초기화
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedId(null)
  }

  // 실제 삭제를 수행하는 함수
  const confirmDeleteNotice = async () => {
    await deleteClass(selectedId)
    handleCloseDeleteModal()
  }

  // 삭제 확인 모달 JSX
  const DeleteConfirmModal = () => (
    <Modal
      open={deleteModalOpen}
      onClose={handleCloseDeleteModal}
      aria-labelledby='delete-confirmation-modal'
      aria-describedby='delete-confirmation-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4
        }}
      >
        <Typography id='delete-confirmation-modal' variant='h6' component='h2'>
          삭제하시겠습니까? (삭제시 본 클래스 예약 현황이 삭제됩니다.)
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2
          }}
        >
          <Button onClick={handleCloseDeleteModal} color='primary'>
            취소
          </Button>
          <Button onClick={confirmDeleteNotice} color='error'>
            삭제
          </Button>
        </Box>
      </Box>
    </Modal>
  )

  const [EditModalOpen, setEditModalOpen] = useState(false)
  const [Edits, setEdits] = useState([])

  const updateEdits = newEdits => {
    setEdits([...Edits, newEdits])
  }

  const handleOpenEditModal = data => {
    // setSelectedId(id)
    setEdits(data)
    setEditModalOpen(true)
  }

  const handleCancelEditModal = () => {
    setEdits([])
    setEditModalOpen(false)
  }

  const deleteClass = async id => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      // axios를 이용한 삭제 API 호출
      const response = await axios.delete(`https://api.knori.or.kr/class/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      // axios는 기본적으로 response.ok 대신 try-catch로 에러를 핸들링합니다.
      // 성공적으로 삭제된 후, UI를 업데이트하기 위해 notices 상태를 갱신합니다.
      setClasses(classes.filter(notice => notice.id !== id))
    } catch (error) {
      // axios에서는 error.response 등을 통해 더 상세한 정보를 얻을 수 있습니다.
      console.error('Failed to delete the notice:', error.response ? error.response.data : error)
    }
  }

  const [ScheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [Schedule, setSchedule] = useState([])

  const [MobileModalOpen, setMobileModalOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  const handleRowClick = index => {
    setSelectedRow(classes[index])
    setMobileModalOpen(true)
  }

  const handleMobileCloseModal = () => {
    setMobileModalOpen(false)
    setSelectedRow(null)
  }

  const handleOpenScModal = data => {
    setSchedule(data)
    setScheduleModalOpen(true)
  }

  const handleCancelScModal = () => {
    setSchedule([])
    setScheduleModalOpen(false)
  }

  // const handleRowClick = index => {
  //   setSelectedRow(classes[index])
  //   setMobileModalOpen(true)
  // }

  // const [MobileModalOpen, setMobileModalOpen] = useState(false)

  // const handleMobileCloseModal = () => {
  //   setMobileModalOpen(false)
  // }

  const handleDelete = () => {
    // 삭제 로직을 여기에 추가하세요
    console.log('삭제 버튼 클릭됨')
    handleMobileCloseModal()
  }

  const handleChange = e => {
    const { name, value } = e.target
    setSelectedRow(prevRow => ({
      ...prevRow,
      [name]: value
    }))
  }

  // useEffect(() => {
  //   if (selectedRow) {
  //     console.log('selectedRow:', selectedRow)
  //   }
  // }, [selectedRow])

  if (isMobile) {
    // 모바일 화면 렌더링
    return (
      <Box p={2}>
        <List>
          {classes.map((row, index) => (
            <Paper key={row.id} variant='outlined' style={{ marginBottom: '1rem', padding: '1rem' }}>
              <ListItem>
                <ListItemText
                  primary={`${row.title.length > 10 ? row.title.slice(0, 10) + '...' : row.title}`}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                />
                <Button variant='contained' color='primary' onClick={() => handleRowClick(index)}>
                  자세히 보기
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>

        {selectedRow && (
          <Modal
            open={MobileModalOpen}
            onClose={handleMobileCloseModal}
            aria-labelledby='모달 창'
            aria-describedby='모달 창을 닫으려면 ESC 키를 누르거나 바깥을 클릭하세요'
          >
            <Box
              position='absolute'
              top='50%'
              left='50%'
              width='95%'
              maxWidth='100vw'
              bgcolor='background.paper'
              borderRadius={2}
              boxShadow={24}
              p={4}
              style={{ transform: 'translate(-50%, -50%)', overflow: 'auto' }} // 모달 창을 화면 중앙에 위치시키기 위한 스타일 추가
            >
              <h2>{selectedRow.title} 상세 정보</h2>
              <TextField
                fullWidth
                margin='normal'
                label='타이틀'
                value={selectedRow.title}
                InputProps={{
                  readOnly: true
                }}
              />
              <TextField
                fullWidth
                margin='normal'
                label='작성 날짜'
                value={new Date(selectedRow.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                InputProps={{
                  readOnly: true
                }}
              />
              <TextField
                fullWidth
                margin='normal'
                label='클래스 가격'
                name='classPrice'
                value={selectedRow.price}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin='normal'
                label='단체 가격'
                name='groupPrice'
                value={selectedRow.EtcPrice}
                onChange={handleChange}
              />

              <Box display='flex' justifyContent='space-between' marginTop={2}>
                <Button onClick={handleDelete} variant='contained' color='secondary'>
                  삭제
                </Button>
                <Button onClick={handleMobileCloseModal} variant='contained' color='primary'>
                  닫기
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </Box>
    )
  }

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {index === columns.length - 1 ? ( // 가장 오른쪽 열인 경우
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{column.label}</span>
                        <Button variant='contained' color='primary' onClick={handleModalOpen}>
                          추가
                        </Button>
                        <Modal
                          open={isModalOpen}
                          onClose={handleCloseModal}
                          aria-labelledby='모달 창'
                          aria-describedby='모달 창을 닫으려면 ESC 키를 누르거나 바깥을 클릭하세요'
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: 1000,
                              maxHeight: '90vh', // 화면 높이의 90%로 최대 높이 설정
                              bgcolor: 'background.paper',
                              boxShadow: 24,
                              p: 4,
                              overflow: 'auto' // 스크롤 가능하도록 설정
                            }}
                          >
                            <Classeditor updateNotices={updateClass} closeModal={handleCloseModal} />
                          </Box>
                        </Modal>
                      </div>
                    ) : (
                      <span>{column.label}</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    if (column.id === 'etc') {
                      return (
                        <TableCell key={column.id} align={column.align} className={classes.tableCell}>
                          <Button
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            onClick={() => handleOpenScModal(row.id)}
                          >
                            시간관리
                          </Button>{' '}
                          <Button
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            onClick={() => handleOpenEditModal(row)}
                          >
                            수정하기
                          </Button>{' '}
                          <Button
                            variant='contained'
                            color='error'
                            className={classes.button}
                            onClick={() => handleOpenDeleteModal(row.id)}
                          >
                            삭제
                          </Button>
                        </TableCell>
                      )
                    } else if (column.id === 'price') {
                      return (
                        <TableCell key={column.id} align={column.align} className={classes.tableCell}>
                          {editMode[row.id] ? (
                            <div className={classes.editContainer}>
                              <TextField
                                defaultValue={row[column.id]}
                                onChange={e => (row[column.id] = e.target.value)}
                                type='number'
                                size='small'
                                variant='outlined'
                                className={classes.textField}
                              />{' '}
                              {'~'}{' '}
                              <TextField
                                defaultValue={row.price2} // price2 값 가져오기
                                onChange={e => (row.price2 = e.target.value)} // price2 값 업데이트
                                type='number'
                                size='small'
                                variant='outlined'
                                className={classes.textField}
                              />
                              <Button
                                variant='contained'
                                color='primary'
                                onClick={() => handleSave(row, column)} // row와 column을 인자로 전달
                                className={classes.button}
                              >
                                저장
                              </Button>
                            </div>
                          ) : (
                            <div className={classes.editContainer}>
                              {row[column.id]}{' '}
                              <Button
                                variant='contained'
                                color='primary'
                                onClick={() => setEditMode({ ...editMode, [row.id]: true })}
                                className={classes.button}
                              >
                                수정
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )
                    } else if (column.id === 'EtcPrice') {
                      return (
                        <TableCell key={column.id} align={column.align} className={classes.tableCell}>
                          {EtceditMode[row.id] ? (
                            <div className={classes.editContainer}>
                              <TextField
                                defaultValue={row[column.id]}
                                onChange={e => (row[column.id] = e.target.value)}
                                type='text'
                                size='small'
                                variant='outlined'
                                className={classes.textField}
                              />{' '}
                              <Button
                                variant='contained'
                                color='primary'
                                onClick={() => saveEtcPrice(row.id, row[column.id])}
                                className={classes.button}
                              >
                                저장
                              </Button>
                            </div>
                          ) : (
                            <div className={classes.editContainer}>
                              {row[column.id]}{' '}
                              <Button
                                variant='contained'
                                color='primary'
                                onClick={() => setEtcEditMode({ ...EtceditMode, [row.id]: true })}
                                className={classes.button}
                              >
                                수정
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align} className={classes.tableCell}>
                          {column.id === 'date' ? new Date(row[column.id]).toLocaleDateString() : row[column.id]}
                        </TableCell>
                      )
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={classes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {/* 수정 모달 */}
        <Modal
          open={EditModalOpen}
          onClose={handleCancelEditModal}
          aria-labelledby='모달 창'
          aria-describedby='모달 창을 닫으려면 ESC 키를 누르거나 바깥을 클릭하세요'
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxHeight: '90vh', // 화면 높이의 90%로 최대 높이 설정
              width: 1000,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              overflow: 'auto' // 스크롤 가능하도록 설정
            }}
          >
            <Classeditor2 updateNotices={updateClass} closeModal={handleCancelEditModal} editData={Edits} />
          </Box>
        </Modal>
        {/* 삭제 모달 */}
        <DeleteConfirmModal />
        {/* 시간관리 모달 */}
        <Modal
          open={ScheduleModalOpen}
          onClose={handleCancelScModal}
          aria-labelledby='모달 창'
          aria-describedby='모달 창을 닫으려면 ESC 키를 누르거나 바깥을 클릭하세요'
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1000,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4
            }}
          >
            <ScheduleModal closeModal={handleCancelScModal} scheduleData={Schedule} />
          </Box>
        </Modal>
      </div>
    </>
  )
}

export default TableStickyHeader
