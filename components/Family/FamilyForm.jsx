import { useForm } from 'react-hook-form';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

const familySchema = zod.object({
    name: zod.string().nonempty({
        message: 'Family Name is required'
    }),
});

const FamilyForm = ({ mode, data, onSubmit, isLoading }) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(familySchema),
        defaultValues: data,
    });

    return (

        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={1}
        >
            <FormControl
                error={!!errors.name?.message}
                required
            >
                <FormLabel>Family Name</FormLabel>

                <Input {...register('name')} />

                <FormHelperText>
                    {errors.name?.message}
                </FormHelperText>
            </FormControl>

            <Box textAlign="center">
                <Button
                    type="submit"
                    size="lg"
                    loading={isLoading}
                    loadingPosition="start"
                >
                    {mode === 'create'
                        ? (isLoading ? 'Creating...' : 'Create')
                        : (isLoading ? 'Saving...' : 'Save')
                    }
                </Button>
            </Box>
        </Box>
    );
};

export default FamilyForm;