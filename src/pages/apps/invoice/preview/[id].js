// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import Preview from 'src/views/apps/invoice/preview/Preview'

const InvoicePreview = ({ invoiceData }) => {
  // console.log(invoiceData.id)

  return <Preview id={invoiceData.id} />
}

export const getStaticPaths = async () => {
  // API 호출 시 절대 경로 사용 필요 (예시 URL은 가상의 것임)
  const res = await axios.get('https://api.knori.or.kr/invoice/invoicelist')
  const data = res.data.allData

  // console.log(data)

  const paths = data.map(item => ({
    params: { id: `${item.id}` }
  }))

  return {
    paths,
    fallback: true // 또는 'blocking'으로 설정하여 빌드 시 생성되지 않은 경로에 대해 SSR을 사용
  }
}

export const getStaticProps = async ({ params }) => {
  // 각 인보이스의 상세 정보를 가져오는 API 호출
  // API 호출 시 절대 경로 사용 필요 (예시 URL은 가상의 것임)
  // const res = await axios.get(`http://localhost:4001/invoice/${params.id}`)
  // console.log(params.id)
  const invoiceData = params

  return {
    props: {
      invoiceData
    }
  }
}

export default InvoicePreview
