import React from "react";

import { SvgIcon } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

const Mail: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon width="17" height="13" viewBox="0 0 17 13" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.00806 0.5C1.04156 0.5 0.258057 1.2835 0.258057 2.25V2.98577C0.257894 2.99479 0.257894 3.00381 0.258057 3.01282V10.75C0.258057 11.7165 1.04156 12.5 2.00806 12.5H14.5081C15.4746 12.5 16.2581 11.7165 16.2581 10.75V3.01265C16.2583 3.00376 16.2583 2.99485 16.2581 2.98594V2.25C16.2581 1.2835 15.4746 0.5 14.5081 0.5H2.00806ZM14.7581 2.57029V2.25C14.7581 2.11193 14.6462 2 14.5081 2H2.00806C1.86999 2 1.75806 2.11193 1.75806 2.25V2.57029L8.25806 6.38063L14.7581 2.57029ZM1.75806 4.30902V10.75C1.75806 10.8881 1.86999 11 2.00806 11H14.5081C14.6462 11 14.7581 10.8881 14.7581 10.75V4.30902L8.63735 7.89702C8.40313 8.03432 8.11299 8.03432 7.87877 7.89702L1.75806 4.30902Z"
      />
    </SvgIcon>
  );
};

export default Mail;
