// ** Third Party Imports
import axios from 'axios'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PrintPage from 'src/views/apps/invoice/print/PrintPage'

const InvoicePrint = ({ invoiceData }) => {
  return <PrintPage id={invoiceData.id} />
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

  const invoiceData = params

  return {
    props: {
      invoiceData
    }
  }
}

InvoicePrint.getLayout = page => <BlankLayout>{page}</BlankLayout>
InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default InvoicePrint
