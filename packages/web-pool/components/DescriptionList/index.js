import cx from "classnames";
import Item from "./Item";

const DescriptonList = (props) => {
  const { children, className } = props;

  return (
    <div className={cx("space-y-3", !!className && className)}>{children}</div>
  );
};

DescriptonList.Item = Item;

export default DescriptonList;
