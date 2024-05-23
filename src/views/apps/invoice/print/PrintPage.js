// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import CardContent from '@mui/material/CardContent'

// ** Third Party Components
import axios from 'axios'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const InvoicePrint = ({ id }) => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)

  // ** Hooks
  const theme = useTheme()
  useEffect(() => {
    setTimeout(() => {
      window.print()
    }, 100)
  }, [])
  useEffect(() => {
    axios
      .get(`https://api.knori.or.kr/invoice/${id}`)
      .then(res => {
        // console.log(res.data[0])
        setData(res.data)
        setError(false)
      })
      .catch(error => {
        console.log(error)
        setData(null)
        setError(true)
      })
  }, [id])
  if (data) {
    const { invoice, paymentDetails } = data

    // console.log(data)
    const totalAmount = data.invoiceItems.reduce((acc, item) => acc + item.people * item.price, 0)

    return (
      <Box sx={{ p: 12, pb: 6 }}>
        <Grid container>
          <Grid item xs={8} sx={{ mb: { sm: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                {/* <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    fill={theme.palette.primary.main}
                    d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                  />
                  <path
                    fill='#161616'
                    opacity={0.06}
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                  />
                  <path
                    fill='#161616'
                    opacity={0.06}
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    fill={theme.palette.primary.main}
                    d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                  />
                </svg> */}
                <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <div>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>경기도 양주시 백석읍 기산로 548</Typography>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>(재)케이놀이문화재단</Typography>
                <Typography sx={{ color: 'text.secondary' }}>+82 (031) 876 9500</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end', xs: 'flex-start' } }}>
              <Typography variant='h4' sx={{ mb: 2 }}>
                {`청구서 #${data.id}`}
              </Typography>
              <Box sx={{ mb: 2, display: 'flex' }}>
                <Typography sx={{ mr: 3, color: 'text.secondary' }}>발행일 :</Typography>
                <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {new Date(data.issuedDate).toLocaleDateString()}
                </Typography>
              </Box>
              {/* <Box sx={{ display: 'flex' }}>
                <Typography sx={{ mr: 3, color: 'text.secondary' }}>마감일 :</Typography>
                <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{data.dueDate}</Typography>
              </Box> */}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: theme => `${theme.spacing(6)} !important` }} />

        <Grid container>
          <Grid item xs={7} md={8} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='h6' sx={{ mb: 3.5, fontWeight: 600 }}>
              받는 사람 :
            </Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{data.name}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{data.company}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{data.address}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{data.contact}</Typography>
            <Typography sx={{ mb: 2, color: 'text.secondary' }}>{data.companyEmail}</Typography>
          </Grid>
          <Grid item xs={5} md={4}>
            <Typography variant='h6' sx={{ mb: 3.5, fontWeight: 600 }}>
              청구 대상 :
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <MUITableCell>
                    <Typography sx={{ color: 'text.secondary' }}>총 지불액 :</Typography>
                  </MUITableCell>
                  <MUITableCell>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{totalAmount}원</Typography>
                  </MUITableCell>
                </TableRow>
                <TableRow>
                  <MUITableCell>
                    <Typography sx={{ color: 'text.secondary' }}>결제 방식 :</Typography>
                  </MUITableCell>
                  <MUITableCell>
                    <Typography sx={{ color: 'text.secondary' }}>{/* {data.paymentDetails.bankName} */}</Typography>
                  </MUITableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>

        <Divider sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: '0 !important' }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>클래스명</TableCell>
                <TableCell>설명</TableCell>
                <TableCell>가격</TableCell>
                <TableCell>인원수</TableCell>
                <TableCell>총액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  py: `${theme.spacing(2.5)} !important`,
                  fontSize: theme.typography.body1.fontSize
                }
              }}
            >
              {data.invoiceItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.className}</TableCell>
                  <TableCell>{item.content}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.people}</TableCell>
                  <TableCell>{item.people * item.price}원</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>구매자 :</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data.name}</Typography>
              </Box>

              <Typography sx={{ color: 'text.secondary' }}>구매해주셔서 감사합니다.</Typography>
            </Grid>
            <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>소계 :</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{totalAmount}원</Typography>
              </CalcWrapper>

              {/* <Divider sx={{ my: `${theme.spacing(2)} !important` }} /> */}
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>할인 :</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>0%</Typography>
              </CalcWrapper>

              <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>총액 :</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{totalAmount}원</Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ my: `${theme.spacing(6)} !important` }} />
        <Typography sx={{ color: 'text.secondary' }}>
          <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
            메모 :
          </Typography>
          {data.note}
        </Typography>
      </Box>
    )
  } else if (error) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Invoice with the id: {id} does not exist. Please check the list of invoices:{' '}
              <Link href='/apps/invoice/list'>Invoice List</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  } else {
    return null
  }
}

export default InvoicePrint
