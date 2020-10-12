import React from "react";

import { SvgIcon } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";

const Question: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon width="17" height="17" viewBox="0 0 17 17" {...props}>
      <g clipPath="url(#clip0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.25806 2C4.66821 2 1.75806 4.91015 1.75806 8.5C1.75806 12.0899 4.66821 15 8.25806 15C11.848 15 14.7581 12.0899 14.7581 8.5C14.7581 4.91015 11.848 2 8.25806 2ZM0.258057 8.5C0.258057 4.08172 3.83978 0.5 8.25806 0.5C12.6764 0.5 16.2581 4.08172 16.2581 8.5C16.2581 12.9183 12.6764 16.5 8.25806 16.5C3.83978 16.5 0.258057 12.9183 0.258057 8.5ZM9.25806 11.5C9.25806 12.0523 8.81035 12.5 8.25806 12.5C7.70578 12.5 7.25806 12.0523 7.25806 11.5C7.25806 10.9477 7.70578 10.5 8.25806 10.5C8.81035 10.5 9.25806 10.9477 9.25806 11.5ZM7.17888 6.58541C7.25939 6.42438 7.36838 6.28617 7.51783 6.18654C7.66259 6.09004 7.8893 6 8.25806 6C8.53781 6 8.81097 6.08656 8.99556 6.225C9.16012 6.34842 9.25806 6.51009 9.25806 6.75C9.25806 6.92662 9.21725 7.01381 9.18089 7.06835C9.13554 7.13639 9.0573 7.21162 8.90452 7.31349C8.82813 7.36441 8.74594 7.4139 8.6456 7.47411L8.63947 7.47779L8.63945 7.4778C8.54575 7.53402 8.4351 7.60041 8.32637 7.6729C8.10414 7.82107 7.83863 8.02712 7.63399 8.33412C7.40425 8.67878 7.49741 9.14442 7.84207 9.37417C8.18673 9.60391 8.65238 9.51075 8.88212 9.16609C8.92748 9.09803 9.00572 9.02279 9.15849 8.92093C9.23487 8.87001 9.31706 8.82052 9.41739 8.76032L9.4236 8.75659L9.42366 8.75656C9.51732 8.70036 9.62792 8.634 9.7366 8.56154C9.95881 8.41339 10.2243 8.20737 10.429 7.9004C10.6427 7.57994 10.7581 7.19838 10.7581 6.75C10.7581 5.98991 10.3977 5.40158 9.89556 5.025C9.41348 4.66344 8.81164 4.5 8.25806 4.5C7.62682 4.5 7.10353 4.65996 6.68578 4.93846C6.27273 5.21383 6.00672 5.57562 5.83724 5.91459C5.65199 6.28507 5.80216 6.73558 6.17265 6.92082C6.54313 7.10606 6.99364 6.95589 7.17888 6.58541Z"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="16" height="16" transform="translate(0.258057 0.5)" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
};

export default Question;