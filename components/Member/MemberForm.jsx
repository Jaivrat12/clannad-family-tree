import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import { styled } from '@mui/joy/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ManIcon from '@mui/icons-material/Man';
import UploadIcon from '@mui/icons-material/Upload';
import WomanIcon from '@mui/icons-material/Woman';
import DatePicker from 'components/Common/DatePicker';

const memberSchema = zod.object({
    name: zod.string().nonempty({
        message: 'Name is required'
    }),
    gender: zod.nativeEnum(['male', 'female'], {
        required_error: 'Gender is required',
        invalid_type_error: 'Only \'Male\' and \'Female\' are allowed',
    }),
    dob: zod.date().optional().nullable(),
    dod: zod.date().optional().nullable(),
    image: zod.any(),
});

const genderColors = {
    male: '#0077ff',
    female: '#ff0088',
}

const genders = [
    {
        label: 'Male',
        value: 'male',
        icon: (
            <ManIcon
                fontSize="inherit"
                sx={{ color: genderColors.male }}
            />
        ),
    },
    {
        label: 'Female',
        value: 'female',
        icon: (
            <WomanIcon
                fontSize="inherit"
                sx={{ color: genderColors.female }}
            />
        ),
    },
];

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const MemberForm = ({ mode, data, onSubmit, isLoading }) => {

    const [preview, setPreview] = useState(data?.image ?? '');
    const [dataImageLost, setDataImageLost] = useState(false);

    // delete data.image;
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            ...data,
            image: null,
        },
    });

    const watchGender = watch('gender');
    const watchImage = watch('image');

    useEffect(() => {

        if (data?.image && preview && !dataImageLost) {
            return;
        }

        if (watchImage?.[0]) {
            return;
        }

        if (!watchGender) {
            setPreview('');
            return;
        }

        const image = watchGender === 'male'
            ? '/members/images/default-male.png'
            : '/members/images/default-female.png'
        setPreview(image);
    }, [data?.image, dataImageLost, preview, watchGender, watchImage]);

    useEffect(() => {
        if (watchImage?.[0]) {
            setPreview(URL.createObjectURL(watchImage[0]));
            setDataImageLost(true);
        }
    }, [watchImage]);

    return (

        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={1}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
            >
                <Avatar
                    src={preview}
                    sx={{
                        width: '8rem',
                        height: '8rem',
                    }}
                />

                <Box
                    display="flex"
                    gap={1}
                >
                    <Button
                        component="label"
                        variant="soft"
                        role={undefined}
                        tabIndex={-1}
                        startDecorator={
                            <UploadIcon />
                        }
                    >
                        Upload Image
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            {...register('image')}
                        />
                    </Button>

                    {/* {preview && (
                        <IconButton
                            variant="soft"
                            color="danger"
                            // onClick={() => data.image = null}
                        >
                            X
                        </IconButton>
                    )} */}
                </Box>
            </Box>

            <FormControl
                error={!!errors.name?.message}
                required
            >
                <FormLabel>Name</FormLabel>

                <Input {...register('name')} />

                <FormHelperText>
                    {errors.name?.message}
                </FormHelperText>
            </FormControl>

            <FormControl
                error={!!errors.gender?.message}
                required
            >
                <FormLabel>Gender</FormLabel>

                <Controller
                    name="gender"
                    defaultValue={null}
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            {...field}
                            overlay
                            sx={{
                                my: 0,
                                flexDirection: 'row',
                                gap: 2,
                                [`& .${radioClasses.checked}`]: {
                                    [`& .${radioClasses.action}`]: {
                                        inset: -1,
                                        border: '3px solid',
                                        borderColor: genderColors[watchGender],
                                    },
                                },
                                [`& .${radioClasses.radio}`]: {
                                    display: 'contents',
                                    '& > svg': {
                                        zIndex: 2,
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        color: genderColors[watchGender],
                                        bgcolor: 'background.surface',
                                        borderRadius: '50%',
                                    },
                                },
                            }}
                        >
                            {genders.map(({ label, value, icon }) => (
                                <Sheet
                                    key={value}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 'md',
                                        boxShadow: 'sm',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                        minWidth: 120,
                                        flexGrow: 1,
                                    }}
                                >
                                    <Radio
                                        id={value}
                                        value={value}
                                        checkedIcon={<CheckCircleRoundedIcon />}
                                    />

                                    <Box fontSize="3rem">
                                        {icon}
                                    </Box>

                                    <FormLabel
                                        htmlFor={value}
                                        sx={{ margin: 'auto' }}
                                    >
                                        {label}
                                    </FormLabel>
                                </Sheet>
                            ))}
                        </RadioGroup>
                    )}
                />

                <FormHelperText>
                    {errors.gender?.message}
                </FormHelperText>
            </FormControl>

            <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        label="Date Of Birth"
                        error={errors.dob?.message}
                    />
                )}
            />

            <Controller
                name="dod"
                control={control}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        label="Date Of Death"
                        error={errors.dod?.message}
                    />
                )}
            />

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

export default MemberForm;