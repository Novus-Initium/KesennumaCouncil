import { viem } from "hardhat";
import { parseEventLogs } from "viem";
import { COUNCIL_FACTORY_ADDRESS } from "../../../constants";

async function main() {
  const publicClient = await viem.getPublicClient();

  const councilFactory = await viem.getContractAt(
    "CouncilFactory",
    COUNCIL_FACTORY_ADDRESS,
  );
  console.log("Creating council...");
  const hash = await councilFactory.write.createCouncil([
    {
      councilName: "Kessenuma Council",
      councilSymbol: "KES",
      councilMembers: [
        {
          // J
          account: "0x14e5bf6bc8Be23aF794ecF5B8bdD23636131853d",
          votingPower: 100n,
        },
        {
          // M
          account: "0x537AFb1bB98386D41Fe5f4472C505d6BAec9e3D2",
          votingPower: 100n,
        },
        {
          // L
          account: "0x2BbCaC12706B47428664d553Af33CAf33684eF31",
          votingPower: 100n,
        },
      ],
      grantees: [
        {
          // J
          name: "Childcare",
          account: "0xAcdB5688A32e8Dc101A65245a87193C09b5D6096",
        },
        {
          // J
          name: "Hiring Support",
          account: "0xd0cCFeEF904cCE8e0C70014dB37e5133a6A8AA1c",
        },
        {
          // H
          name: "Afterschool Program",
          account: "0x9c31ce53b7205f8e89325141aee5eef9283ed3d5",
        },
      ],
      distributionToken: "0x708169c8C87563Ce904E0a7F3BFC1F3b0b767f41", // DAIx
    },
  ]);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
  });

  const logs = parseEventLogs({
    abi: councilFactory.abi,
    logs: receipt.logs,
  });

  // Type guard to check if log.args has the expected shape
  function isCouncilCreatedArgs(
    args: any,
  ): args is { council: `0x${string}`; pool: `0x${string}` } {
    return (
      args && typeof args.council === "string" && typeof args.pool === "string"
    );
  }

  logs
    .filter((log) => log.eventName === "CouncilCreated")
    .map((log) => log.args)
    .filter(isCouncilCreatedArgs)
    .map(
      ({ council, pool }) => `Council deployed to ${council} with pool ${pool}`,
    )
    .map((s) => console.log(s));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
