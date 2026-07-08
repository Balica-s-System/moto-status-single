import { Button } from "@/components/ui/button";
import { CircleOff } from "lucide-react";

type NoItemsFoundProps = {
  onClick: () => void;
};

const NoItemsFound = ({ onClick }: NoItemsFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CircleOff className="text-primary mb-2" />
      <h3 className="text-lg font-medium">Nenhum item encontrado</h3>
      <p className="text-foreground/60 mt-1 text-sm">Tente adicionar novos itens</p>
      <Button variant="outline" className="mt-4" onClick={onClick}>
        Adicionar novo item
      </Button>
    </div>
  );
};

export { NoItemsFound };
