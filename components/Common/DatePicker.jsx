import { forwardRef } from 'react';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import dayjs from 'dayjs';

const DatePicker = forwardRef(function DatePicker({
    label,
    value,
    onChange,
    error,
    ...props
}, ref) {

    const formattedDate = value
        ? dayjs(value).format('MMM D, YYYY')
        : 'No Date Selected';

    return (

        <FormControl error={!!error}>
            <FormLabel>
                {label} ({formattedDate})
            </FormLabel>

            <Input
                ref={ref}
                type="date"
                value={value?.toISOString()?.split('T')?.[0] ?? ''}
                onChange={(e) => onChange(e.target.valueAsDate)}
                {...props}
            />

            <FormHelperText>
                {error}
            </FormHelperText>
        </FormControl>
    );
})

export default DatePicker;