import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';

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

const MemberForm = ({ mode, data, onSubmit }) => {

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
    // console.log(dataImageLost);

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
            ? '/members/images/default-male.jpg'
            : '/members/images/default-female.jpg'
        setPreview(image);
    }, [watchGender, watchImage]);

    // console.log(watchImage);
    useEffect(() => {
        if (watchImage?.[0]) {
            setPreview(URL.createObjectURL(watchImage[0]));
            setDataImageLost(true);
        }
    }, [watchImage]);

    return (

        <form
            onSubmit={ handleSubmit(onSubmit) }
            className="flex flex-column gap-3"
        >
            <Avatar
                image={ preview }
                icon={ !preview && 'pi pi-user' }
                size="xlarge"
                shape="circle"
                style={{
                    margin: 'auto',
                    width: '6rem',
                    height: '6rem',
                    borderRadius: '50%',
                    // border: '2px solid black',
                    background: !preview && '#14B8A6',
                    color: '#fff',
                }}
            />

            <div className="flex flex-column align-items-center gap-1">
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    { ...register('image') }
                />

                <label htmlFor="image-upload">
                    <Button
                        type="button"
                        onClick={() => document.getElementById('image-upload').click() }
                    >
                        Upload Image
                    </Button>
                </label>

                {/* <Button
                    type="button"
                    onClick={() => data.image = null }
                >
                    Remove Image
                </Button> */}
            </div>

            <div className="flex flex-column gap-1">
                <label
                    htmlFor="name"
                    // className="flex justify-content-center"
                >
                    Name
                </label>

                <InputText
                    id="name"
                    placeholder="Full name"
                    { ...register('name') }
                />
                { errors.name && <small style={{ color: 'crimson' }}>{ errors.name.message }</small> }
            </div>

            <div className="flex flex-column gap-1">
                <Controller
                    name="gender"
                    control={ control }
                    render={({ field }) => (
                        <>
                            <label
                                htmlFor={ field.name }
                                // className="flex justify-content-center"
                            >
                                Gender
                            </label>

                            <SelectButton
                                id={ field.name }
                                options={[
                                    { name: 'Male', value: 'male' },
                                    { name: 'Female', value: 'female' },
                                ]}
                                optionLabel="name"
                                { ...field }
                                // className="flex justify-content-center"
                            />

                            { errors.gender && <small style={{ color: 'crimson' }}>{ errors.gender.message }</small> }
                        </>
                    )}
                />
            </div>

            <div className="flex flex-column gap-1">
                <Controller
                    name="dob"
                    control={ control }
                    render={({ field }) => (
                        <>
                            <label
                                htmlFor={ field.name }
                                // className="flex justify-content-center"
                            >
                                Date Of Birth
                            </label>

                            <Calendar
                                inputId={ field.name }
                                value={ field.value }
                                onChange={ field.onChange }
                                dateFormat="dd M yy"
                                placeholder="01 Jan 1970"
                                showIcon
                                // touchUI
                                baseZIndex={1300}
                                { ...field }
                            />

                            { errors.dob && <small style={{ color: 'crimson' }}>{ errors.dob.message }</small> }
                        </>
                    )}
                />
            </div>

            <div className="flex flex-column gap-1">
                <Controller
                    name="dod"
                    control={ control }
                    render={({ field }) => (
                        <>
                            <label
                                htmlFor={ field.name }
                                // className="flex justify-content-center"
                            >
                                Date Of Death
                            </label>

                            <Calendar
                                inputId={ field.name }
                                value={ field.value }
                                onChange={ field.onChange }
                                dateFormat="dd M yy"
                                placeholder="01 Jan 1970"
                                showIcon
                                // touchUI
                                baseZIndex={1300}
                                { ...field }
                            />

                            { errors.dod && <small style={{ color: 'crimson' }}>{ errors.dod.message }</small> }
                        </>
                    )}
                />
            </div>

            <div style={{ textAlign: 'center' }}>
                <Button
                    label={ mode === 'create' ? 'Create' : 'Save' }
                    type="submit"
                    // icon="pi pi-plus"
                />
            </div>
        </form>
    );
};

export default MemberForm;