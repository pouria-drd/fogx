"use client";

import { SendIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Button, Input } from "@/components/ui";

function MessageInput() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputMessage, setInputMessage] = useState("");

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			handleOnSendMessage();
		}
	}

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInputMessage(e.target.value);
	}

	function handleSendClick() {
		handleOnSendMessage();
	}

	function handleOnSendMessage() {
		if (inputMessage.trim()) {
			sendMessage(inputMessage);
			setInputMessage("");
		}
		inputRef.current?.focus();
	}

	function sendMessage(message: string) {
		// TODO: Send message
		console.log(message);
	}

	return (
		<div className="border-t bg-card/50 backdrop-blur-xl p-4">
			<div className="flex gap-4">
				<div className="flex-1 relative">
					<span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary animate-pulse">
						{">"}
					</span>
					<Input
						autoFocus
						type="text"
						ref={inputRef}
						value={inputMessage}
						onKeyDown={handleKeyDown}
						onChange={handleInputChange}
						placeholder="Type message..."
						className="px-8 placeholder:text-xs text-sm h-full placeholder:text-muted"
					/>
				</div>

				<Button
					size={"icon-lg"}
					variant={"outline"}
					onClick={handleSendClick}
					// disabled={!input.trim() || isPending}
				>
					<SendIcon size={1} scale={0.5} />
				</Button>
			</div>
		</div>
	);
}

export default MessageInput;
