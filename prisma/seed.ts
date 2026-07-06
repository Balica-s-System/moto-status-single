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

const motorcycles = [
  {
    chassi: "93HMCG130TA123466",
    model: "Honda Elite 125",
    forecastArrival: new Date("2026-08-01"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG131TA123467",
    model: "Honda NXR 160 Bros",
    forecastArrival: new Date("2026-08-03"),
    forecastArrivalStatus: ArrivalStatus.DELAYED,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG132TA123468",
    model: "Honda CB 650R",
    forecastArrival: new Date("2026-08-05"),
    forecastArrivalStatus: ArrivalStatus.ARRIVED,
    registrationStatus: RegistrationStatus.PLATED,
    registrationDate: new Date("2026-08-02"),
  },
  {
    chassi: "93HMCG133TA123469",
    model: "Honda CBR 650R",
    forecastArrival: new Date("2026-08-06"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG134TA123470",
    model: "Honda CB 500F",
    forecastArrival: new Date("2026-08-07"),
    forecastArrivalStatus: ArrivalStatus.ARRIVED,
    registrationStatus: RegistrationStatus.PLATED,
    registrationDate: new Date("2026-08-04"),
  },
  {
    chassi: "93HMCG135TA123471",
    model: "Honda NX 500",
    forecastArrival: new Date("2026-08-09"),
    forecastArrivalStatus: ArrivalStatus.DELAYED,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG136TA123472",
    model: "Honda CRF 250F",
    forecastArrival: new Date("2026-08-10"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG137TA123473",
    model: "Honda CRF 1100L Africa Twin Adventure Sports",
    forecastArrival: new Date("2026-08-12"),
    forecastArrivalStatus: ArrivalStatus.ARRIVED,
    registrationStatus: RegistrationStatus.PLATED,
    registrationDate: new Date("2026-08-08"),
  },
  {
    chassi: "93HMCG138TA123474",
    model: "Honda X-ADV 750",
    forecastArrival: new Date("2026-08-13"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: null,
    registrationDate: null,
  },
  {
    chassi: "93HMCG139TA123475",
    model: "Honda Forza 350",
    forecastArrival: new Date("2026-08-15"),
    forecastArrivalStatus: ArrivalStatus.DELAYED,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG140TA123476",
    model: "Honda CB 1000R",
    forecastArrival: new Date("2026-08-17"),
    forecastArrivalStatus: ArrivalStatus.ARRIVED,
    registrationStatus: RegistrationStatus.PLATED,
    registrationDate: new Date("2026-08-12"),
  },
  {
    chassi: "93HMCG141TA123477",
    model: "Honda CBR 1000RR-R Fireblade",
    forecastArrival: new Date("2026-08-18"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG142TA123478",
    model: "Honda Gold Wing Tour",
    forecastArrival: new Date("2026-08-20"),
    forecastArrivalStatus: ArrivalStatus.ARRIVED,
    registrationStatus: RegistrationStatus.PLATED,
    registrationDate: new Date("2026-08-15"),
  },
  {
    chassi: "93HMCG143TA123479",
    model: "Honda Rebel 500",
    forecastArrival: new Date("2026-08-21"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG144TA123480",
    model: "Honda Shadow Phantom",
    forecastArrival: new Date("2026-08-23"),
    forecastArrivalStatus: ArrivalStatus.DELAYED,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG145TA123481",
    model: "Honda NC750X",
    forecastArrival: new Date("2026-08-24"),
    forecastArrivalStatus: ArrivalStatus.ARRIVED,
    registrationStatus: RegistrationStatus.PLATED,
    registrationDate: new Date("2026-08-19"),
  },
  {
    chassi: "93HMCG146TA123482",
    model: "Honda CBR 500R",
    forecastArrival: new Date("2026-08-26"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG147TA123483",
    model: "Honda XR 300 Tornado",
    forecastArrival: new Date("2026-08-28"),
    forecastArrivalStatus: ArrivalStatus.DELAYED,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
  {
    chassi: "93HMCG148TA123484",
    model: "Honda CG 160 Start",
    forecastArrival: new Date("2026-08-29"),
    forecastArrivalStatus: ArrivalStatus.ARRIVED,
    registrationStatus: RegistrationStatus.PLATED,
    registrationDate: new Date("2026-08-25"),
  },
  {
    chassi: "93HMCG149TA123485",
    model: "Honda CB 750 Hornet",
    forecastArrival: new Date("2026-08-31"),
    forecastArrivalStatus: ArrivalStatus.NO_INFORMATION,
    registrationStatus: RegistrationStatus.NO_PLATE,
    registrationDate: null,
  },
];
async function main() {
  for (const bike of motorcycles) {
    const existing = await prisma.motorcycle.findUnique({
      where: { chassi: bike.chassi },
    });

    if (!existing) {
      await prisma.motorcycle.create({ data: bike });
      console.log(`Created motorcycle: ${bike.model}`);
    } else {
      console.log(`Motorcycle already exists: ${bike.chassi}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
