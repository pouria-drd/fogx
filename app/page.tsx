import { GridShape } from "@/components/common";
import { Lobby } from "@/components/room";

function RootPage() {
	return (
		<main className="flex flex-col items-center justify-center gap-8 h-dvh relative p-4">
			<GridShape />
			<div className="text-center max-w-sm w-full space-y-2">
				<h1 className="text-2xl font-bold tracking-tight text-primary">
					{">"}FogX
				</h1>
				<p className="text-sm">
					A private, self-destructing chat room.
				</p>
			</div>
			<Lobby />
		</main>
	);
}

export default RootPage;
