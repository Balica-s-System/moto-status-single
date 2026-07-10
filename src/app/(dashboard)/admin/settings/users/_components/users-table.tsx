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
import { Edit, Trash, User, Mail, Shield, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type UsersTableProps = {
  onEdit: (id: string) => void;
};

/* ─── Mobile Card ─── */

type UserCardProps = {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
};

const UserCard = ({ item, onEdit, onDelete }: UserCardProps) => {
  const initials = (item.name ?? "")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <article
      className="flex items-center gap-3 rounded-xl border bg-card p-4"
      aria-label={`Usuário ${item.name}`}
    >
      <Avatar className="size-10 shrink-0 ring-2 ring-border">
        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <p className="truncate text-xs text-muted-foreground">{item.email}</p>
        <Badge
          className="mt-1.5"
          variant={item.role === "admin" ? "default" : "secondary"}
        >
          {item.role === "admin" ? "Administrador" : "Usuário"}
        </Badge>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 touch-target"
            aria-label={`Ações para ${item.name}`}
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="size-4" aria-hidden="true" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => alert({ onConfirm: onDelete })}
          >
            <Trash className="size-4" aria-hidden="true" /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
};

/* ─── Main Component ─── */

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
            <User className="size-4" aria-hidden="true" />
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
            <Mail className="size-4" aria-hidden="true" />
            E-mail
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Shield className="size-4" aria-hidden="true" />
            Perfil
          </span>
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.role === "admin" ? "default" : "secondary"}>
            {row.original.role === "admin" ? "Administrador" : "Usuário"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-end gap-1">
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                aria-label={`Editar ${item.name}`}
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
                aria-label={`Excluir ${item.name}`}
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
        title="Nenhum usuário encontrado"
        description="Adicione o primeiro usuário do sistema"
        buttonLabel="Novo Usuário"
        onClick={() => {}}
      />
    );
  }

  return (
    <>
      {/* ─── Mobile: Card Layout ─── */}
      <div className="space-y-3 md:hidden" role="list" aria-label="Lista de usuários">
        {data.map((item: any) => (
          <UserCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(item.id)}
            onDelete={() => deleteUserMutation.mutate(item.id)}
          />
        ))}
      </div>

      {/* ─── Desktop: Table Layout ─── */}
      <div className="hidden rounded-xl border bg-card md:block">
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
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
    </>
  );
};

export { UsersTable };
