"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your MaiSa workspace."
      footer={
        <>
          New here? <Link href="/signup">Create an account</Link>
        </>
      }
    >
      <LoginForm onSuccess={() => router.push("/")} />
    </AuthLayout>
  );
}

export default LoginPage;
