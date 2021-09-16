import React, { FC, ReactNode } from "react";
import cx, { Argument } from "classnames";

type ItemProps = {
  /**
   * 设置额外的 class
   */
  className?: Argument;
  /**
   * 水平布局或垂直布局
   */
  direction?: "horizontal" | "vertical";
  itemKey?: ReactNode;
  itemValue?: ReactNode;
};

const defaultProps = {
  direction: "horizontal",
} as const;

const Item: FC<ItemProps> = ({ className, itemKey, itemValue, direction, ...rest }) => {
  return (
    <div className={cx(direction === "horizontal" ? "sm:flex sm:justify-between" : null,"text-sm", !!className && className)} {...rest}>
      
      {!!itemKey && <div className="font-medium text-gray-500">{itemKey}</div>}
      {!!itemValue && (
        <div
          className={cx(
            direction === "vertical" ? "mt-1" : null,
            direction === "horizontal" ? "mt-1 sm:mt-0" : null,
            "text-gray-900"
          )}
        >
          {itemValue}
        </div>
      )}

    </div>
  );
};

Item.defaultProps = defaultProps;

export default Item;
