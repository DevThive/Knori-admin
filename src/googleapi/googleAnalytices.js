import axios from 'axios'

const fetchData = async () => {
  const options = {
    method: 'GET',
    url: 'https://api.similarweb.com/v1/website/knori.or.kr/total-traffic-and-engagement/visits',
    params: {
      api_key: 'acbb725dd77f4c329a11df27e30d0dac',
      start_date: '2023-01',
      end_date: '2023-03',
      country: 'us',
      granularity: 'monthly',
      main_domain_only: 'false',
      format: 'json',
      show_verified: 'false',
      mtd: 'false',
      engaged_only: 'false'
    },
    headers: { accept: 'application/json' }
  }

  try {
    const response = await axios.request(options)
    console.log(response.data)

    return response.data // 이 부분이 추가되어 결과값을 반환합니다.
  } catch (error) {
    throw new Error(error) // 에러가 발생한 경우 예외를 던집니다.
  }
}

export default fetchData // fetchData 함수를 외부에서 사용할 수 있도록 export합니다.
