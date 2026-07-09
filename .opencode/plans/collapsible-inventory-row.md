# Plano: Collapsible Row na Inventory Table

## Objetivo
Adicionar linhas expansíveis na tabela de inventário usando o `Collapsible` do shadcn. A tabela principal fica mais enxuta e ao clicar na linha, expande mostrando detalhes.

## Colunas da tabela principal (após alteração)
1. **Toggle** (novo) — ChevronRight que rotaciona ao expandir
2. **Modelo** (existente)
3. **Chassi** (existente)
4. **Previsão de Chegada** (existente)
5. **Ações** (existente)

## Colunas removidas da visualização principal (movidas para expandido)
- Status da Chegada (`forecastArrivalStatus`)
- Status Emplacamento (`registrationStatus`)
- Data Emplacamento (`registrationDate`)
- Cliente (`client`)

## Conteúdo expandido
Grid com os campos: Status da Chegada, Status Emplacamento, Data Emplacamento, Cliente

## Arquivo a modificar
`src/app/(dashboard)/admin/management/inventory/_components/inventory-table.tsx`

## Alterações necessárias

### 1. Imports — adicionar:
```tsx
import { useState } from "react";  // adicionar ao import existente
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";  // adicionar ao import existente
import { cn } from "@/lib/utils";
```

### 2. State — adicionar dentro do componente:
```tsx
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
```

### 3. Colunas — remover forecastArrivalStatus, registrationDate, client e adicionar toggle:
```tsx
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
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-90",
              )}
            />
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "model",
      header: "Modelo",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.model}</span>
      ),
    },
    {
      accessorKey: "chassi",
      header: "Chassi",
      cell: ({ row }) => (
        <ClickToCopy text={row.original.chassi}>
          <span className="font-mono text-xs">{row.original.chassi}</span>
        </ClickToCopy>
      ),
    },
    {
      accessorKey: "forecastArrival",
      header: "Previsão de Chegada",
      cell: ({ row }) => {
        const date = row.original.forecastArrival;
        return date ? format(new Date(date), "dd/MM/yyyy") : "-";
      },
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
              onClick={() => {
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
              onClick={() => {
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
  [updateMotorcycleId, updateInventoryDialogOpen, updateInventoryPreviewOpen, deleteMotorcycleMutation, openRows],
);
```

### 4. Table Body — renderizar Collapsible rows:
```tsx
<TableBody>
  {table.getRowModel().rows.map((row) => {
    const isOpen = openRows.has(row.id);
    const cellCount = row.getVisibleCells().length;
    return (
      <Collapsible
        key={row.id}
        open={isOpen}
        onOpenChange={() => toggleRow(row.id)}
        asChild
      >
        <>
          <TableRow
            className="cursor-pointer"
            onClick={() => toggleRow(row.id)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell colSpan={cellCount} className="p-0">
              <CollapsibleContent>
                <div className="border-t bg-muted/30 px-6 py-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Status da Chegada
                      </p>
                      <p className="text-sm">
                        {arrivalStatusLabels[row.original.forecastArrivalStatus] ||
                          row.original.forecastArrivalStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Status Emplacamento
                      </p>
                      <p className="text-sm">
                        {row.original.registrationStatus
                          ? registrationStatusLabels[row.original.registrationStatus] ||
                            row.original.registrationStatus
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Data Emplacamento
                      </p>
                      <p className="text-sm">
                        {row.original.registrationDate
                          ? format(new Date(row.original.registrationDate), "dd/MM/yyyy")
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Cliente
                      </p>
                      <p className="text-sm">
                        {row.original.client ? (
                          <span className="font-medium">
                            {row.original.client.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </TableCell>
          </TableRow>
        </>
      </Collapsible>
    );
  })}
</TableBody>
```

### 5. Nota sobre `asChild`
O `<Collapsible asChild>` renderiza como o elemento filho. Usando `<>` (Fragment) como filho pode não funcionar corretamente com `asChild` do Radix. Se houver problema, a alternativa é usar state manual sem o wrapper `<Collapsible>`:

```tsx
// Alternativa sem Collapsible wrapper
<TableRow>
  <TableCell colSpan={cellCount} className="p-0">
    {isOpen && (
      <div className="border-t bg-muted/30 px-6 py-4 animate-in slide-in-from-top-1 duration-200">
        {/* expanded content */}
      </div>
    )}
  </TableCell>
</TableRow>
```

## Verificação
- Rodar `npm run lint` e `npm run typecheck` após as alterações
- Testar visualmente: clicar na linha deve expandir/colapsar
- Verificar que o ícone ChevronRight rotaciona corretamente
- Verificar que a paginação continua funcionando
