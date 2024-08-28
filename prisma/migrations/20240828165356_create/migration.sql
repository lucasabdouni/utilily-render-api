-- CreateTable
CREATE TABLE "Customer" (
    "customer_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "measures" (
    "measure_uuid" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customer_code" TEXT,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("measure_uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_code_key" ON "Customer"("customer_code");

-- AddForeignKey
ALTER TABLE "measures" ADD CONSTRAINT "measures_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customer"("customer_code") ON DELETE SET NULL ON UPDATE CASCADE;
