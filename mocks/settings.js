/**
 * @typedef {Object} TreeProps
 * @property {'horizontal' | 'vertical'} orientation Orientation of the tree
 * @property {boolean} collapsible Whether the tree can be collapsed
 * @property {boolean} draggable Whether the tree can be dragged
 * @property {boolean} zoomable Whether the tree can be zoomed
 */

/**
 * @typedef {Object} Settings
 * @property {number} avatarSize Size of avatar
 * @property {TreeProps} treeProps react-d3-tree props
 */

/** @type {Settings} */
const settings = {
    avatarSize: 50,
    treeProps: {
        orientation: 'vertical',
        collapsible: false,
        draggable: true,
        zoomable: true,
    }
};

export default settings;