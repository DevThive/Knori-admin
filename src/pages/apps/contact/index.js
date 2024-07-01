import React, { useState, useEffect } from 'react'

import axios from 'axios'

import authConfig from 'src/configs/auth'

// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import contactDB from 'src/@real-db/app/contactDB'
import Modal from '@mui/material/Modal'
import {
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Button,
  Box
} from '@mui/material'

const columns = [
  { id: 'id', label: 'ID', minWidth: 80 },
  { id: 'user_name', label: '작성자', minWidth: 40 },
  { id: 'contact_title', label: '제목', minWidth: 200 },
  { id: 'date', label: '작성 날짜', minWidth: 100 },
  { id: 'contact_answer', label: '', align: 'right', minWidth: 100 }
]

const ContactList = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [contact, setContact] = useState([])
  const [openRowId, setOpenRowId] = useState(null)
  const [answers, setAnswers] = useState({})

  //모바일
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchData = async () => {
      const data = await contactDB()
      setContact(data)

      // 데이터를 불러온 후, 각 문의사항에 대한 초기 답변 상태를 설정합니다.
      const initialAnswers = {}
      data.forEach(item => {
        initialAnswers[item.id] = item.contact_answer || ''
      })
      setAnswers(initialAnswers)
    }
    fetchData()
  }, [])

  const handleRowClick = id => {
    // 이미 열린 행을 클릭하면 닫히도록 설정합니다.
    if (openRowId === id) {
      setOpenRowId(null)
    } else {
      setOpenRowId(id)
    }
  }

  // console.log(contact)

  const handleAnswerChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleAnswerSubmit = async id => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    const answer = answers[id]
    try {
      const response = await axios.patch(
        `https://api.knori.or.kr/contact/${id}`,
        { contact_answer: answer },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )

      // 성공적인 응답 처리
      console.log('답변이 성공적으로 제출되었습니다.', response.data)

      // 여기에 상태 업데이트 로직 추가
      // 예: 답변이 성공적으로 제출된 문의사항을 UI에서 표시하기 위해 contact 상태 업데이트
      setContact(prevContacts =>
        prevContacts.map(contact => {
          if (contact.id === id) {
            return { ...contact, contact_answer: answer } // 문의사항에 답변 추가
          }

          return contact
        })
      )
    } catch (error) {
      // 예외 처리 강화
      console.error('답변 제출 중 오류가 발생했습니다.', error)
    }
  }
  const [selectedRow, setSelectedRow] = useState(null)
  const [answerText, setAnswerText] = useState('')

  const handleListItemClick = row => {
    setSelectedRow(row)
    setAnswerText(row.contact_answer || '') // 기존 답변이 있으면 불러오기
  }

  const handleDialogClose = () => {
    setSelectedRow(null)
  }

  const handleDialogSubmit = () => {
    // 필요한 경우 서버로 답변 텍스트를 전송하는 로직 추가
    console.log('답변 저장:', answerText)
    handleDialogClose()
  }

  useEffect(() => {
    if (selectedRow) {
      console.log('selectedRow:', selectedRow)
    }
  }, [selectedRow])

  //.
  if (isMobile) {
    return (
      <Box p={2}>
        <List>
          {contact.map(row => (
            <Paper key={row.id} variant='outlined' style={{ marginBottom: '1rem', padding: '1rem' }}>
              <ListItem>
                <ListItemText primary={`문의자: ${row.user_name}`} />
                <Button variant='contained' color='primary' onClick={() => handleListItemClick(row)}>
                  자세히 보기
                </Button>
              </ListItem>
            </Paper>
          ))}
        </List>
        <Dialog open={Boolean(selectedRow)} onClose={handleDialogClose}>
          <DialogTitle>문의 상세</DialogTitle>
          <DialogContent>
            {selectedRow && (
              <>
                <Typography variant='body1' gutterBottom>
                  문의 내용: {selectedRow.contact}
                </Typography>

                <Typography variant='body1' gutterBottom>
                  고객 번호: {selectedRow.phone}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant='outlined'
                  value={answerText}
                  onChange={e => setAnswerText(e.target.value)}
                  placeholder='여기에 답변을 입력하세요...'
                  margin='normal'
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color='primary'>
              취소
            </Button>
            <Button onClick={handleDialogSubmit} color='primary'>
              저장하기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    )
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {index === columns.length - 1 ? ( // 가장 오른쪽 열인 경우
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{column.label}</span>
                      <Button variant='contained' color='primary'>
                        추가
                      </Button>
                    </div>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {contact.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <React.Fragment key={row.id}>
                <TableRow hover role='checkbox' tabIndex={-1} onClick={() => handleRowClick(row.id)}>
                  {columns.map(column => {
                    if (column.id === 'contact_answer') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {/* 'contact_answer' 값에 따라 다른 텍스트를 표시 */}
                          {row[column.id] === '' ? '미답변' : '답변완료'}
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'date' ? new Date(row[column.id]).toLocaleDateString() : row[column.id]}
                      </TableCell>
                    )
                  })}
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRowId === row.id} timeout='auto' unmountOnExit>
                      <Box margin={1}>
                        <Typography style={{ marginTop: '10px' }} variant='subtitle1' gutterBottom>
                          문의 내용: {row.contact}
                        </Typography>
                        <Typography style={{ marginTop: '10px' }} variant='subtitle1' gutterBottom>
                          고객 번호: {row.phone}
                        </Typography>
                        {/* 구분선을 추가하여 문의 내용과 답변 입력 부분을 시각적으로 분리합니다. */}
                        <hr style={{ marginBottom: '10px' }} />

                        {/* 답변을 위한 텍스트 박스의 디자인을 개선합니다. */}
                        <textarea
                          style={{
                            width: '100%',
                            height: '100px',
                            padding: '10px',
                            boxSizing: 'border-box',
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                          }}
                          placeholder='여기에 답변을 입력하세요...'
                          value={answers[row.id]} // 각 행의 ID를 키로 사용하여 해당 답변을 value로 설정
                          onChange={e => handleAnswerChange(row.id, e.target.value)}
                        />

                        {/* 저장하기 버튼을 오른쪽으로 이동시키고 디자인을 개선합니다. */}
                        <Box display='flex' justifyContent='flex-end' marginTop={2}>
                          <Button variant='contained' color='primary' onClick={() => handleAnswerSubmit(row.id)}>
                            저장하기
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={contact.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default ContactList
