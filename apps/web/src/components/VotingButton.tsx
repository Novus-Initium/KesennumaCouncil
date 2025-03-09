"use client";

import { Button } from "@repo/ui/components/ui/button";
import { useToast } from "@repo/ui/hooks/use-toast";
import { cn } from "@repo/ui/lib/utils";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useWriteAllocation } from "../hooks/useWriteAllocation";

type VotingButtonProps = {
  votes: Record<string, number>;
  council: `0x${string}` | undefined;
  disabled: boolean;
  className?: string;
};

const VotingButton = ({
  votes,
  council,
  disabled,
  className,
}: VotingButtonProps) => {
  const { address } = useAccount();
  const vote = useWriteAllocation(council);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  return (
    <Button
      disabled={disabled || !address || isLoading}
      className={cn("w-full py-2 rounded-lg mt-4 font-bold", className)}
      onClick={() => {
        setIsLoading(true);
        vote(
          Object.entries(votes)
            .filter(([, voteCount]) => voteCount > 0)
            .map(([grantee, voteCount]) => ({
              account: grantee as `0x${string}`,
              amount: BigInt(voteCount),
            })),
        )
          .then(() => {
            setIsLoading(false);
            toast.toast({
              title: "Voted",
              description: "You have successfully voted",
            });
          })
          .catch((error) => {
            console.error("Voting error:", error);
            setIsLoading(false);
            toast.toast({
              title: "Failed to vote",
              description: "Please try again",
              variant: "destructive",
            });
          });
      }}
    >
      {isLoading
        ? "Voting..."
        : !address
          ? "Wallet not connected"
          : disabled
            ? "Not a council member or invalid allocation"
            : "Vote"}
    </Button>
  );
};

export default VotingButton;
