export const MAIN_MENU_ITEMS = [
    {
        translationId: 'TR_DASHBOARD',
        icon: 'HOME',
        route: 'suite-index',
        isDisabled: false,
        isBeta: false,
    },
    {
        translationId: 'TR_WALLET',
        icon: 'ACCOUNT',
        route: 'wallet-index',
        isDisabled: false,
        isBeta: false,
    },
    {
        translationId: 'TR_SWAP',
        icon: 'SWAP',
        route: 'swap-index',
        isDisabled: false,
        isBeta: false,
    },
    {
        translationId: 'TR_DAPP_EXPLORE',
        icon: 'EXPLORE',
        route: 'dapp-explore-index',
        isDisabled: false,
        isBeta: true,
    },
] as const;
