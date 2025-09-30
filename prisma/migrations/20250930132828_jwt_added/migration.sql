-- CreateTable
CREATE TABLE "public"."Authentication" (
    "userId" TEXT NOT NULL,
    "jwt" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL,

    CONSTRAINT "Authentication_pkey" PRIMARY KEY ("userId","jwt")
);

-- AddForeignKey
ALTER TABLE "public"."Authentication" ADD CONSTRAINT "Authentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
