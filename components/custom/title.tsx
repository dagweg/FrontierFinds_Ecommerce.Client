import React, { JSX } from "react";

interface TitleProps {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}

const Title: React.FC<TitleProps> = ({
  text,
  tag: Tag = "h1",
  className,
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    fontWeight: "bold",
    padding: "10px 0",
  };

  return (
    <Tag
      className={`w-fit font-poppins ${className}`}
      style={{ ...baseStyle, ...style }}
    >
      {text}
    </Tag>
  );
};

export default Title;
