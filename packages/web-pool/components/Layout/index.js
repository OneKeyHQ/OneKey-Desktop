import cx from "classnames";

const AppWrapper = ({ children, className, ...rest }) => {
  return (
    <div
      className={cx(
        "flex flex-col w-full h-full h-screen lg:flex-row",
        !!className && className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default AppWrapper;
