import { useForm } from 'react-hook-form';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const familySchema = zod.object({
    name: zod.string().nonempty({
        message: 'Name is required'
    }),
});

const FamilyForm = ({ mode, data, onSubmit }) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(familySchema),
        defaultValues: data,
    });

    return (

        <form
            onSubmit={ handleSubmit(onSubmit) }
            className="flex flex-column gap-3"
        >
            <div className="flex flex-column gap-1">
                <InputText
                    placeholder="Name"
                    { ...register('name') }
                />
                { errors.name && <small style={{ color: 'crimson' }}>{ errors.name.message }</small> }
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

export default FamilyForm;