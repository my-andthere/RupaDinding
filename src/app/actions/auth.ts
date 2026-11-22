"use server";

import { redirect } from "next/navigation";
import { loginAdmin, createSession, destroySession } from "@/lib/auth";

export type LoginState = { ok: boolean; message: string };

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { ok: false, message: "Email dan password wajib diisi." };
  }

  const user = await loginAdmin(email, password);
  if (!user) {
    return { ok: false, message: "Email atau password tidak sesuai." };
  }

  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
