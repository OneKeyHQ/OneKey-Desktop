import cx from "classnames";

const PageContent = ({ children, className, ...rest }) => {
  return (
    <main
      className={cx("flex-1 p-4 lg:p-8", !!className && className)}
      {...rest}
    >
      <div className={cx("w-full max-w-6xl mx-auto")}>{children}</div>
    </main>
  );
};

export default PageContent;