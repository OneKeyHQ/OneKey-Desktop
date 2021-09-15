import cx from "classnames";

const Item = (props) => {
  const { itemKey, itemValue, direction = "horizontal", className } = props;

  return (
    <div
      className={cx(
        direction === "horizontal" ? "sm:flex sm:justify-between" : null,
        "text-sm",
        !!className && className
      )}
    >
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

export default Item;
