import { formatDocument } from "@/lib/format";
import {
  arrivalStatusLabels,
  arrivalStatusVariants,
  registrationStatusLabels,
  registrationStatusVariants,
} from "@/app/(dashboard)/management/inventory/_types/motorcycleStatusLabels";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClientSearchResult } from "../_types/cpfSearchSchema";

type ResultCardProps = {
  client: ClientSearchResult;
};

const ResultCard = ({ client }: ResultCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
        <CardDescription>{formatDocument(client.cpf)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Cidade:</span>{" "}
            <span className="font-medium">{client.city}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Vendedor:</span>{" "}
            <span className="font-medium">{client.sellersName}</span>
          </div>
        </div>

        {client.motorcycles.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">
              Motos ({client.motorcycles.length})
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Chassi</TableHead>
                  <TableHead>Chegada</TableHead>
                  <TableHead>Placa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.motorcycles.map((moto) => (
                  <TableRow key={moto.id}>
                    <TableCell className="font-medium">{moto.model}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {moto.chassi}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          arrivalStatusVariants[moto.forecastArrivalStatus] ??
                          "secondary"
                        }
                      >
                        {arrivalStatusLabels[moto.forecastArrivalStatus] ??
                          moto.forecastArrivalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {moto.registrationStatus ? (
                        <Badge
                          variant={
                            registrationStatusVariants[
                              moto.registrationStatus
                            ] ?? "outline"
                          }
                        >
                          {registrationStatusLabels[moto.registrationStatus] ??
                            moto.registrationStatus}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {client.motorcycles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma moto vinculada a este cliente.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export { ResultCard };
