import { LoginForm } from "./login/page";
import { RegisterForm } from "./register/page";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <div className="w-full">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}
