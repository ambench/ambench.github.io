export type ReleaseResource = {
  id: "documentation" | "paper" | "code";
  label: string;
  status: "available" | "coming-soon";
  href: string | null;
};

export const releaseResources: ReleaseResource[] = [
  {
    id: "documentation",
    label: "Read documentation",
    status: "available",
    href: "/docs/",
  },
  {
    id: "paper",
    label: "Paper",
    status: "available",
    href: "https://arxiv.org/abs/2609.00641",
  },
  {
    id: "code",
    label: "Code",
    status: "available",
    href: "https://github.com/ambench/ambench",
  },
];
