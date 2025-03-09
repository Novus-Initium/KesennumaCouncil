"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import React, { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import VotingButton from "../VotingButton";
import { SkeletonVote } from "./SkeletonVote";
import { VoteInput } from "./VoteInput";

type Project = { account: `0x${string}`; name: string };
type Allocation = { [grantee: `0x${string}`]: number };

type VotingCardProps = {
  className: string;
  council: `0x${string}` | undefined;
  projects: Project[];
  initialAllocation: Allocation | undefined;
  votingPower: number;
  maxVotedProjects: number;
  isLoading: boolean;
  councilMembers: {
    account: `0x${string}`;
    votingPower: number;
    enabled: boolean;
  }[];
};

const VotingCard = ({
  className,
  council,
  projects,
  initialAllocation,
  votingPower,
  maxVotedProjects,
  isLoading = false,
  councilMembers,
}: VotingCardProps) => {
  const randomizedProjects = useMemo(
    () => [...projects].sort(() => Math.random() - 0.5),
    [projects],
  );

  // TODO: Remove this once we have a way to rename projects
  const mapping: { [key: string]: string } = {
    Lee: "Zenidrop by Lee",
    "Bruno & team": "AstroBlock by Bruno team",
    SenSpace: "SenSpace by SenSpace team",
    MarkCarey: "Pixel Nouns by Mark",
    "Dayitva & team": "Superboring Incentive by Dayitva team",
    "Nikku & team": "Buzzfi by Nikko team",
  };

  const renamedProjects = randomizedProjects.map((project) => ({
    ...project,
    name: mapping[project.name] ?? project.name,
  }));

  const [votes, setVotes] = useState<Allocation>(
    Object.fromEntries(
      projects.map((project) => [
        project.account,
        initialAllocation?.[project.account] ?? 0,
      ]),
    ),
  );

  useEffect(() => {
    setVotes(
      Object.fromEntries(
        projects.map((project) => [
          project.account,
          initialAllocation?.[project.account] ?? 0,
        ]),
      ),
    );
  }, [initialAllocation, projects]);

  // Array of project addresses that have been voted on
  const votedProjects = (Object.keys(votes) as `0x${string}`[]).filter(
    (grantee) => (votes[grantee] ?? 0) > 0,
  );

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (grantee: `0x${string}`, value: number) => {
    setVotes((prev) => ({
      ...prev,
      [grantee]: value,
    }));
  };

  const calculateProjectVotingDetails = (project: `0x${string}`) => {
    const voteCount = votes[project] || 0;
    const totalVotesExcludingCurrentProject = totalVotes - voteCount;
    const remainingVotingPowerForThisProject =
      votingPower - totalVotesExcludingCurrentProject;
    const maxVoteForProject = Math.max(0, remainingVotingPowerForThisProject);
    const disabled =
      !votingPower ||
      (votedProjects.length >= maxVotedProjects && voteCount === 0);
    return { voteCount, maxVoteForProject, disabled };
  };

  // Check if the connected address is a council member
  const { address } = useAccount();
  console.log("Council Members:", councilMembers);
  const isCouncilMember = useMemo(() => {
    if (!address || !councilMembers) return false;
    return councilMembers.some(
      (member) =>
        member.account.toLowerCase() === address.toLowerCase() &&
        member.enabled,
    );
  }, [address, councilMembers]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Which project is doing better?</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonVote />
        ) : projects.length === 0 ? (
          <div>No projects to vote on</div>
        ) : (
          <>
            <div className="flex justify-between">
              <h4 className="h-12 text-xl mb-6 text-accent flex-wrap">
                Cast Your Vote{" "}
                {projects.length > maxVotedProjects ? (
                  <span className="text-nowrap text-sm">
                    ({votedProjects.length} / {maxVotedProjects} projects)
                  </span>
                ) : null}
              </h4>
              <div className="text-sm mt-2">
                Used{" "}
                <span className="text-nowrap">
                  {totalVotes} / {votingPower}
                </span>
              </div>
            </div>
            {renamedProjects.map((project) => {
              const { voteCount, maxVoteForProject, disabled } =
                calculateProjectVotingDetails(project.account);
              return (
                <div
                  key={project.account}
                  className="flex items-center justify-between mb-3"
                >
                  <span className="flex-grow text-ellipsis overflow-hidden">
                    {project.name}
                  </span>
                  <VoteInput
                    value={voteCount}
                    onChange={(newValue) =>
                      handleVote(project.account, newValue)
                    }
                    max={maxVoteForProject}
                    total={votingPower}
                    increment={Math.floor(votingPower / 10)}
                    disabled={disabled}
                  />
                </div>
              );
            })}
          </>
        )}
      </CardContent>
      <CardFooter>
        <VotingButton
          votes={votes}
          council={council}
          disabled={
            !isCouncilMember ||
            votedProjects.length > maxVotedProjects ||
            totalVotes > votingPower
          }
          className="mt-4"
        />
      </CardFooter>
    </Card>
  );
};

export default VotingCard;
