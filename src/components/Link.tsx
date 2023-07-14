import NextLink from "next/link";

type Props = {
  href: string;
  target?: string;
  children: React.ReactNode;
};

export const Link: React.FC<Props> = ({
  href,
  target,
  children,
}) => (
  <NextLink
    href={href}
    passHref
    target={target}
    className="text-primary hover:text-primary-light font-medium"
  >
    {children}
  </NextLink>
);
