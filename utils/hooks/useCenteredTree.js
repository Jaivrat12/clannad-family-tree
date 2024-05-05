import { useCallback, useState } from 'react';

const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {

	const [translate, setTranslate] = useState(defaultTranslate);
	const [dimensions, setDimensions] = useState();
	const containerRef = useCallback((containerElem) => {

		if (containerElem !== null) {

			const { width, height } = containerElem.getBoundingClientRect();
			// console.log({ width, height });
			setDimensions({ width, height });
			// setTranslate({ x: width / 2, y: height / 2 });
			// setTranslate({ x: 100, y: height / 2 });
			setTranslate({ x: width / 2, y: 100 });
		}
	}, []);
	return [dimensions, translate, containerRef];
};

export default useCenteredTree;