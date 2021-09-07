import React from 'react';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/bootstrap.css';
import 'rc-dialog/assets/index.css';

const GlobalModal = props => {
    const { children, width = 520, ...resProps } = props;

    return (
        <Dialog zIndex={999} width={width} {...resProps}>
            {children}
        </Dialog>
    );
};

export default GlobalModal;
