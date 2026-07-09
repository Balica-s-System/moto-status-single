# Plano: Collapsible Row na Clients Table

## Objetivo
Mesmo padrão da inventory table — adicionar linhas expansíveis com `Collapsible` do shadcn. Ao clicar na linha, expande mostrando a **lista de motos** do cliente (modelo + chassi).

## Arquivo a modificar
`src/app/(dashboard)/admin/management/clients/_components/clients-table.tsx`

## Colunas da tabela principal (mantidas todas as existentes)
1. **Toggle** (novo) — ChevronRight que rotaciona ao expandir
2. **Nome** (existente)
3. **CPF / CNPJ** (existente)
4. **Cidade** (existente)
5. **Vendedor** (existente)
6. **Data Fat.** (existente)
7. **Motos** (existente — mantém o count)
8. **Ações** (existente)

Nenhuma coluna é removida — a lista de motos é informação adicional.

## Conteúdo expandido
Lista das motos associadas ao cliente (`_motorcycles: [{id, chassi, model}]`):
- Cada moto mostra: **Modelo** + **Chassi** (com ClickToCopy)
- Se não tem motos: mensagem "Nenhuma moto associada"
- Layout: grid responsivo ou lista compacta

```
┌─────────────────────────────────────────────────────────┐
│  Motos associadas (3)                                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │ XRE 300  │ LB123456789012345                     │   │
│  │ FAN 160  │ LB987654321098765                     │   │
│  │ POP 110  │ LB112233445566778                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Alterações necessárias

### 1. Imports — adicionar:
```tsx
import { useState } from "react";  // adicionar ao import { useMemo }
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";  // adicionar ao import { Edit, Eye, Trash }
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

### 3. Colunas — adicionar coluna toggle como primeira coluna:
```tsx
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
```
Todas as colunas existentes permanecem inalteradas. Adicionar `openRows` ao array de deps do `useMemo`.

### 4. Table Body — renderizar Collapsible rows:
```tsx
<TableBody>
  {table.getRowModel().rows.map((row) => {
    const isOpen = openRows.has(row.id);
    const cellCount = row.getVisibleCells().length;
    const motorcycles = row.original._motorcycles ?? [];
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
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Motos associadas ({motorcycles.length})
                  </p>
                  {motorcycles.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {motorcycles.map((moto: any) => (
                        <div
                          key={moto.id}
                          className="flex items-center gap-3 rounded-md border bg-card px-3 py-2"
                        >
                          <span className="text-sm font-medium">
                            {moto.model}
                          </span>
                          <ClickToCopy text={moto.chassi}>
                            <span className="font-mono text-xs text-muted-foreground">
                              {moto.chassi}
                            </span>
                          </ClickToCopy>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma moto associada
                    </p>
                  )}
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

### 5. Nota sobre `asChild` com Fragment
Mesma nota da inventory table — se `<Collapsible asChild>` com `<>` não funcionar, usar alternativa sem wrapper:

```tsx
<TableRow>
  <TableCell colSpan={cellCount} className="p-0">
    {isOpen && (
      <div className="border-t bg-muted/30 px-6 py-4 animate-in slide-in-from-top-1 duration-200">
        {/* motorcycle list */}
      </div>
    )}
  </TableCell>
</TableRow>
```

## Verificação
- `npm run lint` e `npm run typecheck` sem erros
- Clicar na linha expande mostrando lista de motos
- ChevronRight rotaciona ao expandir
- Motos com ClickToCopy no chassi
- Paginação continua funcionando
- Clientes sem motos mostram mensagem adequada
