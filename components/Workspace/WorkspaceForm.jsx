import { useForm } from 'react-hook-form';
import zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const workspaceSchema = zod.object({
    name: zod.string().nonempty({
        message: 'Name is required'
    }),
    description: zod.string().optional(),
});

const WorkspaceForm = ({ mode, data, onSubmit }) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(workspaceSchema),
        defaultValues: data,
    });

    return (

        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form
            onSubmit={ handleSubmit(onSubmit) }
            className="flex flex-column gap-3"
        >
            <div className="flex flex-column gap-1">
                <InputText
                    placeholder="Name"
                    autoFocus
                    { ...register('name') }
                />
                { errors.name && <small style={{ color: 'crimson' }}>{ errors.name.message }</small> }
            </div>

            <InputTextarea
                placeholder="Description"
                rows={5}
                {...register('description')}
            />

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

export default WorkspaceForm;