"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersTable } from "./users-table";
import { UsersFormDialog } from "./users-form-dialog";
import { PageHeader } from "@/components/page-header";

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
    <div className="space-y-4">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2" />
            Novo Usuário
          </Button>
        }
      />
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
