import React, { useState, useEffect } from 'react'

import axios from 'axios'

import authConfig from 'src/configs/auth'

// ** MUI Imports
import TablePagination from '@mui/material/TablePagination'
import contactDB from 'src/@real-db/app/contactDB'
import Modal from '@mui/material/Modal'
import { Typography } from '@mui/material'

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
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const data = await contactDB()
      setContact(data)
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

  console.log(contact)

  const handleAnswerChange = e => {
    setAnswer(e.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleAnswerSubmit = () => {}

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
                          defaultValue={row.contact_answer}
                          value={answer}
                          onChange={handleAnswerChange}
                        />

                        {/* 저장하기 버튼을 오른쪽으로 이동시키고 디자인을 개선합니다. */}
                        <Box display='flex' justifyContent='flex-end' marginTop={2}>
                          <Button variant='contained' color='primary' onClick={handleAnswerSubmit(row.id)}>
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