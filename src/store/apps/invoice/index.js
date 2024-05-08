import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Fetch Invoices
export const fetchData = createAsyncThunk('appInvoice/fetchData', async params => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  try {
    const response = await axios.get('https://api.knori.or.kr/invoice/invoicelist', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      },
      params: params
    })
    console.log(response)

    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error // 또는 적절한 오류 처리
  }
})

// http://localhost:4001/invoice/invoicelist

export const deleteInvoice = createAsyncThunk('appInvoice/deleteData', async (id, { getState, dispatch }) => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  const response = await axios.delete(`https://api.knori.or.kr/invoice/${id}`, {
    headers: {
      Authorization: `Bearer ${storedToken}`
    }
  })
  await dispatch(fetchData(getState().invoice.params))

  return response.data
})

export const appInvoiceSlice = createSlice({
  name: 'appInvoice',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.invoices
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appInvoiceSlice.reducer
