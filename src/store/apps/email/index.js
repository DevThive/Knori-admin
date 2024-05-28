// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

import authConfig from 'src/configs/auth'
import MailDetails from 'src/views/apps/email/MailDetails'

async function getGoogleApiToken() {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  try {
    const response = await axios.get('http://localhost:4001/gmail/token', {
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

export const fetchMails = createAsyncThunk('appEmail/fetchMails', async params => {
  try {
    const googleApi = await getGoogleApiToken()

    console.log(googleApi)

    let searchQuery = params.q || ''
    if (params.folder) {
      searchQuery += ` in:${params.folder}`
    }
    if (params.label) {
      searchQuery += ` label:${params.label}`
    }

    const mailListResponse = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages?q=${encodeURIComponent(
        searchQuery
      )}&maxResults=200`,
      {
        headers: {
          Authorization: `Bearer ${googleApi.accessToken}`
        }
      }
    )

    const mailsDetailsPromises = mailListResponse.data.messages.map(async message => {
      try {
        const messageDetailsResponse = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${googleApi.accessToken}`
            }
          }
        )

        // console.log(messageDetailsResponse.data)

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

        return {
          id: message.id,
          from,
          to,
          subject,
          cc: [],
          bcc: [],
          message: '<p>This is a placeholder for the actual message content.</p>',
          attachments: [],
          isStarred: false,
          labels: messageDetailsResponse.data.labelIds,
          time,
          replies: [],
          folder: 'inbox',
          isRead: false
        }
      } catch (error) {
        return rejectWithValue('Error fetching message details')
      }
    })

    const mailsDetails = await Promise.all(mailsDetailsPromises)

    // console.log(mailsDetails)

    return { emails: mailsDetails, filter: params }
  } catch (error) {
    return rejectWithValue('Error fetching mails')
  }
})

// ** Get Current Mail
export const getCurrentMail = createAsyncThunk('appEmail/selectMail', async id => {
  try {
    const googleApi = await getGoogleApiToken() // Google API 토큰을 가져옵니다.
    // console.log(id)

    // googleApi 객체에서 바로 email과 accessToken을 사용합니다.
    const messageDetailsResponse = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages/${id}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${googleApi.accessToken}`
        }
      }
    )

    const messageDetailsResponseRaw = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${googleApi.email}/messages/${id}?format=raw`,
      {
        headers: {
          Authorization: `Bearer ${googleApi.accessToken}`
        }
      }
    )

    // console.log(messageDetailsResponse.data)

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
      labels: messageDetailsResponse.data.labelIds,
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
  const response = await axios.post('/apps/email/update-emails', {
    data: { emailIds: params.emailIds, dataToUpdate: params.dataToUpdate }
  })
  await dispatch(fetchMails(getState().email.filter))
  if (Array.isArray(params.emailIds)) {
    await dispatch(getCurrentMail(params.emailIds[0]))
  }

  return response.data
})

// ** Update Mail Label
export const updateMailLabel = createAsyncThunk('appEmail/updateMailLabel', async (params, { dispatch, getState }) => {
  const response = await axios.post('/apps/email/update-emails-label', {
    data: { emailIds: params.emailIds, label: params.label }
  })
  await dispatch(fetchMails(getState().email.filter))
  if (Array.isArray(params.emailIds)) {
    await dispatch(getCurrentMail(params.emailIds[0]))
  }

  return response.data
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
