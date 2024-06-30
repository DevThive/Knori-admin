// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import Edit from 'src/views/apps/invoice/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const InvoiceEdit = ({ invoiceData }) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={invoiceData.id} />
    </DatePickerWrapper>
  )
}

export const getStaticPaths = async () => {
  const res = await axios.get('https://api.knori.or.kr/invoice/invoicelist')
  const data = await res.data.allData

  const paths = data.map(item => ({
    params: { id: `${item.id}` }
  }))

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps = async ({ params }) => {
  // 각 인보이스의 상세 정보를 가져오는 API 호출
  // API 호출 시 절대 경로 사용 필요 (예시 URL은 가상의 것임)
  // const res = await axios.get(`http://localhost:4001/invoice/${params.id}`)
  const invoiceData = params

  return {
    props: {
      invoiceData
    }
  }
}

export default InvoiceEdit
