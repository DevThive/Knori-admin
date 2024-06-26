// ** React Imports
import { useEffect, useState, forwardRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import axios from 'axios'
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'
import CustomTextField from 'src/@core/components/mui/text-field'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <CustomTextField fullWidth inputRef={ref} sx={{ width: { sm: '250px', xs: '170px' } }} {...props} />
})

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

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-2.375rem',
    position: 'absolute'
  },
  [theme.breakpoints.down('md')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(16, 10, 10),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(16)
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6)
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': {
    color: `${theme.palette.success.main} !important`,
    backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important`
  },
  '&.Mui-focusVisible': {
    backgroundColor: `${alpha(theme.palette.success.main, 0.2)} !important`
  },
  '&.Mui-selected': {
    color: `${theme.palette.success.contrastText} !important`,
    backgroundColor: `${theme.palette.success.main} !important`,
    '&.Mui-focusVisible': {
      backgroundColor: `${theme.palette.success.dark} !important`
    }
  }
}))
const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const AddCard = props => {
  // ** Props
  const { clients, invoiceNumber, selectedClient, setSelectedClient, toggleAddCustomerDrawer } = props

  // ** States
  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState('')
  const [issueDate, setIssueDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date(tomorrowDate))
  const [options, setOptions] = useState([])

  // ** Hook
  const theme = useTheme()

  // 가격과 인원수 상태 초기화
  const [price, setPrice] = useState(18000) // 초기 가격값
  const [people, setPeople] = useState(0) // 초기 인원수

  const totalAmount = price * people

  // ** Deletes form
  const deleteForm = e => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-wrapper').remove()
  }

  useEffect(() => {
    // 컴포넌트가 마운트될 때 API 요청
    axios
      .get('https://api.knori.or.kr/class') // 여기서 URL은 실제 API의 URL로 대체해야 합니다.
      .then(response => {
        setOptions(response.data) // API로부터 받은 데이터를 상태에 저장
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  }, [])

  // ** Handle Invoice To Change
  const handleInvoiceChange = event => {
    setSelected(event.target.value)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.name === event.target.value)[0])
    }
  }

  const handleAddNewCustomer = () => {
    toggleAddCustomerDrawer()
  }

  return (
    <Card>
      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
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
          <Grid item xl={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography variant='h4' sx={{ mr: 2, width: '105px' }}>
                  청구서
                </Typography>
                <CustomTextField
                  fullWidth
                  value={invoiceNumber}
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  InputProps={{
                    disabled: true,
                    startAdornment: <InputAdornment position='start'>#</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>발행일 :</Typography>
                <DatePicker
                  id='issue-date'
                  selected={issueDate}
                  customInput={<CustomInput />}
                  onChange={date => setIssueDate(date)}
                />
              </Box>
              {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Due:</Typography>
                <DatePicker
                  id='due-date'
                  selected={dueDate}
                  customInput={<CustomInput />}
                  onChange={date => setDueDate(date)}
                />
              </Box> */}
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
            <CustomTextField
              select
              sx={{
                mb: 4,
                width: '200px',
                '& .MuiFilledInput-input.MuiSelect-select': { minWidth: '11rem !important' }
              }}
              SelectProps={{ value: selected, onChange: e => handleInvoiceChange(e) }}
            >
              <CustomSelectItem value='' onClick={handleAddNewCustomer}>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon icon='tabler:plus' fontSize='1.125rem' />
                  Add New Customer
                </Box>
              </CustomSelectItem>
              {clients !== undefined &&
                clients.map(client => (
                  <MenuItem key={client.name} value={client.name}>
                    {client.name}
                  </MenuItem>
                ))}
            </CustomTextField>
            {selectedClient !== null && selectedClient !== undefined ? (
              <>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.company}</Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.address}</Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.contact}</Typography>
                <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{selectedClient.companyEmail}</Typography>
              </>
            ) : null}
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
                        <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$12,110.55</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>결제 방식 :</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>American Bank</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <RepeaterWrapper>
        <Repeater count={count}>
          {i => {
            const Tag = i === 0 ? Box : Collapse

            return (
              <Tag key={i} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                <Grid container>
                  <RepeatingContent item xs={12}>
                    <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                      <Grid item lg={6} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          클래스명 & 설명
                        </Typography>
                        <CustomTextField select fullWidth defaultValue={``}>
                          {options.map((option, index) => (
                            <MenuItem key={index} value={option.title}>
                              {option.title}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                        <CustomTextField rows={2} fullWidth multiline sx={{ mt: 3.5 }} placeholder='메모' />
                      </Grid>
                      <Grid item lg={2} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          가격
                        </Typography>
                        <CustomTextField
                          type='number'
                          placeholder='24'
                          value={price}
                          onChange={e => setPrice(Number(e.target.value))}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          인원수
                        </Typography>
                        <CustomTextField
                          type='number'
                          placeholder='1'
                          value={people}
                          onChange={e => setPeople(Number(e.target.value))}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item lg={2} md={1} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          총액
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{totalAmount}원</Typography>
                      </Grid>
                    </Grid>
                    <InvoiceAction>
                      <IconButton size='small' onClick={deleteForm}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                      </IconButton>
                    </InvoiceAction>
                  </RepeatingContent>
                </Grid>
              </Tag>
            )
          }}
        </Repeater>

        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={12} sx={{ px: 0 }}>
            <Button variant='contained' onClick={() => setCount(count + 1)}>
              Add Item
            </Button>
          </Grid>
        </Grid>
      </RepeaterWrapper>

      <Divider />
      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        <Grid container>
          <Grid item xs={12} sm={7} lg={6} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, lineHeight: 'normal' }}>
                Salesperson:
              </Typography>
              <CustomTextField fullWidth defaultValue='Tommy Shelby' />
            </Box>
            <CustomTextField fullWidth placeholder='Thanks for your business' />
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            lg={6}
            sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 }, display: 'flex', justifyContent: 'flex-end' }}
          >
            <Box sx={{ minWidth: 150, '& > *': { width: '100%' } }}>
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>Subtotal:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$1800</Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>Discount:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$28</Typography>
              </CalcWrapper>
              <CalcWrapper sx={{ mb: '0 !important' }}>
                <Typography sx={{ color: 'text.secondary' }}>Tax:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>21%</Typography>
              </CalcWrapper>
              <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>Total:</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$1690</Typography>
              </CalcWrapper>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent sx={{ px: [6, 10] }}>
        <InputLabel
          htmlFor='invoice-note'
          sx={{ mb: 2, fontWeight: 500, fontSize: theme.typography.body2.fontSize, lineHeight: 'normal' }}
        >
          메모:
        </InputLabel>
        <CustomTextField rows={2} fullWidth multiline id='invoice-note' defaultValue='' placeholder='메모' />
      </CardContent>
    </Card>
  )
}

export default AddCard
