import React, { FC, Fragment } from "react";
import cx, { Argument } from "classnames";
import {
  TokenGroup,
  TokenGroupProps,
  Card,
  Dropdown,
} from "@onekeyhq/ui-components";

type InverstmentCardProps = {
  /**
   * 设置额外的 class
   */
  className?: Argument;
  tokenGroup?: TokenGroupProps;
  type?: string;
  descriptions?: Array<any>;
  primaryAction?: () => void;
  secondaryAction?: () => void;
  TertiaryAction?: () => void;
};

const defaultProps = {} as const;

const InverstmentCard: FC<InverstmentCardProps> = ({ className, type, descriptions, tokenGroup, primaryAction, secondaryAction, TertiaryAction, ...rest }) => {
  return (
    <>
      <Card className={cx("", !!className && className)} {...rest}>
        
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
            {type === "claim" && (
              <Dropdown
                sections={[
                  {
                    items: [
                      {
                        content: "Claim",
                        onAction: primaryAction,
                      },
                      {
                        content: "Unstake",
                        onAction: secondaryAction,
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

InverstmentCard.defaultProps = defaultProps;

export default InverstmentCard;
