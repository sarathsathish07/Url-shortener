import { apiSlice } from "./apiSlice.js";


export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder)=>({
    login: builder.mutation({
      query: (data)=>({
        url: `/auth`,
        method: 'POST',
        body: data
      })
    }),
    register: builder.mutation({
      query: (data)=>({
        url: `/`,
        method: 'POST',
        body: data
      })
    }),
    logout: builder.mutation({
      query: ()=>({
        url: `/logout`,
        method: 'POST'
      })
    }),
    shortenUrl: builder.mutation({
      query: (data) => ({
        url: `/shorten`,
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