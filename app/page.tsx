import { GridShape } from "@/components/common";

async function RootPage() {
	return (
		<main className="flex flex-col items-center justify-center gap-8 h-dvh relative p-4">
			<GridShape />

			<div>
				<h1 className="font-bold text-xl">
					Welcome to <span className="text-primary">{">"}FogX</span>
				</h1>
			</div>
		</main>
	);
}

export default RootPage;
