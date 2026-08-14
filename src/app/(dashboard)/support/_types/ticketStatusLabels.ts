export const ticketStatusLabels: Record<string, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Andamento",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

export const ticketStatusVariants: Record<
  string,
  "outline" | "secondary" | "default" | "destructive"
> = {
  OPEN: "secondary",
  IN_PROGRESS: "default",
  RESOLVED: "outline",
  CLOSED: "outline",
};

export const ticketPriorityLabels: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const ticketPriorityVariants: Record<
  string,
  "outline" | "secondary" | "default" | "destructive"
> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
};
