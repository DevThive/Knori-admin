import axios from 'axios'
import authConfig from 'src/configs/auth'

async function fetchDataAndProcess() {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  try {
    const response = await axios.get('https://api.knori.or.kr/contact/admin', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
    const data = response.data

    const processedData = data.map(item => {
      return {
        id: item.id,
        user_name: item.user_name,
        contact_title: item.content_title,
        phone: item.user_phone,
        contact: item.content,
        contact_answer: item.contact_answer,
        date: new Date(item.createdAt) // 날짜 데이터로 변환하여 저장
      }
    })

    // 날짜 기준으로 데이터 내림차순 정렬
    processedData.sort((a, b) => b.date - a.date)

    return processedData
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error)

    return [] // 오류 발생 시 빈 배열 반환 또는 다른 적절한 처리
  }
}

export default fetchDataAndProcess
