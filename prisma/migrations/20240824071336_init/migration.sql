-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "bitrix_id" INTEGER NOT NULL,
    "expires" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bitrixs" (
    "id" SERIAL NOT NULL,
    "member_id" TEXT NOT NULL,
    "application_token" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "domain" TEXT NOT NULL,
    "server_endpoint" TEXT NOT NULL,
    "client_endpoint" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bitrixs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accept_codes" (
    "id" SERIAL NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "accept_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_bitrix_id_key" ON "tokens"("bitrix_id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_access_token_key" ON "tokens"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_refresh_token_key" ON "tokens"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "bitrixs_application_token_key" ON "bitrixs"("application_token");

-- CreateIndex
CREATE UNIQUE INDEX "bitrixs_client_id_key" ON "bitrixs"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "accept_codes_client_id_created_at_key" ON "accept_codes"("client_id", "created_at");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_bitrix_id_fkey" FOREIGN KEY ("bitrix_id") REFERENCES "bitrixs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
