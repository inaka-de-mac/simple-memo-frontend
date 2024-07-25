import { Tooltip } from "@mui/material";
import React, { ReactElement } from "react";

interface IconTooltipProps {
  title: string;
  children: ReactElement;
}

const IconTooltip: React.FC<IconTooltipProps> = ({ title, children }) => {  
  return (
    <Tooltip
      title={
        <div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--white)",
              fontWeight: "bold",
            }}
          >
            {title}
          </p>
        </div>
      }
      placement="top"
      componentsProps={{
        popper: {
          sx: {
            zIndex: 10000, // BubbleMenuのデフォルトが9999
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default IconTooltip;
