import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const familyApi = createApi({
    reducerPath: 'familyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/families`,
        credentials: 'include',
    }),
    tagTypes: ['Family'],
    endpoints: (builder) => ({
        getFamilyById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['Family'],
        }),
        addRoot: builder.mutation({
            query: ({ familyId, memberId }) => ({
                url: `/${ familyId }/root/${ memberId }`,
                method: 'PUT',
            }),
            invalidatesTags: ['Family'],
        }),
    }),
    refetchOnMountOrArgChange: true,
});

export const {
    useGetFamilyByIdQuery,
    useAddRootMutation,
} = familyApi;