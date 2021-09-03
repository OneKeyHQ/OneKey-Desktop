import { useEffect } from "react"
import { useActions } from '@suite-hooks';
import * as accountSearchActions from '@wallet-actions/accountSearchActions'
import Transactions from '@wallet-views/transactions/Container';


export default function() {
    const { cleanNewAccounts } = useActions({ cleanNewAccounts: accountSearchActions.cleanNewAccounts })
    useEffect(() => {
        return () => {
            cleanNewAccounts()
        }
    }, [])
    return <Transactions></Transactions>
};
