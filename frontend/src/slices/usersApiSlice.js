import { apiSlice } from "./apiSlice.js";

const USERS_URL = '/api/users'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    login: builder.mutation({
      query: (data)=>({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data
      })
    }),
    register: builder.mutation({
      query: (data)=>({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data
      })
    }),
    logout: builder.mutation({
      query: ()=>({
        url: `${USERS_URL}/logout`,
        method: 'POST'
      })
    }),
    shortenUrl: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/shorten`,
        method: 'POST',
        body: data,
      }),
    }),
  })
})


export const { 
  useLoginMutation, 
  useLogoutMutation,
  useRegisterMutation, 
  useShortenUrlMutation
} = usersApiSlice