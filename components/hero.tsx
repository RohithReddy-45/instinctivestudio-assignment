import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4">
      <Logo />
      <div className="flex gap-x-4">
        <Link href="/sign-up">
          <Button>Signup</Button>
        </Link>
        <Link href="/sign-in">
          <Button>SignIn</Button>
        </Link>
      </div>
    </div>
  );
}
