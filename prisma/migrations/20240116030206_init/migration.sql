-- CreateTable
CREATE TABLE "SocialMenuOptions" (
    "id" TEXT NOT NULL,
    "menuOption" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "href" TEXT NOT NULL,
    "iconComponentName" TEXT NOT NULL,
    "iconClassName" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMenuOptions_pkey" PRIMARY KEY ("id")
);
