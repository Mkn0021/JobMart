import { Button } from "@/components/_ui/Button";
import InputBox from "@/components/_ui/InputBox";
import AuthForm from "@/components/signin-page/AuthForm";

export default function Home() {
  return (
    <div className="min-h-screen font-inter flex flex-col gap-8 items-center justify-center">
      <AuthForm/>
    </div>
  );
}
