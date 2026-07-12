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
import { useInventoryStore } from "../_libs/use-inventory-store";
import { useDeleteMotorcycle } from "../_services/use-inventory-mutations";
import { useGetMotorcycles } from "../_services/use-inventory-queries";
import { MotorcycleSchema } from "../_types/motorcycleSchema";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Edit,
  Eye,
  Trash,
  Bike,
  Hash,
  Calendar,
  MoreVertical,
  DollarSign,
  CalendarIcon,
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
import { InventoryTableSkeleton } from "./inventory-table-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  arrivalStatusLabels,
  arrivalStatusVariants,
  registrationStatusLabels,
  registrationStatusVariants,
  MotorcycleCardProps,
} from "../_types/motorcycleStatusLabels";

const MotorcycleCard = ({
  item,
  onPreview,
  onEdit,
  onDelete,
}: MotorcycleCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm"
      aria-label={`Motocicleta ${item.model}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{item.model}</h3>
          <ClickToCopy text={item.chassi}>
            <span className="font-mono text-xs text-muted-foreground">
              {item.chassi}
            </span>
          </ClickToCopy>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 touch-target"
              aria-label={`Ações para ${item.model}`}
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

      {/* Status + Date row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge
          variant={
            arrivalStatusVariants[item.forecastArrivalStatus] ?? "secondary"
          }
        >
          {arrivalStatusLabels[item.forecastArrivalStatus] ??
            item.forecastArrivalStatus}
        </Badge>
        {item.registrationStatus && (
          <Badge
            variant={
              registrationStatusVariants[item.registrationStatus] ?? "outline"
            }
          >
            {registrationStatusLabels[item.registrationStatus] ??
              item.registrationStatus}
          </Badge>
        )}
      </div>

      {/* Info grid */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Previsão de Chegada</p>
          <p className="font-medium">
            {item.forecastArrival
              ? format(new Date(item.forecastArrival), "dd/MM/yyyy")
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Cliente</p>
          <p className="truncate font-medium">{item.client?.name ?? "-"}</p>
        </div>
      </div>

      {/* Expandable details */}
      <button
        type="button"
        className="mt-3 flex w-full items-center gap-1.5 rounded-md border border-dashed px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 touch-target"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={`${expanded ? "Ocultar" : "Ver"} detalhes`}
      >
        {expanded ? "Ocultar detalhes" : "Ver detalhes"}
        <ChevronRight
          className={cn(
            "ml-auto size-3.5 transition-transform duration-200",
            expanded && "rotate-90",
          )}
          aria-hidden="true"
        />
      </button>
      {expanded && (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-muted/50 p-3 text-sm animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <div>
            <p className="text-xs text-muted-foreground">Data Emplacamento</p>
            <p className="font-medium">
              {item.registrationDate
                ? format(new Date(item.registrationDate), "dd/MM/yyyy")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status Emplacamento</p>
            <p className="font-medium">
              {item.registrationStatus
                ? (registrationStatusLabels[item.registrationStatus] ??
                  item.registrationStatus)
                : "-"}
            </p>
          </div>
        </div>
      )}
    </article>
  );
};

/* ─── Main Component ─── */

const InventoryTable = () => {
  const {
    updateMotorcycleId,
    updateInventoryDialogOpen,
    updateInventoryPreviewOpen,
    motorcycleFilters,
    updateMotorcycleFiltersPage,
  } = useInventoryStore();

  const motorcyclesQuery = useGetMotorcycles(motorcycleFilters);
  const deleteMotorcycleMutation = useDeleteMotorcycle();

  const { data, totalPages } = motorcyclesQuery.data ?? {
    data: [] as MotorcycleSchema[],
    totalPages: 0,
  };

  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const toggleRow = (rowId: string) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
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
        accessorKey: "model",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Bike className="size-4" aria-hidden="true" />
            Modelo
          </span>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.model}</span>
        ),
      },
      {
        accessorKey: "chassi",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Hash className="size-4" aria-hidden="true" />
            Chassi
          </span>
        ),
        cell: ({ row }) => (
          <ClickToCopy text={row.original.chassi}>
            <span className="font-mono text-xs">{row.original.chassi}</span>
          </ClickToCopy>
        ),
      },
      {
        accessorKey: "year",
        header: () => (
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="size-4" aria-hidden="true" />
            Ano
          </span>
        ),
        cell: ({ row }) => (
          <span>{row.original.year ?? "-"}</span>
        ),
      },
      {
        accessorKey: "price",
        header: () => (
          <span className="flex items-center gap-1.5">
            <DollarSign className="size-4" aria-hidden="true" />
            Preço
          </span>
        ),
        cell: ({ row }) => {
          const price = row.original.price;
          return price
            ? price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "-";
        },
      },
      {
        accessorKey: "forecastArrival",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" aria-hidden="true" />
            Previsão
          </span>
        ),
        cell: ({ row }) => {
          const date = row.original.forecastArrival;
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
        },
      },
      {
        accessorKey: "forecastArrivalStatus",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={
              arrivalStatusVariants[row.original.forecastArrivalStatus] ??
              "secondary"
            }
          >
            {arrivalStatusLabels[row.original.forecastArrivalStatus] ??
              row.original.forecastArrivalStatus}
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
                aria-label={`Visualizar ${item.model}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateMotorcycleId(item.id);
                  updateInventoryPreviewOpen(true);
                }}
              >
                <Eye className="size-4" />
              </Button>
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                aria-label={`Editar ${item.model}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateMotorcycleId(item.id);
                  updateInventoryDialogOpen(true);
                }}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                variant="ghost"
                size="icon"
                aria-label={`Excluir ${item.model}`}
                onClick={(e) => {
                  e.stopPropagation();
                  alert({
                    onConfirm: () => deleteMotorcycleMutation.mutate(item.id),
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
      updateMotorcycleId,
      updateInventoryDialogOpen,
      updateInventoryPreviewOpen,
      deleteMotorcycleMutation,
      openRows,
    ],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (motorcyclesQuery.isLoading) {
    return <InventoryTableSkeleton />;
  }

  if (data.length === 0) {
    return (
      <NoItemsFound
        title="Nenhuma motocicleta encontrada"
        description="Adicione a primeira motocicleta ao estoque"
        buttonLabel="Nova Motocicleta"
        onClick={() => updateInventoryDialogOpen(true)}
      />
    );
  }

  return (
    <>
      <div
        className="space-y-3 md:hidden"
        role="list"
        aria-label="Lista de motocicletas"
      >
        {data.map((item: any) => (
          <MotorcycleCard
            key={item.id}
            item={item}
            onPreview={() => {
              updateMotorcycleId(item.id);
              updateInventoryPreviewOpen(true);
            }}
            onEdit={() => {
              updateMotorcycleId(item.id);
              updateInventoryDialogOpen(true);
            }}
            onDelete={() => deleteMotorcycleMutation.mutate(item.id)}
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
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Status da Chegada
                              </p>
                              <Badge
                                className="mt-1"
                                variant={
                                  arrivalStatusVariants[
                                    row.original.forecastArrivalStatus
                                  ] ?? "secondary"
                                }
                              >
                                {arrivalStatusLabels[
                                  row.original.forecastArrivalStatus
                                ] || row.original.forecastArrivalStatus}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Emplacamento
                              </p>
                              {row.original.registrationStatus ? (
                                <Badge
                                  className="mt-1"
                                  variant={
                                    registrationStatusVariants[
                                      row.original.registrationStatus
                                    ] ?? "outline"
                                  }
                                >
                                  {registrationStatusLabels[
                                    row.original.registrationStatus
                                  ] || row.original.registrationStatus}
                                </Badge>
                              ) : (
                                <p className="mt-1 text-sm">-</p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Data Emplacamento
                              </p>
                              <p className="mt-1 text-sm">
                                {row.original.registrationDate
                                  ? format(
                                      new Date(row.original.registrationDate),
                                      "dd/MM/yyyy",
                                    )
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Cliente
                              </p>
                              <p className="mt-1 text-sm font-medium">
                                {row.original.client?.name ?? (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
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

      <Pagination
        currentPage={motorcycleFilters.page}
        totalPages={totalPages}
        updatePage={updateMotorcycleFiltersPage}
      />
    </>
  );
};

export default InventoryTable;
