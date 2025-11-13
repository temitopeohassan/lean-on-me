"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfileProps {
  address?: string;
  reputationScore?: number;
  tier?: string;
  status?: string;
}

const tierColors: Record<string, string> = {
      S: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      A: "bg-primary/20 text-primary border-primary/30",
      B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      C: "bg-muted/20 text-muted border-muted/30",
  D: "bg-muted/20 text-muted border-muted/30",
};

export default function UserProfile({ address, reputationScore, tier, status }: UserProfileProps) {
  const shortAddress =
    address && address.length > 8 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address ?? "--";
  const tierClass = tier ? tierColors[tier] ?? tierColors["C"] : tierColors["C"];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("Failed to copy address", error);
    }
  };

  const externalHref = address ? `https://basescan.org/address/${address}` : undefined;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 bg-primary/20 border-2 border-primary/30">
              <AvatarFallback className="bg-primary/30 text-primary font-bold">
                {address ? address.slice(2, 4).toUpperCase() : "--"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-medium">{shortAddress ?? "Connect wallet"}</p>
                {address && (
                  <button
                    className="text-muted hover:text-foreground transition-colors"
                    onClick={handleCopy}
                    aria-label="Copy address"
                  >
                  <Copy className="w-4 h-4" />
                </button>
                )}
                {copied && <span className="text-xs text-accent">Copied!</span>}
              </div>
              <p className="text-xs text-muted mt-1">{address ? "Connected Wallet" : "Connect wallet to view details"}</p>
            </div>
          </div>
          {externalHref ? (
            <Button variant="ghost" size="sm" className="text-muted hover:text-foreground" asChild>
              <a href={externalHref} target="_blank" rel="noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-muted" disabled>
            <ExternalLink className="w-4 h-4" />
          </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <p className="text-xs text-muted mb-1">Reputation Score</p>
            <p className="text-2xl font-bold text-primary">
              {typeof reputationScore === "number" ? reputationScore.toFixed(0) : "--"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Tier</p>
            <Badge className={`${tierClass} border`}>Tier {tier ?? "C"}</Badge>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Status</p>
            <Badge className="bg-accent/20 text-accent border-accent/30 border">{status ?? "Active"}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
