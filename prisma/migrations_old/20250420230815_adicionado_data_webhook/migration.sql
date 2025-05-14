-- CreateTable
CREATE TABLE "DataWebhook" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataWebhook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DataWebhook" ADD CONSTRAINT "DataWebhook_id_fkey" FOREIGN KEY ("id") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
