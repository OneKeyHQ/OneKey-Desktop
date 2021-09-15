import cx from "classnames";

const Section = ({ children, className, ...rest }) => {
  return (
    <div className={cx("mb-8 last:mb-0", !!className && className)} {...rest}>
      {children}
    </div>
  );
};

export default Section;
