import { SignIn } from '@clerk/nextjs';

// Đăng nhập
export default function SiginInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
}
