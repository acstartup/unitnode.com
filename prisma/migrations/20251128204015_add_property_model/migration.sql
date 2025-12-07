-- CreateTable
CREATE TABLE "public"."Property" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mainTenant" TEXT NOT NULL DEFAULT 'N/A',
    "rent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "occupied" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "public"."Property"("userId");

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
