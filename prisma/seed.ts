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

// Base de dados de modelos da Honda para variação
const hondaModels = [
  "Honda CG 160 Titan",
  "Honda CG 160 Fan",
  "Honda CG 160 Start",
  "Honda Biz 125",
  "Honda Biz 110i",
  "Honda Pop 110i ES",
  "Honda CB 300F Twister",
  "Honda NXR 160 Bros",
  "Honda XRE 190",
  "Honda XRE 300 Sahara",
  "Honda CRF 250F",
  "Honda PCX 160",
  "Honda ADV",
  "Honda Elite 125",
  "Honda CB 500X",
  "Honda CB 500F",
  "Honda NX 500",
  "Honda NC 750X",
  "Honda CB 650R",
  "Honda CBR 650R",
  "Honda CB 750 Hornet",
  "Honda CB 1000R",
  "Honda CBR 1000RR-R Fireblade",
  "Honda XL 750 Transalp",
  "Honda CRF 1100L Africa Twin",
  "Honda X-ADV 750",
  "Honda Forza 350",
  "Honda Gold Wing Tour",
  "Honda Rebel 500",
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

// Gerador dinâmico de 200 motocicletas
function generate200Motorcycles() {
  return Array.from({ length: 200 }).map((_, index) => {
    const idSequence = index + 100; // Começa no 100 para evitar conflitos de chassi anteriores
    const chassi = `93HMCG130TA1${String(idSequence).padStart(5, "0")}`;
    const model = hondaModels[Math.floor(Math.random() * hondaModels.length)];
    const forecastArrivalStatus =
      arrivalStatuses[Math.floor(Math.random() * arrivalStatuses.length)];

    // Regras lógicas para datas e emplacamento
    let forecastArrival: Date | null = new Date("2026-08-01");
    forecastArrival.setDate(
      forecastArrival.getDate() + Math.floor(Math.random() * 30),
    );

    let registrationStatus: RegistrationStatus | null =
      RegistrationStatus.NO_PLATE;
    let registrationDate: Date | null = null;

    if (forecastArrivalStatus === ArrivalStatus.ARRIVED) {
      registrationStatus =
        registrationStatuses[
          Math.floor(Math.random() * registrationStatuses.length)
        ];
      if (registrationStatus === RegistrationStatus.PLATED) {
        registrationDate = new Date(forecastArrival);
        registrationDate.setDate(
          registrationDate.getDate() + Math.floor(Math.random() * 5),
        );
      }
    } else if (forecastArrivalStatus === ArrivalStatus.NO_INFORMATION) {
      forecastArrival = null;
    }

    return {
      chassi,
      model,
      forecastArrival,
      forecastArrivalStatus,
      registrationStatus,
      registrationDate,
    };
  });
}

async function main() {
  const motorcycles = generate200Motorcycles();

  console.log(`Starting seed process for ${motorcycles.length} motorcycles...`);

  for (const bike of motorcycles) {
    const existing = await prisma.motorcycle.findUnique({
      where: { chassi: bike.chassi },
    });

    if (!existing) {
      await prisma.motorcycle.create({ data: bike });
      console.log(`Created motorcycle: ${bike.model} (Chassi: ${bike.chassi})`);
    } else {
      console.log(`Motorcycle already exists: ${bike.chassi}`);
    }
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
