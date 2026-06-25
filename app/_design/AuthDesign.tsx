"use client";

// Auth surface rebuilt DIRECTLY on the gigly_full_design prototype's own markup (Auth.dc.html — the login view
// lines 18-48 + the 3-step onboarding lines 50-168). Inline styles ported so the design's tokens/fonts resolve via
// app/_design/tokens.css. One component, the design's `view: 'login' | 'onboarding'` state machine; the two-phase
// registration (account at step 2 «Зарегистрироваться» → profile setup at step 3 «Продолжить») is wired to the real
// loginUser / registerUser / updateProfile actions. Replaces the legacy /login + the kit /auth + RegisterWizard.

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/app/actions/auth";
import { updateProfile } from "@/app/actions/profile";
import { SPECIALIZATIONS, TIMEZONES } from "@/lib/profiles";
import "./tokens.css";

type View = "login" | "onboarding";
type Role = "CLIENT" | "SPECIALIST";

const SANS = "'SF Compact',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";
const MONO = "'Handjet',monospace";
const GROTESK = "'Manrope',sans-serif";

export function AuthDesign({ initialView }: { initialView: View }) {
  const [view, setView] = useState<View>(initialView);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<Role | null>(null);

  const [loginState, loginAction] = useActionState(loginUser, null);
  const [registerState, registerAction] = useActionState(registerUser, null);
  const [profileState, profileAction] = useActionState(updateProfile, null);

  // step-2 «Зарегистрироваться» created the account (auto-logged-in) → advance to step-3 setup.
  useEffect(() => {
    if (registerState?.ok) setStep(3);
  }, [registerState]);

  // step-2 confirm-password match (client-side, mirrors the action's server check)
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && pass !== confirm;

  const goLogin = () => {
    setView("login");
    setStep(1);
  };
  const goRegister = () => {
    setView("onboarding");
    setStep(1);
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "var(--surface-app)",
        overflow: "hidden",
        color: "var(--text-1)",
        fontFamily: SANS,
      }}
    >
      {/* GIGLY wordmark (top-left) */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 50,
          zIndex: 5,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
          color: "var(--text-1)",
        }}
      >
        GIGLY
      </div>

      {view === "login" && <LoginView action={loginAction} error={loginState?.error} onCreateAccount={goRegister} />}

      {view === "onboarding" && step === 1 && (
        <OnboardingStep1
          onPick={(r) => {
            setRole(r);
            setStep(2);
          }}
        />
      )}

      {view === "onboarding" && step === 2 && (
        <OnboardingStep2
          action={registerAction}
          role={role}
          error={registerState?.error}
          pass={pass}
          confirm={confirm}
          mismatch={mismatch}
          onPass={setPass}
          onConfirm={setConfirm}
          onLogin={goLogin}
          onBack={() => setStep(1)}
        />
      )}

      {view === "onboarding" && step === 3 && (
        <OnboardingStep3 action={profileAction} role={role} error={profileState?.error} />
      )}

      <PixelWave hidden={view === "onboarding" && step !== 1} />
      <Footer single={view === "onboarding" && step === 3} />
    </div>
  );
}

/* ─────────────────────────── shared bits ─────────────────────────── */

function Logomark() {
  return (
    <div
      style={{
        width: 75,
        height: 75,
        borderRadius: 18,
        background: "var(--om-accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 48,
        color: "#fff",
      }}
    >
      G
    </div>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <h1
        style={{
          margin: 0,
          fontFamily: MONO,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 2,
          color: "var(--text-1)",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {title}
      </h1>
      <span style={{ fontFamily: GROTESK, fontSize: 16, color: "var(--text-3)" }}>{subtitle}</span>
    </div>
  );
}

function StepDots({ active }: { active: 1 | 2 | 3 }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
      {([1, 2, 3] as const).map((n) => (
        <span
          key={n}
          style={{
            width: n === active ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: n === active ? "var(--om-accent)" : "var(--text-5)",
          }}
        />
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontFamily: MONO, fontSize: 14, color: "var(--text-1)" }}>{children}</label>;
}

const fieldStyle: React.CSSProperties = {
  height: 48,
  padding: "0 16px",
  borderRadius: 8,
  background: "var(--surface-sunken)",
  border: "1px solid var(--hairline-08)",
  color: "var(--text-1)",
  fontFamily: MONO,
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  width: "100%",
};

function PrimaryButton({ children, type = "submit" }: { children: React.ReactNode; type?: "submit" | "button" }) {
  return (
    <button
      type={type}
      style={{
        height: 48,
        border: "none",
        borderRadius: 8,
        background: "var(--om-accent)",
        color: "#fff",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        width: "100%",
      }}
    >
      {children}
    </button>
  );
}

function ErrorNote({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p style={{ margin: 0, fontFamily: GROTESK, fontSize: 13, color: "var(--accents-red, #ff383c)" }}>{error}</p>
  );
}

function PixelWave({ hidden }: { hidden?: boolean }) {
  if (hidden) return null;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/assets/pixel-wave.svg"
      alt=""
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 56,
        left: 0,
        width: "100%",
        height: 271,
        objectFit: "cover",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

function Footer({ single }: { single?: boolean }) {
  const linkStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 14,
    color: "var(--text-3)",
    textDecoration: "underline",
  };
  if (single) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: 20,
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 14, color: "var(--text-3)", textAlign: "center" }}>
          Нажимая «Продолжить», вы соглашаетесь с Политикой конфиденциальности и Условиями пользования платформы
        </span>
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        boxSizing: "border-box",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <a href="#" style={linkStyle}>Политика конфиденциальности</a>
      <a href="#" style={linkStyle}>Условия пользования</a>
      <a href="#" style={linkStyle}>Помощь</a>
    </div>
  );
}

const centerColumn: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 130,
  boxSizing: "border-box",
  position: "relative",
  zIndex: 4,
};

/* ─────────────────────────── login view ─────────────────────────── */

function LoginView({
  action,
  error,
  onCreateAccount,
}: {
  action: (formData: FormData) => void;
  error?: string;
  onCreateAccount: () => void;
}) {
  return (
    <div style={centerColumn}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Logomark />
        <Heading title="ВХОД В GIGLY" subtitle="Введите данные своего аккаунта." />
      </div>
      <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16, width: 360, marginTop: 36 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label>Email</Label>
          <input name="email" type="email" required placeholder="example@gmail.com" style={fieldStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label>Пароль</Label>
          <input name="password" type="password" required placeholder="Ваш пароль" style={fieldStyle} />
          <a
            href="#"
            style={{
              alignSelf: "flex-end",
              fontFamily: MONO,
              fontSize: 13,
              color: "var(--text-3)",
              textDecoration: "underline",
            }}
          >
            Забыли пароль?
          </a>
        </div>
        <ErrorNote error={error} />
        <div style={{ marginTop: 6 }}>
          <PrimaryButton>Войти</PrimaryButton>
        </div>
        <div style={{ alignSelf: "center", fontSize: 14, color: "var(--text-3)" }}>
          Нет аккаунта?{" "}
          <button
            type="button"
            onClick={onCreateAccount}
            style={{ background: "none", border: "none", padding: 0, color: "var(--om-accent)", cursor: "pointer", fontSize: 14 }}
          >
            Создать аккаунт
          </button>
        </div>
      </form>
    </div>
  );
}

/* ───────────────────────── onboarding steps ───────────────────────── */

function OnboardingStep1({ onPick }: { onPick: (r: Role) => void }) {
  const chip: React.CSSProperties = {
    position: "absolute",
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    height: 44,
    padding: "0 18px",
    borderRadius: 10,
    background: "var(--surface-sunken)",
    boxShadow: "inset 0 0 0 1px var(--hairline-10)",
    cursor: "pointer",
  };
  return (
    <div style={centerColumn}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <Logomark />
        <Heading title="СОЗДАЙТЕ СВОЙ АККАУНТ" subtitle="Выберите свою роль в Gigly." />
        <StepDots active={1} />
      </div>
      <div style={{ position: "relative", width: 420, height: 200, marginTop: 60 }}>
        <button
          type="button"
          onClick={() => onPick("CLIENT")}
          data-testid="role-client"
          style={{ ...chip, right: 0, top: 0, border: "none" }}
        >
          <span style={{ fontFamily: MONO, fontSize: 18, color: "var(--text-3)" }}>⌘</span>
          <span style={{ width: 1, height: 18, background: "var(--hairline-12)" }} />
          <span style={{ fontSize: 16, color: "var(--text-1)" }}>Компания</span>
        </button>
        <button
          type="button"
          onClick={() => onPick("SPECIALIST")}
          data-testid="role-specialist"
          style={{ ...chip, left: 0, top: 96, border: "none" }}
        >
          <span style={{ color: "var(--text-3)", display: "flex" }}>
            <PersonIcon />
          </span>
          <span style={{ width: 1, height: 18, background: "var(--hairline-12)" }} />
          <span style={{ fontSize: 16, color: "var(--text-1)" }}>Специалист</span>
        </button>
      </div>
    </div>
  );
}

function OnboardingStep2({
  action,
  role,
  error,
  pass,
  confirm,
  mismatch,
  onPass,
  onConfirm,
  onLogin,
  onBack,
}: {
  action: (formData: FormData) => void;
  role: Role | null;
  error?: string;
  pass: string;
  confirm: string;
  mismatch: boolean;
  onPass: (v: string) => void;
  onConfirm: (v: string) => void;
  onLogin: () => void;
  onBack: () => void;
}) {
  return (
    <div style={centerColumn}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Logomark />
        <Heading title="СОЗДАЙТЕ СВОЙ АККАУНТ" subtitle="Введите свои учётные данные." />
        <StepDots active={2} />
      </div>
      <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16, width: 360, marginTop: 36 }}>
        <input type="hidden" name="role" value={role ?? ""} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label>Email</Label>
          <input name="email" type="email" required placeholder="example@gmail.com" style={fieldStyle} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Label>Пароль</Label>
          <input
            name="password"
            type="password"
            required
            placeholder="Придумайте пароль"
            value={pass}
            onChange={(e) => onPass(e.target.value)}
            style={fieldStyle}
          />
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="Подтвердите пароль"
            value={confirm}
            onChange={(e) => onConfirm(e.target.value)}
            style={{ ...fieldStyle, borderColor: mismatch ? "var(--accents-red, #ff383c)" : undefined }}
          />
          {mismatch && <ErrorNote error="Пароли не совпадают." />}
        </div>
        <ErrorNote error={error} />
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <BackArrow onClick={onBack} label="Назад к выбору роли" />
          <PrimaryButton>Зарегистрироваться</PrimaryButton>
        </div>
        <button
          type="button"
          onClick={onLogin}
          style={{ alignSelf: "center", background: "none", border: "none", fontSize: 14, color: "var(--om-accent)", cursor: "pointer" }}
        >
          Войти
        </button>
      </form>
    </div>
  );
}

function OnboardingStep3({
  action,
  role,
  error,
}: {
  action: (formData: FormData) => void;
  role: Role | null;
  error?: string;
}) {
  const router = useRouter();
  const isCompany = role === "CLIENT";
  const title = isCompany ? "ДОБРО ПОЖАЛОВАТЬ" : "НАСТРОЙТЕ СВОЙ АККАУНТ";
  const subtitle = isCompany ? "Настройте свой аккаунт." : "Введите данные";

  return (
    <div style={centerColumn}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: MONO,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 2,
            color: "var(--text-1)",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {title}
        </h1>
        <span style={{ fontFamily: GROTESK, fontSize: 16, color: "var(--text-3)" }}>{subtitle}</span>
        <StepDots active={3} />
      </div>
      <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16, width: 360, marginTop: 36 }}>
        <input type="hidden" name="redirectTo" value="/dashboard" />
        {isCompany ? (
          <>
            <Field name="companyName" label="Компания" placeholder='ООО "Компания"' />
            <Field name="contactPerson" label="ФИО" placeholder="Фамилия Имя Отчество" />
            <Field name="position" label="Должность" placeholder="Ваша должность" />
            <SelectField name="timezone" label="Местоположение и часовой пояс" options={TIMEZONES} />
          </>
        ) : (
          <>
            <Field name="displayName" label="ФИО" placeholder="Фамилия Имя Отчество" />
            <SelectField name="specialization" label="Специализация" options={SPECIALIZATIONS} />
            <SelectField name="timezone" label="Местоположение и часовой пояс" options={TIMEZONES} />
          </>
        )}
        <ErrorNote error={error} />
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {/* account already exists (created at step 2) — skipping setup goes to the dashboard */}
          <BackArrow onClick={() => router.push("/dashboard")} label="Пропустить настройку" />
          <PrimaryButton>Продолжить</PrimaryButton>
        </div>
      </form>
    </div>
  );
}

function BackArrow({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: 48,
        height: 48,
        flex: "none",
        border: "none",
        borderRadius: 8,
        background: "var(--surface-sunken)",
        boxShadow: "inset 0 0 0 1px var(--hairline-10)",
        color: "var(--text-1)",
        fontSize: 18,
        cursor: "pointer",
      }}
    >
      ←
    </button>
  );
}

function Field({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Label>{label}</Label>
      <input name={name} placeholder={placeholder} style={fieldStyle} />
    </div>
  );
}

function SelectField({ name, label, options }: { name: string; label: string; options: readonly string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Label>{label}</Label>
      <select name={name} defaultValue="" style={{ ...fieldStyle, appearance: "none" }} aria-label={label}>
        <option value="" disabled>
          Выберите из списка
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
    </svg>
  );
}
