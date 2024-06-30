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
import fetchDataAndProcess from 'src/@real-db/app/noticesDB'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import Noticeeditor from 'src/views/apps/notice/noticeAdd'
import noticeSelector from 'src/views/apps/notice/noticeSelector'

// ** selector import

import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Noticeeditor2 from 'src/views/apps/notice/noticeUpdate'
import TogglePrivacy from 'src/views/apps/notice/noticeSelector'

const columns = [
  { id: 'owner', label: '작성자', minWidth: 80 },
  { id: 'name', label: '타이틀', minWidth: 200 },
  { id: 'date', label: '작성 날짜', minWidth: 100 },
  { id: 'etc', label: '', align: 'right', minWidth: 40 }
]
function createData(name, owner, date) {
  return { owner, name, date }
}

const TableStickyHeader = () => {
  // ** States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [notices, setNotices] = useState([]) // 상태 추가

  // const [title, setTitle] = useState('') // 제목을 위한 상태
  // const [content, setContent] = useState('') // 에디터 내용을 위한 상태
  // const [file, setFile] = useState(null)

  // 모달 열림/닫힘 상태를 관리하는 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataAndProcess()
      setNotices(data)
    }
    fetchData()
  }, [])

  const updateNotices = newNotice => {
    setNotices([...notices, newNotice])
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
    await deleteNotice(selectedId)
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
          삭제하시겠습니까?
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

  const deleteNotice = async id => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    try {
      // axios를 이용한 삭제 API 호출
      const response = await axios.delete(`https://api.knori.or.kr/notices/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      // axios는 기본적으로 response.ok 대신 try-catch로 에러를 핸들링합니다.
      // 성공적으로 삭제된 후, UI를 업데이트하기 위해 notices 상태를 갱신합니다.
      setNotices(notices.filter(notice => notice.id !== id))
    } catch (error) {
      // axios에서는 error.response 등을 통해 더 상세한 정보를 얻을 수 있습니다.
      console.error('Failed to delete the notice:', error.response ? error.response.data : error)
    }
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
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4
                          }}
                        >
                          <Noticeeditor updateNotices={updateNotices} closeModal={handleCloseModal} />
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
            {notices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    if (column.id === 'etc') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <TogglePrivacy id={row.id} />{' '}
                          <Button variant='contained' color='primary' onClick={() => handleOpenEditModal(row)}>
                            수정하기
                          </Button>{' '}
                          <Button variant='contained' color='error' onClick={() => handleOpenDeleteModal(row.id)}>
                            삭제
                          </Button>
                        </TableCell>
                      )
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'date' ? new Date(row[column.id]).toLocaleDateString() : row[column.id]}
                        </TableCell>
                      )
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={notices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
            width: 1000,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Noticeeditor2 updateNotices={updateNotices} closeModal={handleCancelEditModal} editData={Edits} />
        </Box>
      </Modal>

      <DeleteConfirmModal />
    </>
  )
}

export default TableStickyHeader
