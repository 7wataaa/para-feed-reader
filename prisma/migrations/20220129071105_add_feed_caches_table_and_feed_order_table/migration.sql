-- CreateTable
CREATE TABLE "feedcaches" (
    "id" UUID NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "cache" TEXT NOT NULL,

    CONSTRAINT "feedcaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedorder" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "feedIdOrder" TEXT[],

    CONSTRAINT "feedorder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feedcaches_url_key" ON "feedcaches"("url");

-- CreateIndex
CREATE UNIQUE INDEX "feedorder_userId_key" ON "feedorder"("userId");

-- AddForeignKey
ALTER TABLE "feedcaches" ADD CONSTRAINT "feedcaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedorder" ADD CONSTRAINT "feedorder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
