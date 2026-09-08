import { randomUUID } from "crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { PERMISSIONS } from "@/application/authz";
import {
  getGeneralSettings,
  updateGeneralSettings,
} from "@/application/settings/general";
import { requireApiPermission } from "@/lib/admin/requireApiPermission";
import { isStaticContentMode } from "@/lib/content-mode";

const GeneralSettingsSchema = z.object({
  email: z.string().email(),
  linkedin: z.string().min(1),
  github: z.string().min(1),
  twitter: z.string().min(1),
  telegram: z.string().min(1),
  calendly: z.string().min(1),
  whatsapp: z.string().min(1),
});

export const GET = async (request: NextRequest) => {
  const adminEmail = await requireApiPermission(
    request.headers,
    PERMISSIONS.SETTINGS_MANAGE
  );

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  if (isStaticContentMode()) {
    return NextResponse.json(
      { ok: false, error: "read_only" },
      { status: 403 }
    );
  }

  const settings = await getGeneralSettings();

  return NextResponse.json({
    ok: true,
    settings,
  });
};

export const PUT = async (request: NextRequest) => {
  const adminEmail = await requireApiPermission(
    request.headers,
    PERMISSIONS.SETTINGS_MANAGE
  );

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = GeneralSettingsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  await updateGeneralSettings(parsed.data);

  return NextResponse.json({ ok: true, requestId: randomUUID() });
};
