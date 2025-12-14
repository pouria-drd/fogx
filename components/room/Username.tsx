import { RefreshCwIcon } from "lucide-react";

import { useUsername } from "@/hooks";
import { Button, Label } from "@/components/ui";

function Username() {
	const { username, regenerateUsername } = useUsername();

	return (
		<div className="flex flex-col gap-2">
			<Label>Your Identity</Label>
			<div className="flex items-center justify-between bg-accent-foreground rounded-md px-3 py-2">
				<span className="text-secondary font-mono truncate">
					{username}
				</span>
				<div className="flex items-center gap-2">
					<Button
						size="icon-sm"
						variant="outline"
						onClick={regenerateUsername}
						title="Regenerate username">
						<RefreshCwIcon size={16} />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Username;
