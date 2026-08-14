-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('NARRATEUR', 'AIDANT', 'LECTEUR');

-- CreateEnum
CREATE TYPE "DatePrecision" AS ENUM ('EXACTE', 'APPROXIMATIVE', 'RELATIVE', 'INCONNUE');

-- CreateEnum
CREATE TYPE "UploadState" AS ENUM ('LOCAL', 'EN_ATTENTE', 'EN_COURS', 'ENVOYE', 'ECHEC');

-- CreateEnum
CREATE TYPE "TranscriptionState" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'TERMINEE', 'ECHEC', 'SILENCE_DETECTE');

-- CreateEnum
CREATE TYPE "FragmentSpeaker" AS ENUM ('NARRATEUR', 'AIDANT');

-- CreateEnum
CREATE TYPE "SuggestionSource" AS ENUM ('JALON', 'PERSONNE', 'CREUX_CHRONO', 'QUESTION_SENSORIELLE');

-- CreateEnum
CREATE TYPE "SuggestionState" AS ENUM ('PROPOSEE', 'RETENUE', 'IGNOREE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "InvitationRole" AS ENUM ('LECTEUR', 'AIDANT');

-- CreateEnum
CREATE TYPE "InvitationState" AS ENUM ('ENVOYEE', 'ACCEPTEE', 'REVOQUEE');

-- CreateEnum
CREATE TYPE "PrintOrderState" AS ENUM ('BROUILLON', 'BAT_VALIDE', 'PAYE', 'TRANSMIS', 'EN_PRODUCTION', 'EXPEDIE', 'LIVRE');

-- CreateEnum
CREATE TYPE "ConsentKind" AS ENUM ('TRAITEMENT_VOCAL', 'CGU', 'CONSERVATION_ILLIMITEE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'NARRATEUR',
    "helperEmail" TEXT,
    "helperName" TEXT,
    "beneficiaryName" TEXT,
    "beneficiaryEmail" TEXT,
    "textSizePx" INTEGER NOT NULL DEFAULT 22,
    "deletionRequestedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRecovery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedByEmail" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "seenByNarratorAt" TIMESTAMP(3),

    CONSTRAINT "AccessRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "dedication" TEXT,
    "coverUrl" TEXT,
    "onboardingStartedAt" TIMESTAMP(3),
    "onboardingSkippedAt" TIMESTAMP(3),
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "kind" TEXT,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "precision" "DatePrecision" NOT NULL DEFAULT 'INCONNUE',
    "relativeToId" TEXT,
    "relativeOffsetY" INTEGER,
    "placeId" TEXT,
    "setAsideAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "mentions" INTEGER NOT NULL DEFAULT 0,
    "setAsideAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "setAsideAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "milestoneId" TEXT,
    "printed" BOOLEAN NOT NULL DEFAULT true,
    "setAsideAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "blobUrl" TEXT,
    "durationMs" INTEGER,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "uploadState" "UploadState" NOT NULL DEFAULT 'LOCAL',
    "uploadedBytes" INTEGER NOT NULL DEFAULT 0,
    "totalBytes" INTEGER,
    "transcriptionState" "TranscriptionState" NOT NULL DEFAULT 'EN_ATTENTE',
    "transcriptionError" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "peakLevel" DOUBLE PRECISION,
    "silentAudio" BOOLEAN NOT NULL DEFAULT false,
    "autoStopped" BOOLEAN NOT NULL DEFAULT false,
    "interviewMode" BOOLEAN NOT NULL DEFAULT false,
    "setAsideAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fragment" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "recordingId" TEXT NOT NULL,
    "orderInRec" INTEGER NOT NULL,
    "startMs" INTEGER,
    "endMs" INTEGER,
    "rawText" TEXT NOT NULL,
    "readableText" TEXT,
    "editedText" TEXT,
    "improvedAt" TIMESTAMP(3),
    "editedAt" TIMESTAMP(3),
    "chapterId" TEXT,
    "orderInChapter" INTEGER,
    "placementOfferedAt" TIMESTAMP(3),
    "placementRefusedAt" TIMESTAMP(3),
    "speaker" "FragmentSpeaker" NOT NULL DEFAULT 'NARRATEUR',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "setAsideAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fragment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "blobUrl" TEXT NOT NULL,
    "caption" TEXT,
    "yearEstimate" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "fragmentId" TEXT,
    "chapterId" TEXT,
    "milestoneId" TEXT,
    "setAsideAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DictionaryEntry" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "heard" TEXT NOT NULL,
    "corrected" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DictionaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "source" "SuggestionSource" NOT NULL,
    "state" "SuggestionState" NOT NULL DEFAULT 'PROPOSEE',
    "shownCount" INTEGER NOT NULL DEFAULT 0,
    "lastShownAt" TIMESTAMP(3),
    "milestoneId" TEXT,
    "personId" TEXT,
    "gapStartYear" INTEGER,
    "gapEndYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "InvitationRole" NOT NULL DEFAULT 'LECTEUR',
    "token" TEXT NOT NULL,
    "state" "InvitationState" NOT NULL DEFAULT 'ENVOYEE',
    "acceptedAt" TIMESTAMP(3),
    "acceptedByUserId" TEXT,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dictationEndsAt" TIMESTAMP(3),
    "includedCopiesRemaining" INTEGER NOT NULL DEFAULT 0,
    "extraOptions" JSONB NOT NULL DEFAULT '{}',
    "stripePaymentIntentId" TEXT,
    "purchasedByEmail" TEXT,
    "purchasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "purchasedByEmail" TEXT NOT NULL,
    "purchasedByName" TEXT,
    "giftMessage" TEXT,
    "redeemedByUserId" TEXT,
    "redeemedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ConsentKind" NOT NULL,
    "text" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintOrder" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "state" "PrintOrderState" NOT NULL DEFAULT 'BROUILLON',
    "batValidatedAt" TIMESTAMP(3),
    "batValidatedBy" TEXT,
    "archivedPdfUrl" TEXT,
    "pageCount" INTEGER,
    "volumeIndex" INTEGER NOT NULL DEFAULT 1,
    "stripePaymentIntentId" TEXT,
    "partnerRef" TEXT,
    "totalCents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrintOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintRecipient" (
    "id" TEXT NOT NULL,
    "printOrderId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'FR',
    "copies" INTEGER NOT NULL DEFAULT 1,
    "personalMessage" TEXT,
    "trackingNumber" TEXT,
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "PrintRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "AccessRecovery_userId_requestedAt_idx" ON "AccessRecovery"("userId", "requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Book_userId_key" ON "Book"("userId");

-- CreateIndex
CREATE INDEX "Milestone_bookId_startYear_idx" ON "Milestone"("bookId", "startYear");

-- CreateIndex
CREATE INDEX "Person_bookId_idx" ON "Person"("bookId");

-- CreateIndex
CREATE INDEX "Place_bookId_idx" ON "Place"("bookId");

-- CreateIndex
CREATE INDEX "Chapter_bookId_order_idx" ON "Chapter"("bookId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Recording_localId_key" ON "Recording"("localId");

-- CreateIndex
CREATE INDEX "Recording_bookId_recordedAt_idx" ON "Recording"("bookId", "recordedAt");

-- CreateIndex
CREATE INDEX "Recording_transcriptionState_idx" ON "Recording"("transcriptionState");

-- CreateIndex
CREATE INDEX "Fragment_bookId_recordingId_orderInRec_idx" ON "Fragment"("bookId", "recordingId", "orderInRec");

-- CreateIndex
CREATE INDEX "Fragment_chapterId_orderInChapter_idx" ON "Fragment"("chapterId", "orderInChapter");

-- CreateIndex
CREATE INDEX "Photo_bookId_idx" ON "Photo"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryEntry_bookId_heard_key" ON "DictionaryEntry"("bookId", "heard");

-- CreateIndex
CREATE INDEX "Suggestion_bookId_state_lastShownAt_idx" ON "Suggestion"("bookId", "state", "lastShownAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_token_key" ON "Invitation"("token");

-- CreateIndex
CREATE INDEX "Invitation_bookId_state_idx" ON "Invitation"("bookId", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Entitlement_userId_key" ON "Entitlement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Entitlement_stripePaymentIntentId_key" ON "Entitlement"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivationCode_code_key" ON "ActivationCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ActivationCode_stripePaymentIntentId_key" ON "ActivationCode"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Consent_userId_kind_idx" ON "Consent"("userId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "PrintOrder_stripePaymentIntentId_key" ON "PrintOrder"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "PrintOrder_bookId_state_idx" ON "PrintOrder"("bookId", "state");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRecovery" ADD CONSTRAINT "AccessRecovery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_relativeToId_fkey" FOREIGN KEY ("relativeToId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fragment" ADD CONSTRAINT "Fragment_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_fragmentId_fkey" FOREIGN KEY ("fragmentId") REFERENCES "Fragment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DictionaryEntry" ADD CONSTRAINT "DictionaryEntry_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_acceptedByUserId_fkey" FOREIGN KEY ("acceptedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintRecipient" ADD CONSTRAINT "PrintRecipient_printOrderId_fkey" FOREIGN KEY ("printOrderId") REFERENCES "PrintOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
