export const arrivalStatusLabels: Record<string, string> = {
  NO_INFORMATION: "Sem Informação",
  DELAYED: "Atrasado",
  ARRIVED: "Entregue",
};

export const arrivalStatusVariants: Record<
  string,
  "secondary" | "destructive" | "default"
> = {
  NO_INFORMATION: "secondary",
  DELAYED: "destructive",
  ARRIVED: "default",
};

export const registrationStatusLabels: Record<string, string> = {
  NO_PLATE: "Sem Placa",
  PLATING: "Em Emplacamento",
  PLATED: "Emplacada",
};

export const registrationStatusVariants: Record<
  string,
  "outline" | "secondary" | "default"
> = {
  NO_PLATE: "outline",
  PLATING: "secondary",
  PLATED: "default",
};

export type MotorcycleCardProps = {
  item: any;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
};
