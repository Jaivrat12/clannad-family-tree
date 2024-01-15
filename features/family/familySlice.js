import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getFamilyTree } from 'utils';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const axiosClient = axios.create({
    baseURL: `${BASE_URL}/members/`,
    withCredentials: true,
});

const initialState = {
    data: {},
    tree: {},
};

// TODO: update reducers => updateMembers(), updateFamilyTree(), etc.
export const familySlice = createSlice({
    name: 'family',
    initialState,
    reducers: {
        setFamilyData: (state, action) => {

            state.data = action.payload.data;
            if (state.data) {
                state.tree = getFamilyTree(state.data)(state.data?.root);
            }
        },
        updateMemberDetails: (state, action) => {
            const { id, member, nuclearFamily } = action.payload;
            state.data.members[id] = member;
            state.data.nuclearFamilies[nuclearFamily._id] = nuclearFamily;
        },
        addMemberSpouse: (state, action) => {

            const { members, nuclearFamilies } = action.payload;

            state.data.members = {
                ...state.data.members,
                ...members,
            };

            state.data.nuclearFamilies = {
                ...state.data.nuclearFamilies,
                ...nuclearFamilies,
            };

            // TODO: Optimize this
            state.tree = getFamilyTree(state.data)(state.data.root);
        },
        removeMemberSpouse: (state, action) => {

            const { spouse, nuclearFamilies } = action.payload;
            const { members } = state.data;

            state.data.nuclearFamilies = {
                ...state.data.nuclearFamilies,
                ...nuclearFamilies,
            };
            members[spouse._id] = spouse;

            // TODO: Optimize this
            state.tree = getFamilyTree(state.data)(state.data.root);
        },
        addMemberChildren: (state, action) => {

            const { members, nuclearFamilies, families } = action.payload;

            state.data.members = {
                ...state.data.members,
                ...members,
            };

            state.data.nuclearFamilies = {
                ...state.data.nuclearFamilies,
                ...nuclearFamilies,
            };

            if (families[state.data._id]) {
                state.data.root = families[state.data._id].root;
            }

            // parents[childId] = member._id;

            // TODO: Optimize this
            state.tree = getFamilyTree(state.data)(state.data.root);
        },
        removeMemberChildren: (state, action) => {

            const { childId, nuclearFamily } = action.payload;
            const { members, nuclearFamilies } = state.data;

            nuclearFamilies[nuclearFamily._id] = nuclearFamily;
            // ? deleting child is not good if it's a spouse in the family, maybe move it to workspace list
            // delete members[childId];

            // delete parents[childId];

            // TODO: Optimize this
            state.tree = getFamilyTree(state.data)(state.data.root);
        },
    },
});

// https://redux.js.org/usage/deriving-data-selectors
// https://react-redux.js.org/api/hooks#useselector-examples
// https://stackoverflow.com/questions/74491856/how-should-i-use-selectors-in-redux-toolkit
// https://stackoverflow.com/questions/57464286/how-to-correctly-use-a-curried-selector-function-with-react-reduxs-useselector
// https://react-redux.js.org/api/hooks#recipe-useshallowequalselector

/********************** SELECTORS **********************/
export const selectMember = (id) => (state) => {
    const { members } = state.family.data;
    return members?.[id];
};

export const selectFamilyMembers = () => (state) => {
    return state.family.data.members;
};

export const selectNuclearFamily = (memberId) => (state) => {
    const { nuclearFamilies } = state.family.data;
    const member = selectMember(memberId)(state);
    return nuclearFamilies[member?.nuclearFamily];
};

export const selectSpouse = (memberId) => (state) => {

    const member = selectMember(memberId)(state);
    const spouseGender = member.gender === 'male' ? 'female' : 'male';
    const nuclearFamily = selectNuclearFamily(memberId)(state);
    if (nuclearFamily) {
        const spouseId = nuclearFamily[spouseGender];
        return selectMember(spouseId)(state);
    }
};

export const selectChildren = (memberId) => (state) => {

    const nuclearFamily = selectNuclearFamily(memberId)(state);
    return nuclearFamily?.children.map((childId) => {

        const { nuclearFamilies } = state.family.data;
        const nf = nuclearFamilies[childId];
        const male = selectMember(nf.male)(state);
        const female = selectMember(nf.female)(state);
        const member = male?.parent === nuclearFamily._id
            ? male
            : female;
        return member;
    }) ?? [];
};

/********************** ACTIONS **********************/
export const updateMemberDetails = (id, updates, onSuccess, onError, onFinally) => async (dispatch) => {

    try {
        const { data } = await axiosClient.put(`${id}`, updates);
        if (data.success) {
            const payload = {
                id,
                member: data.member,
                nuclearFamily: data.nuclearFamily,
            };
            dispatch(familySlice.actions.updateMemberDetails(payload));
            onSuccess(data);
        } else {
            onError(data.error);
        }
    } catch (error) {
        onError(error?.response?.data?.error ?? error.message);
    } finally {
        onFinally();
    }
};

export const addMemberSpouse = (memberId, spouseId, onSuccess, onError, onFinally) => async (dispatch) => {

    try {

        const { data } = await axiosClient.put(`${memberId}/spouse/${spouseId}`);
        if (data.success) {

            const payload = {
                members: data.members,
                nuclearFamilies: data.nuclearFamilies,
            };
            dispatch(familySlice.actions.addMemberSpouse(payload));
            onSuccess(data);
        } else {
            onError(data.error);
        }
    } catch (error) {
        onError(error?.response?.data?.error ?? error.message);
    } finally {
        onFinally();
    }
};

export const removeMemberSpouse = (memberId, onSuccess, onError, onFinally) => async (dispatch) => {

    try {
        const { data } = await axiosClient.delete(`${memberId}/spouse`);
        if (data.success) {

            const payload = {
                spouse: data.spouse,
                nuclearFamilies: data.nuclearFamilies,
            };
            dispatch(familySlice.actions.removeMemberSpouse(payload));
            onSuccess(data);
        } else {
            onError(data.error);
        }
    } catch (error) {
        onError(error?.response?.data?.error ?? error.message);
    } finally {
        onFinally();
    }
};

export const addMemberChild = (memberId, childId, onSuccess, onError, onFinally) => async (dispatch) => {

    try {
        const { data } = await axiosClient.put(`${memberId}/children/${childId}`);
        if (data.success) {

            const payload = {
                members: data.members,
                nuclearFamilies: data.nuclearFamilies,
                families: data.families,
            };
            dispatch(familySlice.actions.addMemberChildren(payload));
            onSuccess(data);
        } else {
            onError(data.error);
        }
    } catch (error) {
        onError(error?.response?.data?.error ?? error.message);
    } finally {
        onFinally();
    }
};

export const removeMemberChild = (childId, onSuccess, onError, onFinally) => async (dispatch) => {

    try {
        const { data } = await axiosClient.delete(`children/${childId}`);
        if (data.success) {

            const payload = {
                childId,
                nuclearFamily: data.nuclearFamily,
            };
            dispatch(familySlice.actions.removeMemberChildren(payload));
            onSuccess(data);
        } else {
            onError(data.error);
        }
    } catch (error) {
        onError(error?.response?.data?.error ?? error.message);
    } finally {
        onFinally();
    }
};

export const {
    setFamilyData,
} = familySlice.actions;

export default familySlice.reducer;