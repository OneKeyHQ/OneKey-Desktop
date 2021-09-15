import cx from "classnames";

const Page = ({ children, className, ...rest }) => {
  return (
    <div
      className={cx("flex-1 flex flex-col bg-white-ground", !!className && className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Page;