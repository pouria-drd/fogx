"use client";

import { toast } from "sonner";
import { useState } from "react";
import { BombIcon, CheckIcon, Share2Icon } from "lucide-react";

import { Button } from "@/components/ui";
import { formatTimeRemaining } from "@/lib/utils";

interface Props {
	roomId: string;
}

function RoomNavbar({ roomId }: Props) {
	const [copied, setCopied] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

	const handleShare = () => {
		if (copied) return;
		setCopied(true);
		navigator.clipboard.writeText(window.location.href);
		toast.success("Room URL copied to clipboard");
		setTimeout(() => setCopied(false), 2000);
	};

	const destroyRoom = () => {
		// TODO: Destroy room
	};

	return (
		<header className="bg-card/50 backdrop-blur-xl border-b py-4 px-4 flex items-center justify-between gap-4 sm:gap-8">
			{/* Room ID Section */}
			<div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:gap-2">
				<span className="text-xs text-muted uppercase sm:mr-2">
					Room ID
				</span>
				<div className="flex items-center gap-2">
					<span className="font-bold text-secondary truncate">
						{roomId.length > 8
							? roomId.slice(0, 5) + "..."
							: roomId}
					</span>
					<Button
						size="icon-sm"
						variant="outline"
						title="Save share link to clipboard"
						onClick={handleShare}>
						{copied ? (
							<CheckIcon size={16} />
						) : (
							<Share2Icon size={16} />
						)}
					</Button>
				</div>
			</div>

			{/* Divider */}
			<div className="h-8 w-px bg-border" />

			{/* Time Remaining Section */}
			<div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:gap-2">
				<span className="text-xs text-muted uppercase sm:mr-2">
					Expires In
				</span>
				<span
					className={`font-bold flex items-center gap-1 text-xs sm:text-sm ${
						timeRemaining !== null && timeRemaining < 60
							? "text-destructive"
							: "text-amber-500"
					}`}>
					{timeRemaining !== null
						? formatTimeRemaining(timeRemaining)
						: "--:--"}
				</span>
			</div>

			{/* Destroy Button */}
			<div>
				<Button
					size="sm"
					className="text-xs"
					onClick={destroyRoom}
					variant="destructive"
					title="Destroy room immediately">
					<BombIcon />
				</Button>
			</div>
		</header>
	);
}

export default RoomNavbar;
