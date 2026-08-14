import { Badge } from "@/components/ui/badge";
import {
  ticketStatusLabels,
  ticketStatusVariants,
} from "../_types/ticketStatusLabels";

type StatusBadgeProps = {
  status: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge variant={ticketStatusVariants[status] ?? "secondary"}>
    {ticketStatusLabels[status] ?? status}
  </Badge>
);

export { StatusBadge };
