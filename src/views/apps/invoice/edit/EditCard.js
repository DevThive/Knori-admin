// ** React Imports
import { useEffect, useState, forwardRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
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
import authConfig from 'src/configs/auth'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: { sm: '250px', xs: '170px' } }} />
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

const EditCard = ({ data, onEditChange }) => {
  const totalAmount = data.invoiceItems.reduce((acc, item) => acc + item.people * 18000, 0)

  // const [selected, setSelected] = useState('')
  // const [clients, setClients] = useState(undefined)
  // const [selectedClient, setSelectedClient] = useState(null)
  // const [dueDate, setDueDate] = useState(data ? new Date(data.dueDate) : new Date())
  const [issueDate, setIssueDate] = useState(data ? new Date(data.issuedDate) : new Date())
  const [options, setOptions] = useState([])

  const [invoiceItems, setInvoiceItems] = useState(data.invoiceItems)

  const handlePriceChange = (index, value) => {
    const updatedItems = invoiceItems.map((item, i) => (i === index ? { ...item, price: value } : item))
    setInvoiceItems(updatedItems)
  }

  const handlePeopleChange = (index, value) => {
    const updatedItems = invoiceItems.map((item, i) => (i === index ? { ...item, people: value } : item))
    setInvoiceItems(updatedItems)
  }

  const handleClassNameChange = (index, newValue) => {
    const newInvoiceItems = [...invoiceItems]
    newInvoiceItems[index].className = newValue
    setInvoiceItems(newInvoiceItems) // 상태 업데이트 함수를 호출해야 합니다.
  }

  const handleContentChange = (index, newValue) => {
    const newInvoiceItems = [...invoiceItems]
    newInvoiceItems[index].content = newValue
    setInvoiceItems(newInvoiceItems) // 상태 업데이트 함수를 호출해야 합니다.
  }

  const [formData, setFormData] = useState({
    id: data.id,
    name: data.name,
    address: data.address,
    contact: data.contact,
    companyEmail: data.companyEmail,
    note: data.note
  })

  // 입력 핸들러 함수
  const handleInputChange = e => {
    const { name, value } = e.target

    const updatedFormData = {
      ...formData,
      [name]: value
    }

    setFormData(updatedFormData) // 상태 업데이트

    onEditChange(updatedFormData) // 상위 컴포넌트로 변경된 데이터 전달
  }

  // API 호출을 수행하는 함수를 정의합니다.
  const sendInvoiceItemToApi = async item => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

    // console.log(item)

    try {
      const response = await axios.put(`https://api.knori.or.kr/invoice-item/${item.id}`, item, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })

      alert('저장되었습니다.')

      // console.log('서버 응답:', response.data)

      // 성공적으로 데이터를 보냈다면, 사용자에게 피드백을 주거나 상태를 업데이트할 수 있습니다.
    } catch (error) {
      console.error('API 호출 오류:', error)

      // 오류 처리 로직을 여기에 추가하세요.
    }
  }

  // // 가격과 인원수 상태 초기화
  // const [price, setPrice] = useState(data.price) // 초기 가격값
  // const [people, setPeople] = useState(data.totalPeople) // 초기 인원수

  // 총액 계산

  // ** Hook
  const theme = useTheme()

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

  // // ** Deletes form
  // const deleteForm = e => {
  //   e.preventDefault()

  //   // @ts-ignore
  //   e.target.closest('.repeater-wrapper').remove()
  // }

  if (data) {
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
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
                    value={data.id}
                    sx={{ width: { sm: '250px', xs: '170px' } }}
                    InputProps={{
                      disabled: true,
                      startAdornment: <InputAdornment position='start'>#</InputAdornment>
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>발행일 :</Typography>
                  <CustomTextField
                    id='issue-date'
                    value={new Date(data.issuedDate).toLocaleDateString()}
                    sx={{ width: { sm: '250px', xs: '170px' } }}
                    InputProps={{
                      disabled: true,
                      startAdornment: <InputAdornment position='start'></InputAdornment>
                    }}

                    // customInput={<CustomInput />}
                    // onChange={date => {
                    //   setIssueDate(date)
                    // }}
                  />
                </Box>
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
              <div>고객명 :</div>
              <CustomTextField defaultValue={formData.name} onChange={handleInputChange} name='name' />
              <div>주소 :</div>
              <CustomTextField fullWidth defaultValue={formData.address} onChange={handleInputChange} name='address' />
              <div>연락처 :</div>
              <CustomTextField defaultValue={formData.contact} onChange={handleInputChange} name='contact' />
              <div>이메일 :</div>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{formData.companyEmail}</Typography>
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
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <RepeaterWrapper>
          {invoiceItems.map((item, index) => {
            const Tag = index === 0 ? Box : Collapse

            return (
              <Tag key={index} className='repeater-wrapper' {...(index !== 0 ? { in: true } : {})}>
                <Grid container>
                  <RepeatingContent item xs={12}>
                    <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                      <Grid item lg={6} md={5} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          클래스명 & 설명
                        </Typography>
                        <CustomTextField
                          select
                          fullWidth
                          defaultValue={`${item.className}`}
                          onChange={e => handleClassNameChange(index, e.target.value)}
                        >
                          {options.map((option, index) => (
                            <MenuItem key={index} value={option.title}>
                              {option.title}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                        <CustomTextField
                          rows={2}
                          fullWidth
                          multiline
                          sx={{ mt: 3.5 }}
                          placeholder='메모'
                          defaultValue={item.content}
                          onChange={e => handleContentChange(index, e.target.value)}
                        />
                      </Grid>
                      <Grid item lg={2} md={3} xs={12} sx={{ px: 4, my: { lg: 0, xs: 2 } }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          가격
                        </Typography>
                        <CustomTextField
                          type='number'
                          placeholder='24'
                          defaultValue={item.price}
                          onChange={e => handlePriceChange(index, e.target.value)}
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
                          defaultValue={item.people}
                          onChange={e => handlePeopleChange(index, e.target.value)}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item lg={2} md={2} xs={12} sx={{ px: 4, my: { lg: 0 }, mt: 2 }}>
                        <Typography className='col-title' sx={{ mb: { md: 2, xs: 0 }, color: 'text.secondary' }}>
                          총액
                        </Typography>
                        <CustomTextField
                          value={item.price * item.people}
                          InputProps={{
                            disabled: true,
                            endAdornment: <InputAdornment position='end'>원</InputAdornment>
                          }}
                          sx={{ color: 'text.secondary' }}
                        ></CustomTextField>
                        <Grid item rows={2} sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button onClick={() => sendInvoiceItemToApi(item)}>저장하기</Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </RepeatingContent>
                </Grid>
              </Tag>
            )
          })}
        </RepeaterWrapper>

        <Divider />

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
                <CustomTextField type='number' placeholder='0' InputProps={{ inputProps: { min: 0 } }} />
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
          <InputLabel
            htmlFor='invoice-note'
            sx={{ mb: 2, fontWeight: 500, fontSize: theme.typography.body2.fontSize, lineHeight: 'normal' }}
          >
            매모 :
          </InputLabel>
          <CustomTextField
            rows={2}
            fullWidth
            multiline
            name='note'
            defaultValue={formData.note}
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default EditCard
