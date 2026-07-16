import "dotenv/config";
import {
  ArrivalStatus,
  PrismaClient,
  RegistrationStatus,
} from "$/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface HondaModel {
  model: string;
  year: number;
}

const hondaModels: HondaModel[] = [
  { model: "Honda CG 160 Start", year: 2026 },
  { model: "Honda CG 160 Fan", year: 2026 },
  { model: "Honda CG 160 Titan", year: 2026 },
  { model: "Honda CG 160 Cargo", year: 2026 },
  { model: "Honda Pop 110i", year: 2026 },
  { model: "Honda Biz 125 ES", year: 2025 },
  { model: "Honda Biz 125 EX", year: 2025 },
  { model: "Honda Elite 125", year: 2026 },
  { model: "Honda PCX 160 CBS", year: 2026 },
  { model: "Honda PCX 160 ABS", year: 2026 },
  { model: "Honda PCX 160 DLX ABS", year: 2026 },
  { model: "Honda ADV 160", year: 2026 },
  { model: "Honda X-ADV", year: 2025 },
  { model: "Honda CB 300F Twister", year: 2026 },
  { model: "Honda CB 300F Twister ABS", year: 2026 },
  { model: "Honda CB 500 Hornet", year: 2026 },
  { model: "Honda CB 650R E-Clutch", year: 2026 },
  { model: "Honda CB 750 Hornet", year: 2026 },
  { model: "Honda CB 1000R", year: 2026 },
  { model: "Honda CB 1000R Black Edition", year: 2026 },
  { model: "Honda NXR 160 Bros CBS", year: 2026 },
  { model: "Honda NXR 160 Bros ABS", year: 2026 },
  { model: "Honda XR 300L Tornado", year: 2026 },
  { model: "Honda Sahara 300", year: 2026 },
  { model: "Honda Sahara 300 Rally", year: 2026 },
  { model: "Honda Sahara 300 Adventure", year: 2026 },
  { model: "Honda XRE 190 Standard", year: 2026 },
  { model: "Honda XRE 190 Adventure", year: 2026 },
  { model: "Honda NX 500", year: 2026 },
  { model: "Honda NC 750X MT", year: 2026 },
  { model: "Honda NC 750X DCT", year: 2026 },
  { model: "Honda XL 750 Transalp", year: 2026 },
  { model: "Honda CRF 1100L Africa Twin MT", year: 2026 },
  { model: "Honda CRF 1100L Africa Twin Adventure DCT ES", year: 2026 },
  { model: "Honda CRF 1100L Africa Twin Adventure Sports DCT ES", year: 2026 },
  { model: "Honda CRF 300F", year: 2026 },
  { model: "Honda CRF 250R", year: 2025 },
  { model: "Honda CRF 450R", year: 2025 },
  { model: "Honda CBR 1000RR-R Fireblade SP", year: 2024 },
  { model: "Honda GL 1800 Gold Wing Tour", year: 2026 },
];

const arrivalStatuses = [
  ArrivalStatus.NO_INFORMATION,
  ArrivalStatus.DELAYED,
  ArrivalStatus.ARRIVED,
];

const registrationStatuses = [
  RegistrationStatus.NO_PLATE,
  RegistrationStatus.PLATING,
  RegistrationStatus.PLATED,
];

const clientNames = [
  "João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa",
  "Carlos Souza", "Juliana Lima", "Fernando Pereira", "Amanda Carvalho",
  "Rafael Almeida", "Beatriz Rodrigues", "Lucas Martins", "Camila Barbosa",
  "Marcos Rocha", "Larissa Gomes", "Thiago Ribeiro", "Isabela Correia",
  "Diego Moreira", "Gabriela Fernandes", "Bruno Teixeira", "Patrícia Azevedo",
  "Felipe Cardoso", "Mariana Dias", "Eduardo Freitas", "Letícia Nogueira",
  "Gustavo Castro", "Vanessa Lopes", "André Campos", "Roberta Farias",
  "Ricardo Braga", "Tatiana Vargas",
];

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador",
  "Fortaleza", "Brasília", "Curitiba", "Manaus",
  "Recife", "Porto Alegre", "Goiânia", "Campinas",
  "São Luís", "Maceió", "Natal", "Teresina",
  "João Pessoa", "Ribeirão Preto", "Uberlândia", "Sorocaba",
];

const sellerNames = [
  "Carlos Vendedor", "Ana Vendas", "Roberto Negócios",
  "Patrícia Comercial", "Fernando Atendimento",
];

function generateCPF(): string {
  const n1 = Math.floor(Math.random() * 10);
  const n2 = Math.floor(Math.random() * 10);
  const n3 = Math.floor(Math.random() * 10);
  const n4 = Math.floor(Math.random() * 10);
  const n5 = Math.floor(Math.random() * 10);
  const n6 = Math.floor(Math.random() * 10);
  const n7 = Math.floor(Math.random() * 10);
  const n8 = Math.floor(Math.random() * 10);
  const n9 = Math.floor(Math.random() * 10);

  const d1 = (n1 * 10 + n2 * 9 + n3 * 8 + n4 * 7 + n5 * 6 + n6 * 5 + n7 * 4 + n8 * 3 + n9 * 2) % 11;
  const digit1 = d1 < 2 ? 0 : 11 - d1;

  const d2 = (n1 * 11 + n2 * 10 + n3 * 9 + n4 * 8 + n5 * 7 + n6 * 6 + n7 * 5 + n8 * 4 + n9 * 3 + digit1 * 2) % 11;
  const digit2 = d2 < 2 ? 0 : 11 - d2;

  return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${digit1}${digit2}`;
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function generateMotorcycle(idSequence: number) {
  const chassi = `93HMCG130TA1${String(idSequence).padStart(5, "0")}`;
  const modelEntry = pick(hondaModels);
  const forecastArrivalStatus = pick(arrivalStatuses);

  let forecastArrival: Date | null = new Date("2026-08-01");
  forecastArrival.setDate(forecastArrival.getDate() + Math.floor(Math.random() * 30));

  let registrationStatus: RegistrationStatus | null = RegistrationStatus.NO_PLATE;
  let registrationDate: Date | null = null;

  if (forecastArrivalStatus === ArrivalStatus.ARRIVED) {
    registrationStatus = pick(registrationStatuses);
    if (registrationStatus === RegistrationStatus.PLATED) {
      registrationDate = new Date(forecastArrival);
      registrationDate.setDate(registrationDate.getDate() + Math.floor(Math.random() * 5));
    }
  } else if (forecastArrivalStatus === ArrivalStatus.NO_INFORMATION) {
    forecastArrival = null;
  }

  return {
    chassi,
    model: modelEntry.model,
    forecastArrival,
    forecastArrivalStatus,
    registrationStatus,
    registrationDate,
    year: modelEntry.year,
  };
}

function generateClient(index: number) {
  const billingChance = Math.random();
  return {
    name: clientNames[index],
    cpf: generateCPF(),
    city: pick(cities),
    sellersName: pick(sellerNames),
    billingDate: billingChance < 0.4
      ? new Date("2026-07-01")
      : null,
  };
}

async function main() {
  console.log("Cleaning existing data...");
  await prisma.motorcycle.deleteMany();
  await prisma.client.deleteMany();

  const TOTAL_CLIENTS = 30;
  const TOTAL_MOTORCYCLES = 60;

  console.log(`Seeding ${TOTAL_CLIENTS} clients...`);
  const createdClients = await Promise.all(
    Array.from({ length: TOTAL_CLIENTS }).map((_, i) =>
      prisma.client.create({ data: generateClient(i) }),
    ),
  );
  console.log(`Created ${createdClients.length} clients.`);

  console.log(`Seeding ${TOTAL_MOTORCYCLES} motorcycles with clients...`);

  for (let i = 0; i < TOTAL_MOTORCYCLES; i++) {
    const bike = generateMotorcycle(i + 1);
    const client = pick(createdClients);
    await prisma.motorcycle.create({ data: { ...bike, clientId: client.id } });
    console.log(`Created motorcycle: ${bike.model} (Chassi: ${bike.chassi}) -> ${client.name}`);
  }

  console.log("Seed process completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
