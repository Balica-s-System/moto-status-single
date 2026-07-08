"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ClickToCopy } from "@/components/click-to-copy";
import { NoItemsFound } from "@/components/no-items-found";
import { useClientStore } from "../_libs/use-clients-store";
import { useDeleteClient } from "../_services/use-client-mutations";
import { useGetClients } from "../_services/use-client-queries";
import { ClientSchema } from "../_types/clientSchema";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { alert } from "@/lib/use-global-store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { ClientsTableSkeleton } from "./clients-table-skeleton";
import { formatDocument } from "@/lib/format";

const ClientsTable = () => {
  const {
    updateClientId,
    updateClientDialogOpen,
    updateClientPreviewOpen,
    clientFilters,
    updateClientFiltersPage,
  } = useClientStore();

  const clientsQuery = useGetClients(clientFilters);
  const deleteClientMutation = useDeleteClient();

  const { data, totalPages } = clientsQuery.data ?? {
    data: [] as ClientSchema[],
    totalPages: 0,
  };

  // get the extra fields from the API response
  const rows = useMemo(() => {
    if (!clientsQuery.data) return [];
    return clientsQuery.data.data.map((item: any) => ({
      ...item,
      _motorcycles: item.motorcycles ?? [],
      _motorcycleCount: (item.motorcycles ?? []).length,
    }));
  }, [clientsQuery.data]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nome",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "cpf",
        header: "CPF / CNPJ",
        cell: ({ row }) => (
          <ClickToCopy text={row.original.cpf}>
            <span className="font-mono text-xs">{formatDocument(row.original.cpf)}</span>
          </ClickToCopy>
        ),
      },
      {
        accessorKey: "city",
        header: "Cidade",
      },
      {
        accessorKey: "sellersName",
        header: "Vendedor",
      },
      {
        accessorKey: "billingDate",
        header: "Data Fat.",
        cell: ({ row }) => {
          const date = row.original.billingDate;
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
        },
      },
      {
        accessorKey: "_motorcycleCount",
        header: "Motos",
        cell: ({ row }) => (
          <span className="text-center block">{row.original._motorcycleCount}</span>
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
                onClick={() => {
                  updateClientId(item.id);
                  updateClientPreviewOpen(true);
                }}
              >
                <Eye className="size-4" />
              </Button>
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                onClick={() => {
                  updateClientId(item.id);
                  updateClientDialogOpen(true);
                }}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                variant="ghost"
                size="icon"
                onClick={() => {
                  alert({
                    onConfirm: () => deleteClientMutation.mutate(item.id),
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
    [updateClientId, updateClientDialogOpen, updateClientPreviewOpen, deleteClientMutation],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (clientsQuery.isLoading) {
    return <ClientsTableSkeleton />;
  }

  if (rows.length === 0) {
    return <NoItemsFound onClick={() => updateClientDialogOpen(true)} />;
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={clientFilters.page}
        totalPages={totalPages}
        updatePage={updateClientFiltersPage}
      />
    </div>
  );
};

export default ClientsTable;
