// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import EditCard from './EditCard'
import EditActions from './EditActions'
import AddPaymentDrawer from 'src/views/apps/invoice/shared-drawer/AddPaymentDrawer'
import SendInvoiceDrawer from 'src/views/apps/invoice/shared-drawer/SendInvoiceDrawer'
import authConfig from 'src/configs/auth'

const InvoiceEdit = ({ id }) => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState(false)

  // 변경된 데이터를 저장할 새로운 상태 추가
  const [editedData, setEditedData] = useState({})

  // EditCard에서 변경사항을 받는 함수
  const handleEditChange = updatedData => {
    setEditedData(updatedData)
  }

  const saveChanges = () => {
    if (Object.keys(editedData).length === 0) {
      alert('변경된 내용이 없습니다.')
    } else {
      // console.log(editedData)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

      axios
        .patch(`https://api.knori.or.kr/invoice/${editedData.id}`, editedData, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(res => {
          console.log('저장 성공', res)
          window.location.href = `/apps/invoice/preview/${editedData.id}`

          // 성공적으로 저장된 후의 로직 처리 (예: 상태 업데이트, 사용자에게 알림 등)
        })
        .catch(error => {
          console.error('저장 실패', error)

          // 오류 처리 로직
        })
    }
  }

  const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)
  useEffect(() => {
    axios
      .get(`https://api.knori.or.kr/invoice/${id}`)
      .then(res => {
        console.log(res.data)
        setData(res.data)
        setError(false)
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
  }, [id])
  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <EditCard data={data} onEditChange={handleEditChange} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <EditActions
              id={id}
              onSave={saveChanges}
              data={editedData}
              toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
              toggleAddPaymentDrawer={toggleAddPaymentDrawer}
            />
          </Grid>
        </Grid>
        <SendInvoiceDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} />
        <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} />
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Invoice with the id: {id} does not exist. Please check the list of invoices:{' '}
            <Link href='/apps/invoice/list'>Invoice List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoiceEdit
