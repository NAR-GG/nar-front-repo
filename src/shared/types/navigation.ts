export type SubNavItem = {
  key: string;
  label: string;
  href: string;
  description?: string;
  match?: (pathname: string) => boolean;
};

export type NavItem = {
  key: string;
  label: string;
  href: string;
  match?: (pathname: string) => boolean;
  children?: SubNavItem[];
};
