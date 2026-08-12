"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../components/AuthLayout";
import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your organization's MaiSa workspace."
      footer={
        <>
          Already have an account? <Link href="/login">Log in</Link>
        </>
      }
    >
      <SignupForm onSuccess={() => router.push("/")} />
    </AuthLayout>
  );
}

export default SignupPage;
