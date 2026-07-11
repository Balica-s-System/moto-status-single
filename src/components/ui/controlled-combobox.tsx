"use client";

import { useState, useCallback, useEffect } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, ChevronsUpDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/components/use-debounce";

export type ComboboxItem = {
  id: string;
  label: string;
  subtitle?: string;
};

type ControlledComboboxProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: ComboboxItem[];
  loading?: boolean;
  onSearch: (search: string) => void;
};

const ControlledCombobox = <T extends FieldValues>({
  name,
  label,
  placeholder = "Selecione...",
  searchPlaceholder = "Pesquisar...",
  options,
  loading = false,
  onSearch,
}: ControlledComboboxProps<T>) => {
  const { control } = useFormContext<T>();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
    },
    [],
  );

  return (
    <div className="w-full">
      <Label className="mb-2">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { value = [], onChange }, fieldState: { error } }) => {
          const selectedIds = (value as string[]) ?? [];
          const selectedItems = options.filter((opt) =>
            selectedIds.includes(opt.id),
          );

          const toggleItem = (id: string) => {
            const isSelected = selectedIds.includes(id);
            if (isSelected) {
              onChange(selectedIds.filter((v) => v !== id));
            } else {
              onChange([...selectedIds, id]);
            }
          };

          return (
            <>
              <Popover open={open} onOpenChange={setOpen} modal>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-8 py-1"
                    type="button"
                  >
                    <div className="flex flex-wrap gap-1 items-center">
                      {selectedItems.length > 0 ? (
                        selectedItems.map((item) => (
                          <Badge
                            key={item.id}
                            variant="secondary"
                            className="gap-1"
                          >
                            {item.label}
                            <span
                              role="button"
                              tabIndex={0}
                              className="ml-1 hover:text-foreground cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(item.id);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleItem(item.id);
                                }
                              }}
                            >
                              <X className="size-3" />
                            </span>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          {placeholder}
                        </span>
                      )}
                    </div>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2" align="start">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="border-0 focus-visible:ring-0 px-0 h-7"
                    />
                  </div>
                  <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                    {loading ? (
                      <p className="text-sm text-muted-foreground py-2 text-center">
                        Carregando...
                      </p>
                    ) : options.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2 text-center">
                        Nenhum item encontrado
                      </p>
                    ) : (
                      options.map((item) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={cn(
                              "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent",
                              isSelected && "bg-accent",
                            )}
                            onClick={() => toggleItem(item.id)}
                          >
                            <Check
                              className={cn(
                                "size-4 shrink-0",
                                isSelected
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{item.label}</span>
                              {item.subtitle && (
                                <span className="text-xs text-muted-foreground">
                                  {item.subtitle}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {!!error && (
                <p className="text-destructive text-sm mt-1">{error.message}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export { ControlledCombobox };
