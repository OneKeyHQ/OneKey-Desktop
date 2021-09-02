import React from 'react';
import { Translation } from '@suite-components';
import { AccountExceptionLayout } from '@wallet-components';

/**
 * Handler for invalid router params
 * see: @wallet-actions/selectedAccountActions
 */
const AccountNotExists = () => {
    return (
        <AccountExceptionLayout
            title={<Translation id="TR_ACCOUNT_EXCEPTION_NOT_EXIST" />}
            image="wallet-empty-neue"
        />
    );
};

export default AccountNotExists;
