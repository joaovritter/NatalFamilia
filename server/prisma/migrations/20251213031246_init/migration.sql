-- CreateTable
CREATE TABLE "christmas_sites" (
    "id" VARCHAR(21) NOT NULL,
    "familyName" VARCHAR(100) NOT NULL,
    "message" VARCHAR(2000) NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "price" DOUBLE PRECISION NOT NULL,
    "mp_preference_id" TEXT NOT NULL,
    "mp_payment_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "christmas_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "mp_payment_id" TEXT,
    "status" TEXT,
    "qr_code" TEXT,
    "qr_code_base64" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "families" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "payment_id" INTEGER,
    "photos" TEXT NOT NULL,
    "message" VARCHAR(2000),
    "wishes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "christmas_sites_paymentStatus_idx" ON "christmas_sites"("paymentStatus");

-- CreateIndex
CREATE INDEX "christmas_sites_mp_preference_id_idx" ON "christmas_sites"("mp_preference_id");

-- CreateIndex
CREATE INDEX "christmas_sites_createdAt_idx" ON "christmas_sites"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "payments_mp_payment_id_key" ON "payments"("mp_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "families_name_key" ON "families"("name");

-- AddForeignKey
ALTER TABLE "families" ADD CONSTRAINT "families_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
