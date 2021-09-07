/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from 'react';
import Avatar from '@components/Avatar';
import { useActiveWeb3React } from '@components/Connection/hooks/connect';
import { Menu, Transition } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const Account = () => {
    const { account } = useActiveWeb3React();
    if (!account) return '';

    return (
        <>
            <Avatar rounded address={account} size={20} />
            <div className="ml-2">
                {account.slice(0, 6)}...{account.slice(-4)}
            </div>
        </>
    );
};

const Header = () => {
    const { account } = useActiveWeb3React();

    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6 w-full">
            <div className="flex items-center flex-shrink-0 mr-6">
                <span className="font-semibold text-xl tracking-tight">Portfolio</span>
            </div>
            <div className="w-full block lg:flex lg:items-center lg:w-auto">
                <Menu as="div" className="relative inline-block text-left">
                    {({ open }) => (
                        <>
                            <div>
                                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ">
                                    {account ? (
                                        <Account />
                                    ) : (
                                        // TODO:
                                        '选择账户'
                                    )}
                                </Menu.Button>
                            </div>

                            <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items
                                    static
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                                >
                                    <div className="px-4 py-3">
                                        <p className="text-sm">Watched Address</p>
                                        {/* <p className="text-sm font-medium text-gray-900 truncate">tom@example.com</p> */}
                                    </div>
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active
                                                            ? 'bg-gray-100 text-gray-900'
                                                            : 'text-gray-700',
                                                        'block px-4 py-2 text-sm',
                                                    )}
                                                >
                                                    <Account />
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="py-1">
                                        <form method="POST" action="#">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        type="submit"
                                                        className={classNames(
                                                            active
                                                                ? 'bg-gray-100 text-gray-900'
                                                                : 'text-gray-700',
                                                            'block w-full text-left px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        Manage Address
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </form>
                                    </div>
                                    <div className="py-1">
                                        <form method="POST" action="#">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        type="submit"
                                                        className={classNames(
                                                            active
                                                                ? 'bg-gray-100 text-gray-900'
                                                                : 'text-gray-700',
                                                            'block w-full text-left px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        Exit
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </form>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            </div>
        </nav>
    );
};

export default Header;
