import cx from "classnames";
import { Button } from "@onekeyhq/ui-components";

const PageHeader = ({
  children,
  className,
  previous,
  thumbnail,
  title,
  actions,
  ...rest
}) => {
  return (
    <header
      className={cx(
        "flex-shrink-0 border-b border-gray-200",
        !!className && className
      )}
      {...rest}
    >
      <div className="p-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center min-w-0">
            {!previous && (
              <div className="flex items-center justify-center w-5 h-5 mr-5">
                <Button leadingIcon="ArrowLeftSolid" type="plain" circular />
              </div>
            )}
            <div className="flex items-center min-w-0 space-x-3">
              {thumbnail && (
                <div className="inline-flex flex-shrink-0">{thumbnail}</div>
              )}
              <h1 className="text-lg font-medium text-gray-900 truncate">
                {title}
              </h1>
            </div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
