"use client";

import { Button } from "@/components/ui/button";
import { PackageOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";

type NoItemsFoundProps = {
  onClick: () => void;
  title?: string;
  description?: string;
  buttonLabel?: string;
};

const NoItemsFound = ({
  onClick,
  title = "Nenhum item encontrado",
  description = "Comece adicionando o primeiro registro",
  buttonLabel = "Adicionar novo item",
}: NoItemsFoundProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-16 text-center"
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-muted">
        <PackageOpen className="size-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        {description}
      </p>
      <Button variant="outline" className="mt-5 gap-2" onClick={onClick}>
        <Plus className="size-4" />
        {buttonLabel}
      </Button>
    </motion.div>
  );
};

export { NoItemsFound };
