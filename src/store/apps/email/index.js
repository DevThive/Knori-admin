// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import authConfig from 'src/configs/auth'
import MailDetails from 'src/views/apps/email/MailDetails'

import mimemessage from 'mimemessage'

// import nodemailer from 'nodemailer'

// import { google } from 'googleapis'

async function getGoogleApiToken() {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  try {
    const response = await axios.get('https://api.knori.or.kr/gmail/token', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })

    return response.data // Google API로부터 받은 데이터 반환
  } catch (error) {
    console.error('Google API 토큰을 가져오는 데 실패했습니다.', error)
    throw error // 에러 발생 시, 해당 에러를 호출한 곳으로 전파
  }
}

export const fetchMails = createAsyncThunk('appEmail/fetchMails', async (params, { rejectWithValue }) => {
  try {
    const googleApi = await getGoogleApiToken()

    // console.log(googleApi)

    // 라벨 목록 가져오기
    const labelsResponse = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/labels`, {
      headers: {
        Authorization: `Bearer ${googleApi.accessToken}`
      }
    })

    // 라벨 ID와 이름 매핑
    const labelsMap = labelsResponse.data.labels.reduce((map, label) => {
      map[label.id] = label.name

      return map
    }, {})

    // 검색 쿼리 설정
    let searchQuery = params.q || ''
    if (params.folder) {
      searchQuery += ` in:${params.folder}`
    }
    if (params.label) {
      searchQuery += ` label:${params.label}`
    }

    // 메일 목록 요청
    const mailListResponse = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages?q=${encodeURIComponent(
        searchQuery
      )}&maxResults=30`,
      {
        headers: {
          Authorization: `Bearer ${googleApi.accessToken}`
        }
      }
    )

    // 메시지가 없는 경우 빈 배열 반환
    if (!mailListResponse.data.messages || mailListResponse.data.messages.length === 0) {
      return { emails: [], filter: params }
    }

    // 개별 메시지 상세 정보 요청 함수
    // 개별 메시지 상세 정보 요청 함수
    const fetchMessageDetails = async message => {
      try {
        const messageDetailsResponse = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${googleApi.accessToken}`
            }
          }
        )
        const headers = messageDetailsResponse.data.payload.headers
        const subject = headers.find(header => header.name === 'Subject')?.value
        const fromHeader = headers.find(header => header.name === 'From')?.value
        const time = headers.find(header => header.name === 'Date')?.value

        const from = {
          email: fromHeader.match(/<(.+)>/)?.[1] || fromHeader,
          name: fromHeader.split(' <')[0]
        }

        const to = headers
          .filter(header => header.name === 'To')
          .map(header => ({
            name: header.value.split(' <')[0],
            email: header.value.match(/<(.+)>/)?.[1] || header.value
          }))
        const isRead = !messageDetailsResponse.data.labelIds.includes('UNREAD')

        const isStarred = messageDetailsResponse.data.labelIds.includes('STARRED')

        // console.log(messageDetailsResponse.data.labelIds)

        const labels = messageDetailsResponse.data.labelIds
          .map(labelId => labelsMap[labelId] || labelId)
          .filter(label => ['PRIVATE', 'COMPANY', 'IMPORTANT'].includes(label))

        return {
          id: message.id,
          from,
          to,
          subject,
          cc: [],
          bcc: [],
          message: '<p>This is a placeholder for the actual message content.</p>',
          attachments: [],
          isStarred,
          labels,
          time,
          replies: [],
          folder: 'inbox',
          isRead
        }
      } catch (error) {
        console.error('Error fetching message details:', error)

        // 오류가 발생하더라도 기본 값 반환으로 안정적인 오류 처리
        return {
          id: message.id,
          from: { email: '', name: 'Unknown' },
          to: [],
          subject: 'Error Loading Subject',
          cc: [],
          bcc: [],
          message: '<p>Error loading message content.</p>',
          attachments: [],
          isStarred: false,
          labels: [],
          time: 'Unknown',
          replies: [],
          folder: 'inbox',
          isRead: false
        }
      }
    }

    // 모든 메시지의 상세 정보 비동기 요청
    const mailsDetailsPromises = mailListResponse.data.messages.map(fetchMessageDetails)
    const mailsDetails = await Promise.all(mailsDetailsPromises)

    return { emails: mailsDetails, filter: params }
  } catch (error) {
    return rejectWithValue('Error fetching mails')
  }
})

// ** Get Current Mail
export const getCurrentMail = createAsyncThunk('appEmail/selectMail', async id => {
  try {
    const googleApi = await getGoogleApiToken() // Google API 토큰을 가져옵니다.

    // 라벨 목록 가져오기
    const labelsResponse = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/labels`, {
      headers: {
        Authorization: `Bearer ${googleApi.accessToken}`
      }
    })

    // 라벨 ID와 이름 매핑
    const labelsMap = labelsResponse.data.labels.reduce((map, label) => {
      map[label.id] = label.name

      return map
    }, {})

    // messageDetailsResponse와 messageDetailsResponseRaw를 병렬로 요청
    const [messageDetailsResponse, messageDetailsResponseRaw] = await Promise.all([
      axios.get(`https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages/${id}?format=full`, {
        headers: {
          Authorization: `Bearer ${googleApi.accessToken}`
        }
      }),
      axios.get(`https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages/${id}?format=raw`, {
        headers: {
          Authorization: `Bearer ${googleApi.accessToken}`
        }
      })
    ])

    // console.log(messageDetailsResponseRaw.data.raw)

    const headers = messageDetailsResponse.data.payload.headers
    const subject = headers.find(header => header.name === 'Subject')?.value
    const fromHeader = headers.find(header => header.name === 'From')?.value
    const time = headers.find(header => header.name === 'Date')?.value

    const from = {
      email: fromHeader.match(/<(.+)>/)?.[1] || fromHeader,
      name: fromHeader.split(' <')[0]

      // avatar: '/images/avatars/default.png'
    }

    const to = [
      {
        name: messageDetailsResponse.data.payload.headers[0].name,
        email: messageDetailsResponse.data.payload.headers[0].value
      }
    ]

    // const decodedEmail = decodeEmailRawData(messageDetailsResponseRaw.data.raw)

    // console.log(decodedEmail)

    const labels = messageDetailsResponse.data.labelIds
      .map(labelId => labelsMap[labelId] || labelId)
      .filter(label => ['PRIVATE', 'COMPANY', 'IMPORTANT'].includes(label))

    return {
      id: messageDetailsResponse.id,
      from,
      to,
      subject,
      cc: [],
      bcc: [],
      message: messageDetailsResponseRaw.data.raw,
      attachments: [],
      isStarred: false,
      labels,
      time,
      replies: [],
      folder: 'inbox',
      isRead: false
    }
  } catch (error) {
    console.error('메일을 가져오는 데 실패했습니다.', error)
    throw error // 에러 발생 시, 해당 에러를 호출한 곳으로 전파합니다.
  }
})

// ** Update Mail
export const updateMail = createAsyncThunk('appEmail/updateMail', async (params, { dispatch, getState }) => {
  try {
    const { emailIds, dataToUpdate } = params
    const googleApi = await getGoogleApiToken() // Google API 토큰을 가져옵니다.
    const userId = googleApi.email

    // console.log(emailIds, dataToUpdate)

    // 요청에 사용될 공통 헤더 설정
    const config = {
      headers: {
        Authorization: `Bearer ${googleApi.accessToken}`
      }
    }

    // 메일 ID 배열이 주어진 경우
    if (Array.isArray(emailIds)) {
      // 각 메일 ID에 대해 업데이트 수행
      for (const id of emailIds) {
        if (dataToUpdate.folder === 'trash') {
          // 메일을 휴지통으로 이동
          await axios.post(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${id}/trash`, {}, config)
        } else if (dataToUpdate.isStarred !== undefined) {
          // 메일 중요 표시 업데이트
          const addLabelIds = dataToUpdate.isStarred ? ['STARRED'] : []
          const removeLabelIds = dataToUpdate.isStarred ? [] : ['STARRED']
          await axios.post(
            `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${id}/modify`,
            { removeLabelIds, addLabelIds },
            config
          )
        } else if (dataToUpdate.isRead !== undefined) {
          // 메일 읽음 표시 업데이트
          const addLabelIds = dataToUpdate.isRead ? [] : ['UNREAD']
          const removeLabelIds = dataToUpdate.isRead ? ['UNREAD'] : []
          await axios.post(
            `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${id}/modify`,
            { removeLabelIds, addLabelIds },
            config
          )
        } else if (dataToUpdate.folder) {
          // 메일 폴더 업데이트
          await axios.post(
            `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${id}/modify`,
            {
              removeLabelIds: ['INBOX'],
              addLabelIds: [dataToUpdate.folder]
            },
            config
          )
        }
      }
    }

    // 메일 목록 다시 가져오기
    await dispatch(fetchMails(getState().email.filter))

    // 현재 선택된 메일 가져오기 (선택된 메일이 있을 때만)
    if (emailIds.length > 0) {
      await dispatch(getCurrentMail(emailIds[0]))
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating mail:', error)

    return { success: false, error: error.message }
  }
})

// ** Gmail 라벨을 가져오는 함수
const getGmailLabels = async accessToken => {
  const response = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  return response.data.labels
}

// ** 이메일 라벨을 업데이트하는 Redux Async Thunk
export const updateMailLabel = createAsyncThunk('appEmail/updateMailLabel', async (params, { dispatch, getState }) => {
  // console.log('updateMailLabel 시작', params)

  const googleApi = await getGoogleApiToken()
  const accessToken = googleApi.accessToken

  // console.log('accessToken 획득', accessToken)

  const updateEmailLabelsWithGmailAPI = async (emailId, addLabels, removeLabels) => {
    try {
      console.log(
        `updateEmailLabelsWithGmailAPI 실행 - emailId: ${emailId}, addLabels: ${addLabels}, removeLabels: ${removeLabels}`
      )

      const response = await axios.post(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`,
        {
          addLabelIds: addLabels,
          removeLabelIds: removeLabels
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // console.log(`라벨 업데이트 성공 - emailId: ${emailId}`, response.data)

      return response.data
    } catch (error) {
      console.error(`Error updating labels for message ID: ${emailId}`, error.response?.data || error.message)
      throw error
    }
  }

  const labels = await getGmailLabels(accessToken)

  // console.log('라벨 목록 획득', labels)

  const labelMap = labels.reduce((acc, label) => {
    acc[label.name] = label.id

    return acc
  }, {})

  // console.log('라벨 맵 생성', labelMap)

  // console.log(params.addLabels)

  // console.log('test')

  const addLabelIds = Array.isArray(params.addLabels)
    ? params.addLabels.map(label => labelMap[label]).filter(id => id !== undefined)
    : params.addLabels
    ? [labelMap[params.addLabels]].filter(id => id !== undefined)
    : []

  const removeLabelIds = Array.isArray(params.removeLabels)
    ? params.removeLabels.map(label => labelMap[label]).filter(id => id !== undefined)
    : params.removeLabels
    ? [labelMap[params.removeLabels]].filter(id => id !== undefined)
    : []
  console.log('라벨 ID 매핑 - addLabelIds:', addLabelIds, 'removeLabelIds:', removeLabelIds)

  const responses = await Promise.all(
    params.emailIds.map(emailId => updateEmailLabelsWithGmailAPI(emailId, addLabelIds, removeLabelIds))
  )

  // console.log('모든 라벨 업데이트 요청 완료', responses)

  // 예시로, fetchMails 및 getCurrentMail 액션의 구현은 생략되어 있음
  // await dispatch(fetchMails(getState().email.filter))
  // if (Array.isArray(params.emailIds) && params.emailIds.length > 0) {
  //   await dispatch(getCurrentMail(params.emailIds[0]))
  // }

  return responses
})

// ** Prev/Next Mails
export const paginateMail = createAsyncThunk('appEmail/paginateMail', async params => {
  const response = await axios.get('/apps/email/paginate-email', { params })

  return response.data
})

export const appEmailSlice = createSlice({
  name: 'appEmail',
  initialState: {
    mails: null,
    mailMeta: null,
    filter: {
      q: '',
      label: '',
      folder: 'inbox'
    },
    currentMail: null,
    selectedMails: []
  },
  reducers: {
    handleSelectMail: (state, action) => {
      const mails = state.selectedMails
      if (!mails.includes(action.payload)) {
        mails.push(action.payload)
      } else {
        mails.splice(mails.indexOf(action.payload), 1)
      }
      state.selectedMails = mails
    },
    handleSelectAllMail: (state, action) => {
      const selectAllMails = []
      if (action.payload && state.mails !== null) {
        selectAllMails.length = 0

        // @ts-ignore
        state.mails.forEach(mail => selectAllMails.push(mail.id))
      } else {
        selectAllMails.length = 0
      }
      state.selectedMails = selectAllMails
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMails.fulfilled, (state, action) => {
      state.mails = action.payload.emails
      state.filter = action.payload.filter
      state.mailMeta = action.payload.emailsMeta
    })
    builder.addCase(getCurrentMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
    builder.addCase(paginateMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
  }
})

export const { handleSelectMail, handleSelectAllMail } = appEmailSlice.actions

export default appEmailSlice.reducer
