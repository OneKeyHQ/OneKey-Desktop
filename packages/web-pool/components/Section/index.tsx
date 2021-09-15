import React, { FC } from 'react';
import cx, { Argument } from 'classnames';

type SectionProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
};

const defaultProps = {} as const;

const Section: FC<SectionProps> = ({ className, children, ...rest }) => {
    return (
        <div className={cx('mb-8 last:mb-0', !!className && className)} {...rest}>
            {children}
        </div>
    );
};

Section.defaultProps = defaultProps;

export default Section;
