import React from "react";

const shapes = {
  round:
    "rounded-bl-[15px] rounded-br-[15px] rounded-tl-none rounded-tr-[15px]",
  square: "rounded-none",
} as const;
const variants = {
  fill: {
    gray_200: "bg-gray-200 text-blue-900",
    blue_gray_500: "bg-blue_gray-500 text-white-A700",
    blue_900: "bg-blue-900 text-white-A700",
  },
} as const;
const sizes = { xs: "p-2", sm: "p-3" } as const;

export type ButtonProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "onClick"
> &
  Partial<{
    className: string;
    shape: keyof typeof shapes;
    variant: keyof typeof variants;
    size: keyof typeof sizes;
    color: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    onClick: () => void;
  }>;

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "",
  size = "",
  variant = "",
  color = "",
  ...restProps
}) => {
  return (
    <button
      className={`${className} ${(shape && shapes[shape]) || ""} ${
        (size && sizes[size]) || ""
      } ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

export { Button };
