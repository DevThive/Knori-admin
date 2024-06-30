// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const PreviewCard = ({ data }) => {
  // ** Hook
  // console.log(data)
  const totalAmount = data.invoiceItems.reduce((acc, item) => acc + item.people * item.price, 0)
  const theme = useTheme()
  if (data) {
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
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
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '210px' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h4'>청구서</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h4'>{`#${data.id}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>발행일 :</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>
                          {new Date(data.issuedDate).toLocaleDateString()}
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                    {/* <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>마감일 :</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{data.dueDate}</Typography>
                      </MUITableCell>
                    </TableRow> */}
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='h6' sx={{ mb: 6 }}>
                받는 사람 :
              </Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.name}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.company}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.address}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.contact}</Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{data.companyEmail}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='h6' sx={{ mb: 6 }}>
                  청구 대상 :
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(0.75)} !important` } }}>
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
                          <Typography sx={{ color: 'text.secondary' }}>
                            {/* {data.paymentDetails.bankName} */}
                          </Typography>
                        </MUITableCell>
                      </TableRow>

                      {/* <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>IBAN:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.iban}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>SWIFT code:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>{data.paymentDetails.swiftCode}</Typography>
                        </MUITableCell>
                      </TableRow> */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

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

        <Divider />

        <CardContent sx={{ px: [6, 10] }}>
          <Typography sx={{ color: 'text.secondary' }}>
            <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
              메모 :
            </Typography>
            {data.note}
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
