import React, { useState, useMemo } from 'react';
import { ConnectionModalContext } from './context';
import ConnectionModal from './Modal';

export const Provider = ({ children }) => {
    const [visible, setVisible] = useState(false);

    const connectionProps = useMemo(() => {
        return {
            visible,
            setVisible,
            handleClose: () => setVisible(false),
            handleOpen: () => setVisible(true),
        };
    }, [visible, setVisible]);

    return (
        <ConnectionModalContext.Provider value={connectionProps}>
            <ConnectionModal />
            {children}
        </ConnectionModalContext.Provider>
    );
};

export default Provider;
