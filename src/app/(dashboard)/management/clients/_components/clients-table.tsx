"use client";

import { Fragment, useMemo, useState } from "react";
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
import {
  ChevronRight,
  Edit,
  Eye,
  Trash,
  User,
  IdCard,
  MapPin,
  UserCheck,
  Calendar,
  Bike,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { alert } from "@/lib/use-global-store";
import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";

/* ─── Mobile Card ─── */

type ClientCardProps = {
  item: any;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const ClientCard = ({ item, onPreview, onEdit, onDelete }: ClientCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const motorcycles = item._motorcycles ?? [];

  return (
    <article
      className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
      aria-label={`Cliente ${item.name}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{item.name}</h3>
          <ClickToCopy text={item.cpf}>
            <span className="font-mono text-xs text-muted-foreground">
              {formatDocument(item.cpf)}
            </span>
          </ClickToCopy>
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
            <DropdownMenuItem onClick={onPreview}>
              <Eye className="size-4" aria-hidden="true" /> Visualizar
            </DropdownMenuItem>
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
      </div>

      {/* Info grid */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Cidade</p>
          <p className="truncate font-medium">{item.city || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Vendedor</p>
          <p className="truncate font-medium">{item.sellersName || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Data Fat.</p>
          <p className="font-medium">
            {item.billingDate
              ? format(new Date(item.billingDate), "dd/MM/yyyy")
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Motos</p>
          <Badge variant="secondary" className="mt-0.5">
            {item._motorcycleCount}
          </Badge>
        </div>
      </div>

      {/* Expandable motorcycles */}
      {motorcycles.length > 0 && (
        <>
          <button
            type="button"
            className="mt-3 flex w-full items-center gap-1.5 rounded-md border border-dashed px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 touch-target"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Ocultar" : "Ver"} motos associadas`}
          >
            <Bike className="size-3.5" aria-hidden="true" />
            {expanded ? "Ocultar" : "Ver"} motos ({motorcycles.length})
            <ChevronRight
              className={cn(
                "ml-auto size-3.5 transition-transform duration-200",
                expanded && "rotate-90",
              )}
              aria-hidden="true"
            />
          </button>
          {expanded && (
            <div className="mt-2 space-y-1.5 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              {motorcycles.map((moto: any) => (
                <div
                  key={moto.id}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                >
                  <span className="text-xs font-medium">{moto.model}</span>
                  <ClickToCopy text={moto.chassi}>
                    <span className="font-mono text-xs text-muted-foreground">
                      {moto.chassi}
                    </span>
                  </ClickToCopy>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
};

/* ─── Main Component ─── */

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

  const rows = useMemo(() => {
    if (!clientsQuery.data) return [];
    return clientsQuery.data.data.map((item: any) => ({
      ...item,
      _motorcycles: item.motorcycles ?? [],
      _motorcycleCount: (item.motorcycles ?? []).length,
    }));
  }, [clientsQuery.data]);

  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const toggleRow = (rowId: string) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "toggle",
        header: "",
        cell: ({ row }) => {
          const isOpen = openRows.has(row.id);
          return (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={(e) => {
                e.stopPropagation();
                toggleRow(row.id);
              }}
              aria-expanded={isOpen}
              aria-label="Expandir detalhes"
            >
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
                aria-hidden="true"
              />
            </Button>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
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
        accessorKey: "cpf",
        header: () => (
          <span className="flex items-center gap-1.5">
            <IdCard className="size-4" aria-hidden="true" />
            CPF / CNPJ
          </span>
        ),
        cell: ({ row }) => (
          <ClickToCopy text={row.original.cpf}>
            <span className="font-mono text-xs">
              {formatDocument(row.original.cpf)}
            </span>
          </ClickToCopy>
        ),
      },
      {
        accessorKey: "city",
        header: () => (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            Cidade
          </span>
        ),
      },
      {
        accessorKey: "sellersName",
        header: () => (
          <span className="flex items-center gap-1.5">
            <UserCheck className="size-4" aria-hidden="true" />
            Vendedor
          </span>
        ),
      },
      {
        accessorKey: "billingDate",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" aria-hidden="true" />
            Data Fat.
          </span>
        ),
        cell: ({ row }) => {
          const date = row.original.billingDate;
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
        },
      },
      {
        accessorKey: "_motorcycleCount",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Bike className="size-4" aria-hidden="true" />
            Motos
          </span>
        ),
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original._motorcycleCount}
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
                aria-label={`Visualizar ${item.name}`}
                onClick={(e) => {
                  e.stopPropagation();
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
                aria-label={`Editar ${item.name}`}
                onClick={(e) => {
                  e.stopPropagation();
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
                aria-label={`Excluir ${item.name}`}
                onClick={(e) => {
                  e.stopPropagation();
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
    [
      updateClientId,
      updateClientDialogOpen,
      updateClientPreviewOpen,
      deleteClientMutation,
      openRows,
    ],
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
    return (
      <NoItemsFound
        title="Nenhum cliente encontrado"
        description="Adicione o primeiro cliente para começar"
        buttonLabel="Novo Cliente"
        onClick={() => updateClientDialogOpen(true)}
      />
    );
  }

  return (
    <>
      {/* ─── Mobile: Card Layout ─── */}
      <div className="space-y-3 md:hidden" role="list" aria-label="Lista de clientes">
        {rows.map((item: any) => (
          <ClientCard
            key={item.id}
            item={item}
            onPreview={() => {
              updateClientId(item.id);
              updateClientPreviewOpen(true);
            }}
            onEdit={() => {
              updateClientId(item.id);
              updateClientDialogOpen(true);
            }}
            onDelete={() => deleteClientMutation.mutate(item.id)}
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
            {table.getRowModel().rows.map((row) => {
              const isOpen = openRows.has(row.id);
              const cellCount = row.getVisibleCells().length;
              const motorcycles = row.original._motorcycles ?? [];
              return (
                <Fragment key={row.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => toggleRow(row.id)}
                    aria-expanded={isOpen}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {isOpen && (
                    <TableRow>
                      <TableCell colSpan={cellCount} className="p-0">
                        <div className="border-t bg-muted/30 px-6 py-4 animate-in slide-in-from-top-1 duration-200">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Motos associadas ({motorcycles.length})
                          </p>
                          {motorcycles.length > 0 ? (
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {motorcycles.map((moto: any) => (
                                <div
                                  key={moto.id}
                                  className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
                                >
                                  <Bike className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium">
                                      {moto.model}
                                    </p>
                                    <ClickToCopy text={moto.chassi}>
                                      <span className="font-mono text-xs text-muted-foreground">
                                        {moto.chassi}
                                      </span>
                                    </ClickToCopy>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma moto associada
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={clientFilters.page}
        totalPages={totalPages}
        updatePage={updateClientFiltersPage}
      />
    </>
  );
};

export default ClientsTable;
