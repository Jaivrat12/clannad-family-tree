export const getFamilyTree = (data) => {

    const isRoot = (member) => member._id === data.root._id;
    const getMember = (id) => data.members[id];
    const getNuclearFamily = (id) => data.nuclearFamilies[id];

    const helper = (id, parentId) => {

        if (!id) {
            return {};
        }

        const nuclearFamily = getNuclearFamily(id);
        const male = getMember(nuclearFamily.male);
        const female = getMember(nuclearFamily.female);

        let member = null;
        if (male && isRoot(male)) {
            member = male;
        } else if (female && isRoot(female)) {
            member = female;
        }

        if (member === null) {
            member = male?.parent === parentId ? male : female;
        }

        const tree = {
            _id: member._id,
            children: nuclearFamily.children.map((childId) =>
                helper(childId, nuclearFamily._id)
            ),
        };
        return tree;
    };

    const _getFamilyTree = (root) => {
        return helper(root?.nuclearFamily, null);
    };

    return _getFamilyTree;
};

export const getTreeMember = (state) => {

    const { data, tree } = state;

    const getPathFromRoot = (id) => {

        if (data.parents[id]) {
            return [id];
        }
        return [ ...getPathFromRoot(data.parents[id]), id ];
    };

    const _getTreeMember = (id) => {

        const path = getPathFromRoot(id);
        let member = tree;
        for (let i = 1; i < path.length; i++) {

            // TODO: Binary search
            member = member.children.find((child) =>
                child._id === path[i]
            );
        }
        return member;
    };
    return _getTreeMember;
}

export const denormalize = (object) => {
    return Object.keys(object).map(id => object[id]);
}