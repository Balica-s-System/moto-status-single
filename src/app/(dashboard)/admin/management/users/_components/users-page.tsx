"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersTable } from "./users-table";
import { UsersFormDialog } from "./users-form-dialog";

const UsersPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setDialogOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="space-y-2">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-semibold">Usuários</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2" />
          Novo Usuário
        </Button>
      </div>
      <UsersTable onEdit={handleEdit} />
      <UsersFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedUserId={selectedUserId}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};

export { UsersPage };
