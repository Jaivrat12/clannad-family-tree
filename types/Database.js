/**
 * Data at Backend
 * @typedef {Object} Database
 * @property {Family[]} families
 * @property {Member[]} members
 * @property {NuclearFamily[]} nuclearFamilies
 * @property {getData} getData
 * @property {getFamily} getFamily
 * @property {getMember} getMember
 * @property {getNuclearFamily} getNuclearFamily
 * @property {getFamilyData} getFamilyData
 */

/**
 * @typedef {Object} Family
 * @property {String} _id
 * @property {String} root
 */

/**
 * @typedef {Object} Member
 * @property {String} _id
 * @property {String} name
 * @property {String} image
 * @property {String} gender
 * @property {Date} dob
 * @property {Date} dod
 * @property {String} familyId
 * @property {String} nuclearFamilyId
 */

/**
 * @typedef {Object} NuclearFamily
 * @property {String} _id
 * @property {String} male
 * @property {String} female
 * @property {String[]} children
 */

/**
 * @callback getData
 * @param {'families'|'members'|'nuclearFamilies'} collection
 * @param {String} id
 * @returns {Family|Member|NuclearFamily}
 */

/**
 * @callback getFamily
 * @param {String} id
 * @returns {Family}
 */

/**
 * @callback getMember
 * @param {String} id
 * @returns {Member}
 */

/**
 * @callback getNuclearFamily
 * @param {String} id
 * @returns {NuclearFamily}
 */

/**
 * @callback getFamilyData
 * @param {String} id
 * @returns {Object}
 */