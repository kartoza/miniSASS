import React from "react";

const sizeClasses = {
  txtRalewayExtraBold14WhiteA700: "font-extrabold font-raleway",
  txtRalewayRomanBold16: "font-bold font-raleway",
  txtRalewayRomanSemiBold16: "font-raleway font-semibold",
  txtRalewayRomanRegular16WhiteA700: "font-normal font-raleway",
  txtRalewayRomanRegular16Gray800: "font-normal font-raleway",
  txtRalewayBold24WhiteA700: "font-bold font-raleway",
  txtRalewayRomanRegular16: "font-normal font-raleway",
  txtRalewayBold18Green800: "font-bold font-raleway",
  txtRalewayRomanSemiBold16Green800: "font-raleway font-semibold",
  txtRalewayRomanRegular20: "font-normal font-raleway",
  txtRalewayRomanSemiBold20: "font-raleway font-semibold",
  txtRalewayExtraBold14: "font-extrabold font-raleway",
  txtRalewayBold24: "font-bold font-raleway",
  txtRalewayBold18: "font-bold font-raleway",
  txtRalewayBold18WhiteA700: "font-bold font-raleway",
  txtRalewayRomanBold40: "font-bold font-raleway",
  txtRalewayRomanBold42: "font-bold font-raleway",
  txtRalewayRomanSemiBold16Bluegray500: "font-raleway font-semibold",
  txtRalewayRomanBold40WhiteA700: "font-bold font-raleway",
} as const;

export type TextProps = Partial<{
  className: string;
  size: keyof typeof sizeClasses;
  as: any;
}> &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  size,
  as,
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component
      className={`text-left ${className} ${size && sizeClasses[size]}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
