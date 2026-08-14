"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Search, User2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { NoItemsFound } from "@/components/no-items-found";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/components/use-debounce";
import type { TicketListItem } from "../_services/ticketQueries";
import { useGetTickets } from "../_services/use-ticket-queries";
import { ticketStatusLabels } from "../_types/ticketStatusLabels";
import { PriorityBadge } from "./priority-badge";
import { StatusBadge } from "./status-badge";
import { TicketsTableSkeleton } from "./tickets-table-skeleton";

type TicketsTableProps = {
  isAdmin: boolean;
};

/* ─── Mobile Card ─── */

type TicketCardProps = {
  item: TicketListItem;
  isAdmin: boolean;
};

const TicketCard = ({ item, isAdmin }: TicketCardProps) => {
  return (
    <article
      className="rounded-xl border bg-card p-4"
      aria-label={`Chamado ${item.subject}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-sm font-semibold">{item.subject}</p>
        <Link
          href={`/support/${item.id}`}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground touch-target"
          aria-label={`Abrir chamado ${item.subject}`}
        >
          <Eye className="size-4" />
        </Link>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={item.status} />
        <PriorityBadge priority={item.priority} />
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        {isAdmin && (
          <span className="inline-flex items-center gap-1">
            <User2Icon className="size-3" aria-hidden="true" />
            {item.userName}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          Atualizado em {format(new Date(item.updatedAt), "dd/MM/yyyy")}
        </span>
      </div>
    </article>
  );
};

/* ─── Main Component ─── */

const TicketsTable = ({ isAdmin }: TicketsTableProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const ticketsQuery = useGetTickets({
    page,
    searchTerm: debouncedSearch,
    status: status || undefined,
  });

  const { data, totalPages } = ticketsQuery.data ?? {
    data: [],
    totalPages: 0,
  };

  const columns = useMemo<ColumnDef<TicketListItem>[]>(
    () => [
      {
        accessorKey: "subject",
        header: "Assunto",
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-64 font-medium">
            {row.original.subject}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "priority",
        header: "Prioridade",
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
      },
      ...(isAdmin
        ? [
            {
              accessorKey: "userName",
              header: () => (
                <span className="flex items-center gap-1.5">
                  <User2Icon className="size-4" aria-hidden="true" />
                  Solicitante
                </span>
              ),
            },
          ]
        : []),
      {
        accessorKey: "updatedAt",
        header: "Atualizado em",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {format(new Date(row.original.updatedAt), "dd/MM/yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Ações</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-end">
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                aria-label={`Abrir chamado ${item.subject}`}
                asChild
              >
                <Link href={`/support/${item.id}`}>
                  <Eye className="size-4" />
                </Link>
              </Button>
            </div>
          );
        },
      },
    ],
    [isAdmin],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (ticketsQuery.isLoading) {
    return <TicketsTableSkeleton />;
  }

  if (data.length === 0) {
    return (
      <NoItemsFound
        title="Nenhum chamado encontrado"
        description="Abra um chamado para receber suporte"
        buttonLabel="Novo Chamado"
        onClick={() => {
          window.location.href = "/support/new";
        }}
      />
    );
  }

  return (
    <>
      {/* ─── Toolbar ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por assunto..."
            className="pl-9"
            aria-label="Buscar chamados"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value === "ALL" ? "" : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-52" aria-label="Filtrar por status">
            <SelectValue placeholder="Status: Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            {Object.entries(ticketStatusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ─── Mobile: Card Layout ─── */}
      <div
        className="space-y-3 md:hidden"
        role="list"
        aria-label="Lista de chamados"
      >
        {data.map((item: TicketListItem) => (
          <TicketCard key={item.id} item={item} isAdmin={isAdmin} />
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

export { TicketsTable };
