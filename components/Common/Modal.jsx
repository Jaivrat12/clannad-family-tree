import { Dialog } from 'primereact/dialog';

const Modal = ({
    isOpen,
    onClose,
    header,
    children,
}) => {

    return (

        <Dialog
            header={ header }
            visible={ isOpen }
            onHide={ onClose }
            style={{ width: '500px' }}
        >
            <div style={{ paddingTop: '0.2rem' }}>
                { children }
            </div>
        </Dialog>
    );
};

export default Modal;