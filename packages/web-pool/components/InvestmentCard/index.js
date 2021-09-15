import React, { Fragment } from 'react';
import {
  TokenGroup,
  TokenGroupProps,
  Card,
  Dropdown,
} from "@onekeyhq/ui-components";

const InverstmentCard = (props) => {
  const {
    tokenGroup = TokenGroupProps,
    type,
    descriptions = [],
    primaryAction,
    secondaryAction,
    TertiaryAction,
    ...rest
  } = props;

  return (
    <>
      <Card {...rest}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TokenGroup size="lg" {...tokenGroup} />
          </div>
          <div className="flex items-center justify-center w-5 h-5">
            {type === "liquidity" && (
              <Dropdown
                sections={[
                  {
                    items: [
                      {
                        content: "Add Liquidity",
                        icon: "PlusSolid",
                        onAction: primaryAction,
                      },
                      {
                        content: "Remove Liquidity",
                        icon: "MinusSolid",
                        onAction: secondaryAction,
                      },
                    ],
                  },
                  {
                    items: [
                      {
                        content: "Filter in Farm",
                        icon: "ExternalLinkSolid",
                        onAction: TertiaryAction,
                      },
                    ],
                  },
                ]}
              />
            )}
            {type === "deposit" && (
              <Dropdown
                sections={[
                  {
                    items: [
                      {
                        content: "Deposit",
                        icon: "ArrowCircleDownSolid",
                        onAction: primaryAction,
                      },
                      {
                        content: "Withdraw",
                        icon: "ArrowCircleUpSolid",
                        onAction: secondaryAction,
                      },
                    ],
                  },
                  {
                    items: [
                      {
                        content: "Filter in Farm",
                        icon: "ExternalLinkSolid",
                        onAction: TertiaryAction,
                      },
                    ],
                  },
                ]}
              />
            )}
          </div>
        </div>
        <div className="pt-4 mt-4 space-y-2 border-t border-gray-200">
          {!!descriptions &&
            descriptions.map((item, i) => (
              <Fragment key={i}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500 capitalize">{item.key}</span>
                  <span className="text-gray-900">{item.value}</span>
                </div>
              </Fragment>
            ))}
        </div>
      </Card>
    </>
  );
};

export default InverstmentCard;
