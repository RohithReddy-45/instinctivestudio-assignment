import { cn } from "@/lib/utils";

export default function Logo({className}: {className?: string}) {
	return (
		<img src="/logo.png" alt="Logo" className={cn("w-20", className)} />
	);
}
