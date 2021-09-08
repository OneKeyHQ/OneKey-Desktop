import { Ether, Token } from '@uniswap/sdk-core';
import PriceHistoryChart, { Field } from '../components/PriceHistoryChart';

export const Home = (): JSX.Element => {
    const currencies = {
        [Field.INPUT]: new Token(1, '0xdac17f958d2ee523a2206206994597c13d831ec7', 18, 'usdt'),
        [Field.OUTPUT]: Ether,
    };

    return (
        <div>
            <div className="h-full w-full flex flex-col lg:flex-row">
                <div className="flex flex-col w-full pt-4 items-center flex-1 z-1 sm:p-4 sm:pt-8">
                    <PriceHistoryChart currencies={currencies} />
                </div>
            </div>
        </div>
    );
};

export default Home;
