import { v4 as uuid } from 'uuid';

/** @type {Database} */
const db = {
	families: [
		{
			_id: '0',
			root: '0',
		},
		{
			_id: '1',
			root: '5',
		},
		{
			_id: '2',
			root: '6',
		},
	],
	members: [
		{
			_id: '0',
			name: 'Shino Okazaki',
			image: '/members/images/shino-okazaki.webp',
			gender: 'female',
			dob: new Date('26 Mar 1938'),
			dod: null,
			familyId: '0',
			nuclearFamilyId: '0',
		},
		{
			_id: '1',
			name: 'Naoyuki Okazaki',
			image: '/members/images/naoyuki-okazaki.webp',
			gender: 'male',
			dob: new Date('13 Jun 1959'),
			dod: null,
			familyId: '0',
			nuclearFamilyId: '1',
		},
		{
			_id: '2',
			name: 'Yui Okazaki',
			image: '/members/images/default-female.jpg',
			gender: 'female',
			dob: new Date('9 Oct 1963'),
			dod: new Date('15 Nov 1963'),
			familyId: '0',
			nuclearFamilyId: null,
		},
		{
			_id: '3',
			name: 'Tomoya Okazaki',
			image: '/members/images/tomoya-okazaki.webp',
			gender: 'male',
			dob: new Date('30 Oct 1985'),
			dod: null,
			familyId: '0',
			nuclearFamilyId: '2',
		},
		{
			_id: '4',
			name: 'Ushio Okazaki',
			image: '/members/images/ushio-okazaki.webp',
			gender: 'female',
			dob: new Date('26 Feb 2006'),
			dod: null,
			familyId: '0',
			nuclearFamilyId: null,
		},
		{
			_id: '5',
			name: 'Atsuko Okazaki',
			image: '/members/images/atsuko-okazaki.webp',
			gender: 'female',
			dob: new Date('21 Aug 1962'),
			dod: new Date('14 Mar 1988'),
			familyId: '1',
			nuclearFamilyId: '1',
		},
		{
			_id: '6',
			name: 'Nagisa Okazaki',
			image: '/members/images/nagisa-okazaki.webp',
			gender: 'female',
			dob: new Date('24 Dec 1984'),
			dod: null,
			familyId: '2',
			nuclearFamilyId: '2',
		},
	],
	nuclearFamilies: [
		{
			_id: '0',
			male: null,
			female: '0',
			children: ['1', '2'],
		},
		{
			_id: '1',
			male: '1',
			female: '5',
			children: ['3'],
		},
		{
			_id: '2',
			male: '3',
			female: '6',
			children: ['4'],
		},
	],
	getData: function (collection, id) {
		return this[collection].find(item => id === item._id);
	},
	getFamily: function (id) {
		return this.getData('families', id);
	},
	getMember: function (id) {
		return this.getData('members', id);
	},
	getNuclearFamily: function (id) {
		return this.getData('nuclearFamilies', id);
	},
	getFamilyData: function (id) {

		const family = this.getFamily(id);
		const members = {};
		const nuclearFamilies = {};
		const parents = { [family.root]: null };

		const ids = [family.root];
		while (ids.length) {

			const id = ids.shift();
			const member = this.getMember(id);
			members[member._id] = member;

			const nuclearFamilyId = member.nuclearFamilyId;
			if (nuclearFamilyId) {

				const nuclearFamily = this.getNuclearFamily(nuclearFamilyId);
				if (!nuclearFamilies[nuclearFamilyId]) {
					nuclearFamilies[nuclearFamilyId] = nuclearFamily;
				}

				const spouseGender = member.gender === 'male' ? 'female' : 'male';
				if (nuclearFamily[spouseGender]) {
                    const member = this.getMember(nuclearFamily[spouseGender]);
                    members[member._id] = member;
				}

				nuclearFamily.children.forEach(childId => {
					parents[childId] = id;
					ids.push(childId);
				});
			}
		}

		const getNewId = () => uuid();

		nuclearFamilies.static = {
			create: (male = null, female = null, children = []) => {

				const _id = getNewId();
				const newNuclearFamily = {
					_id,
					male,
					female,
					children,
				};
				nuclearFamilies[_id] = newNuclearFamily;
				return newNuclearFamily;
			},
		};

		members.static = {
			create: (details) => {

				const _id = getNewId();
				const newMember = {
					_id,
					name: '',
					image: '',
					gender: '',
					dob: null,
					dod: null,
					familyId: family._id,
					nuclearFamilyId: null,
				};
				const member = members[_id] = {
					...newMember,
					...details,
				};
				members.static.addMethods(member);
				return member;
			},
			addMethods: (member) => {

				member.getNuclearFamily = () => nuclearFamilies[member.nuclearFamilyId];

				member.createNuclearFamily = () => {

					const nuclearFamily = nuclearFamilies.static.create();
					nuclearFamily[member.gender] = member._id;
					member.nuclearFamilyId = nuclearFamily._id;
					return nuclearFamily;
				};

				member.getSpouse = () => {

					const nuclearFamily = member.getNuclearFamily();
					const spouseGender = member.gender === 'male' ? 'female' : 'male';
					const spouseId = nuclearFamily?.[spouseGender];
					return members[spouseId];
				};

				member.addSpouse = (id) => {

					const spouse = members[id];
					if (member.getSpouse() || spouse.getSpouse()) {
						return false;
					}

					const nuclearFamily = member.getNuclearFamily()
						?? member.createNuclearFamily();
					nuclearFamily[spouse.gender] = spouse._id;
					spouse.nuclearFamilyId = nuclearFamily._id;
					return true;
				};

				member.removeSpouse = () => {

					const spouse = member.getSpouse();
					if (!spouse) {
						return false;
					}

					const nuclearFamily = member.getNuclearFamily();
					nuclearFamily[spouse.gender] = null;
					spouse.nuclearFamilyId = null;
					return true;
				};

				member.addChild = (childId) => {

					let nuclearFamily = member.getNuclearFamily();
					if (
						parents[childId] === null || parents[childId]
						|| nuclearFamily?.children.includes(childId)
					) {
						return false;
					}

					if (!nuclearFamily) {
						nuclearFamily = member.createNuclearFamily();
					}

					nuclearFamily.children.push(childId);
					parents[childId] = member._id;
					return true;
				};

				member.removeChild = (childId) => {

					let nuclearFamily = member.getNuclearFamily();
					if (!nuclearFamily || !nuclearFamily.children.includes(childId)) {
						return false;
					}
					nuclearFamily.children = nuclearFamily.children.filter(id => id !== childId);
					delete parents[childId];
					return true;
				};
			}
		};

        for (const id in members) {

			if (id !== 'static') {
				const member = members[id];
				members.static.addMethods(member);
			}
        }

		return {
			...family,
			members,
			nuclearFamilies,
			parents,
		};
	},
};

export default db;