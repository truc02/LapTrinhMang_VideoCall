import { SignUp } from '@clerk/nextjs';
// Đăng ký
export default function SignUpPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </main>
  );
}
