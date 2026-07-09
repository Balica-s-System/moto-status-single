"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { NoItemsFound } from "@/components/no-items-found";
import { useDeleteUser } from "../_services/use-user-mutations";
import { useGetUsers } from "../_services/use-user-queries";
import { Button } from "@/components/ui/button";
import { Edit, Trash, User, Mail, Shield } from "lucide-react";
import { alert } from "@/lib/use-global-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersTableSkeleton } from "./users-table-skeleton";
import { Badge } from "@/components/ui/badge";

type UsersTableProps = {
  onEdit: (id: string) => void;
};

const UsersTable = ({ onEdit }: UsersTableProps) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const usersQuery = useGetUsers({ page, searchTerm });
  const deleteUserMutation = useDeleteUser();

  const { data, totalPages } = usersQuery.data ?? {
    data: [],
    totalPages: 0,
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <span className="flex items-center gap-1.5">
            <User className="size-4" />
            Nome
          </span>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Mail className="size-4" />
            E-mail
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Shield className="size-4" />
            Perfil
          </span>
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.role === "ADMIN" ? "default" : "secondary"}>
            {row.original.role === "ADMIN" ? "Administrador" : "Usuário"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex gap-2 justify-end">
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item.id);
                }}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  alert({
                    onConfirm: () => deleteUserMutation.mutate(item.id),
                  });
                }}
              >
                <Trash className="size-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteUserMutation, onEdit],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (usersQuery.isLoading) {
    return <UsersTableSkeleton />;
  }

  if (data.length === 0) {
    return (
      <NoItemsFound
        onClick={() => {}}
      />
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-2">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { UsersTable };
