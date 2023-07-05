import { v4 as uuid } from 'uuid';

const getFamilyData = async () => {

	const url = 'http://localhost:8000/api/families/63fc6a004e62e8011d31be7f';
	const familyData = (await (await fetch(url)).json()).data;
	// console.log(familyData);

	const getMember = (id) => familyData.members[id];

	// Get Nuclear Family of a member by memberId
	const getNuclearFamily = (memberId) => familyData.nuclearFamilies[
		familyData.members[memberId]?.nuclearFamily
	];

	// Get Spouse of a member
	const getSpouse = (memberId) => {
		const spouseGender = familyData.members[memberId].gender === 'male' ? 'female' : 'male';
		return familyData.members[getNuclearFamily(memberId)?.[spouseGender]];
	};

	const getChildren = (memberId) => {
		const nuclearFamily = getNuclearFamily(memberId);
		return nuclearFamily?.children.map((childId) =>
			familyData.members[childId]
		) ?? [];
	};

	// const members = familyData.members;
	// for (const id in members) {

		// const nuclearFamilies = familyData.nuclearFamilies;

		// members[id].getNuclearFamily = () => {
		// 	return nuclearFamilies[members[id].nuclearFamily];
		// }

		// members[id].getSpouse = () => {
		// 	const spouseGender = members[id].gender === 'male' ? 'female' : 'male';
		// 	return members[getNuclearFamilyByMemberId()?.[spouseGender]];
		// }
	// }
	// familyData.members = members;

	// Generating Family Tree (only once)
	/**
	 * @param {string | null} id
	 * @param {number | null} parentId
	*/
	const getFamilyTree = (id) => {

		if (id === null) {
			return null;
		}

		const member = getMember(id);
		const nuclearFamily = getNuclearFamily(id);
		const tree = {
			_id: member._id,
			children: nuclearFamily?.children.map(getFamilyTree),
		};
		return tree;
	};

	// ? Archive as a familyTree
	// TODO: Archive after removeChild()
	// TODO: switchFamilyPov = (id) => {};

	return {
		tree: getFamilyTree(familyData.root),
		data: familyData,
		getMember,
		getNuclearFamily,
		getSpouse,
		getChildren,
		getPathFromRoot: function (id) {

			if (!this.data.parents[id]) {
				return [id];
			}
			return [ ...this.getPathFromRoot(familyData.parents[id]), id ];
		},
		getTreeMember: function (id) {

			const path = this.getPathFromRoot(id);
			let member = this.tree;
			for (let i = 1; i < path.length; i++) {

				// TODO: Binary search
				member = member.children.find((child) =>
					child._id === path[i]
				);
			}
			return member;
		},
		createNuclearFamily: function (id) {

			const member = this.getMember(id);
			const nuclearFamilyId = uuid();
			const nuclearFamily = {
				_id: nuclearFamilyId,
				[member.gender]: member._id,
				children: [],
			};
			this.data.nuclearFamilies[nuclearFamilyId] = nuclearFamily;
			member.nuclearFamily = nuclearFamilyId;
			return nuclearFamily;
		},
		updateDetails: function (id, newDetails) {
			this.data.members[id] = {
				...this.data.members[id],
				...newDetails,
			};
		},
		addSpouse: function (id, spouseId) {

			const member = this.getMember(id);
			const spouse = this.getMember(spouseId);
			if (
				member.family === spouse.family
				|| member.gender === spouse.gender
				|| this.getSpouse(id)
				|| this.getSpouse(spouseId)
			) {
				return false;
			}

			// ? What if we can reuse spouse.nuclearFamily?
			const nuclearFamily = this.getNuclearFamily(id)
				?? this.createNuclearFamily(id);
			nuclearFamily[spouse.gender] = spouseId;
			spouse.nuclearFamily = nuclearFamily._id;
			return true;
		},
		removeSpouse: function (id) {
			const spouse = this.getSpouse(id);
			this.getNuclearFamily(id)[spouse.gender] = null;
			spouse.nuclearFamily = null;
		},
		addChild: function (id, childId) {

			let nuclearFamily = this.getNuclearFamily(id);
			const parents = this.data.parents;
			if (
				parents[childId] === this.data.root
				|| parents[childId]
				|| nuclearFamily?.children.includes(childId)
			) {
				return false;
			}

			if (!nuclearFamily) {
				nuclearFamily = this.createNuclearFamily(id);
			}
			nuclearFamily.children.push(childId);
			parents[childId] = id;

			const treeMember = this.getTreeMember(id);
			treeMember.children = treeMember.children ?? [];
			treeMember.children.push(getFamilyTree(childId));
			return true;
		},
		removeChild: function (id, childId) {

			let nuclearFamily = this.getNuclearFamily(id);
			if (!nuclearFamily || !nuclearFamily.children.includes(childId)) {
				return false;
			}

			const parents = this.data.parents;
			nuclearFamily.children = nuclearFamily.children.filter(id => id !== childId);
			delete parents[childId];

			const treeMember = this.getTreeMember(id);
			treeMember.children = treeMember.children ?? [];
			treeMember.children = treeMember.children.filter((child) => child._id !== childId);
			return true;
		},
	};
};

export default getFamilyData;