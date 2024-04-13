-- CreateEnum
CREATE TYPE "CHAIN" AS ENUM ('Sepolia', 'Holesky');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('Issued', 'Deposited', 'Sent', 'Finished', 'Expired');

-- CreateTable
CREATE TABLE "Transaction" (
    "key" VARCHAR(66) NOT NULL,
    "status" "STATUS" NOT NULL,
    "fromChain" "CHAIN" NOT NULL,
    "toChain" "CHAIN" NOT NULL,
    "depositAddress" VARCHAR(42),
    "toAddress" VARCHAR(42) NOT NULL,
    "amountIn" BIGINT NOT NULL,
    "amountOut" BIGINT NOT NULL,
    "sendingTx" TEXT,
    "issuedTime" BIGINT NOT NULL,
    "expireTime" BIGINT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Pool" (
    "chain" "CHAIN" NOT NULL,
    "amount" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("chain")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_key_key" ON "Transaction"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Pool_chain_key" ON "Pool"("chain");
