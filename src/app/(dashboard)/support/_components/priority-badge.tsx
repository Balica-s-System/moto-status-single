import { Badge } from "@/components/ui/badge";
import {
  ticketPriorityLabels,
  ticketPriorityVariants,
} from "../_types/ticketStatusLabels";

type PriorityBadgeProps = {
  priority: string;
};

const PriorityBadge = ({ priority }: PriorityBadgeProps) => (
  <Badge variant={ticketPriorityVariants[priority] ?? "secondary"}>
    {ticketPriorityLabels[priority] ?? priority}
  </Badge>
);

export { PriorityBadge };
