import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ConnectButton } from "./ConnectButton";

export default function Header() {
  return (
    <div className="bg-gray-900 py-4 mb-6">
      <div className="container max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Council Haus Logo"
            width={32}
            height={32}
          />
          <h1 className="text-2xl font-bold text-accent">Kesennuma Council</h1>
        </Link>
        <ConnectButton />
      </div>
    </div>
  );
}
