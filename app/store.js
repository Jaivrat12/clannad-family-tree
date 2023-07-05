import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import familyReducer from 'features/family/familySlice';
import { familyApi } from 'services/family';
import { workspaceApi } from 'services/workspace';

export const store = configureStore({
    reducer: {
        family: familyReducer,
        [familyApi.reducerPath]: familyApi.reducer,
        [workspaceApi.reducerPath]: workspaceApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(familyApi.middleware)
            .concat(workspaceApi.middleware),
});

setupListeners(store.dispatch);