import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const workspaceApi = createApi({
    reducerPath: 'workspaceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/workspaces/`,
        credentials: 'include',
    }),
    tagTypes: ['Workspace', 'Family', 'Member'],
    endpoints: (builder) => ({
        getWorkspaces: builder.query({
            query: () => ``,
            providesTags: ['Workspace', 'Family'],
        }),
        createWorkspace: builder.mutation({
            query: (workspace) => ({
                url: ``,
                method: 'POST',
                body: workspace,
            }),
            invalidatesTags: ['Workspace'],
        }),
        updateWorkspace: builder.mutation({
            query: ({ id, updates }) => ({
                url: id,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Workspace'],
        }),
        deleteWorkspace: builder.mutation({
            query: (id) => ({
                url: id,
                method: 'DELETE',
            }),
            invalidatesTags: ['Workspace'],
        }),

        getWorkspaceByFamilyId: builder.query({
            query: (id) => `?family=${id}`,
            providesTags: ['Family'],
        }),
        createFamily: builder.mutation({
            query: ({ workspaceId, family }) => ({
                url: `${ workspaceId }/family`,
                method: 'POST',
                body: family,
            }),
            invalidatesTags: ['Family'],
        }),
        updateFamily: builder.mutation({
            query: ({ id, updates }) => ({
                url: `/family/${ id }`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Family'],
        }),
        deleteFamily: builder.mutation({
            query: (id) => ({
                url: `/family/${ id }`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Family'],
        }),

        createMember: builder.mutation({
            query: ({ workspaceId, member }) => ({
                url: `${ workspaceId }/members`,
                method: 'POST',
                body: member,
            }),
            invalidatesTags: ['Member'],
        }),
        getMembersByWorkspaceId: builder.query({
            query: ({ workspaceId, filters }) => ({
                url: `${ workspaceId }/members`,
                params: filters,
            }),
            providesTags: ['Member'],
        }),
    }),
    refetchOnMountOrArgChange: true,
});

export const {
    useGetWorkspacesQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation,

    useGetWorkspaceByFamilyIdQuery,
    useCreateFamilyMutation,
    useUpdateFamilyMutation,
    useDeleteFamilyMutation,

    useCreateMemberMutation,
    useGetMembersByWorkspaceIdQuery,
} = workspaceApi;