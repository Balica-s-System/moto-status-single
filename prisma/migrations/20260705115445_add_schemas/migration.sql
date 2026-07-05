-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('NO_PLATE', 'PLATING', 'PLATED');

-- CreateEnum
CREATE TYPE "ArrivalStatus" AS ENUM ('DELAYED', 'ARRIVED', 'NO_INFORMATION');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "sellersName" TEXT NOT NULL,
    "billingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorcycles" (
    "id" TEXT NOT NULL,
    "chassi" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "forecastArrival" TIMESTAMP(3),
    "forecastArrivalStatus" "ArrivalStatus" NOT NULL DEFAULT 'NO_INFORMATION',
    "registrationStatus" "RegistrationStatus",
    "registrationDate" TIMESTAMP(3),
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_cpf_key" ON "clients"("cpf");

-- CreateIndex
CREATE INDEX "clients_updatedAt_idx" ON "clients"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "motorcycles_chassi_key" ON "motorcycles"("chassi");

-- CreateIndex
CREATE INDEX "motorcycles_updatedAt_idx" ON "motorcycles"("updatedAt");

-- AddForeignKey
ALTER TABLE "motorcycles" ADD CONSTRAINT "motorcycles_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
