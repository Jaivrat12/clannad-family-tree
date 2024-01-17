import { useEffect, useRef, useState } from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Arrow = ({ position, onClick }) => (

    <Box
        sx={(theme) => ({
            position: 'absolute',
            top: 0,
            [position]: 0,
            bottom: 0,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            background: theme.vars.palette.background.surface,
        })}
    >
        <Box
            sx={(theme) => ({
                position: 'relative',
                [position === 'left' ? ':after' : ':before']: {
                    content: '""',
                    position: 'absolute',
                    display: 'inline-block',
                    height: '100%',
                    width: '50%',
                    [position]: '100%',
                    background: `
                        linear-gradient(
                            to ${position === 'left' ? 'right' : 'left'},
                            ${theme.vars.palette.background.surface} 20%,
                            #0000 80%
                        )
                    `,
                }
            })}
        >
            <IconButton
                variant="soft"
                size="sm"
                onClick={onClick}
                sx={{ borderRadius: '50%' }}
            >
                {position === 'left' ? (
                    <NavigateBeforeIcon />
                ) : (
                    <NavigateNextIcon />
                )}
            </IconButton>
        </Box>
    </Box>
);

const HorizontalScrollbar = ({ children }) => {

    const scrollBoxRef = useRef(null);
    const [scrollArrowsVisible, setScrollArrowsVisible] = useState({
        left: false,
        right: false,
    });

    const scrollTo = (direction) => {
        const { scrollLeft, clientWidth } = scrollBoxRef.current;
        const multiplier = direction === 'left' ? -1 : 1;
        const x = scrollLeft + (clientWidth / 2 * multiplier);
        scrollBoxRef.current.scrollTo(x, 0);
    };

    useEffect(() => {

        const scrollBox = scrollBoxRef.current;
        const udpateArrows = () => {

            let { clientWidth, scrollWidth, scrollLeft } = scrollBox;
            scrollLeft = Math.ceil(scrollLeft);

            setScrollArrowsVisible({
                left: scrollLeft > 0,
                right: scrollLeft + clientWidth < scrollWidth,
            });
        };

        udpateArrows();
        scrollBox.addEventListener('scroll', udpateArrows);

        return () => scrollBox.removeEventListener('scroll', udpateArrows);
    }, []);

    return (

        <Box sx={{ position: 'relative' }}>
            {scrollArrowsVisible.left && (
                <Arrow
                    position="left"
                    onClick={() => scrollTo('left')}
                />
            )}

            {scrollArrowsVisible.right && (
                <Arrow
                    position="right"
                    onClick={() => scrollTo('right')}
                />
            )}

            <Box
                ref={scrollBoxRef}
                sx={{
                    overflowX: 'scroll',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '::-webkit-scrollbar': {
                        width: 0,
                        height: 0,
                    }
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default HorizontalScrollbar;