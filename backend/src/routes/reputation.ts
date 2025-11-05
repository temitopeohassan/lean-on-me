import { Router } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase.js";
import { AddressSchema, ReputationUpdateSchema } from "../types/schemas.js";

const router = Router();

router.get("/:address", async (req, res) => {
  const parse = AddressSchema.safeParse(req.params.address);
  if (!parse.success) return res.status(400).json({ error: "invalid address" });
  const addr = parse.data.toLowerCase();

  const { data, error } = await supabase
    .from("reputations")
    .select("wallet_address, score, tier, last_updated")
    .eq("wallet_address", addr)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) {
    return res.json({
      walletAddress: addr,
      score: 60.0,
      tier: "C",
      lastUpdated: new Date().toISOString()
    });
  }
  return res.json({
    walletAddress: data.wallet_address,
    score: data.score,
    tier: data.tier,
    lastUpdated: data.last_updated
  });
});

router.post("/:address/update", async (req, res) => {
  const addrParse = AddressSchema.safeParse(req.params.address);
  if (!addrParse.success) return res.status(400).json({ error: "invalid address" });
  const body = ReputationUpdateSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error.flatten() });

  const addr = addrParse.data.toLowerCase();
  const { deltaScore, isIncrease } = body.data;

  const { data: current, error: selErr } = await supabase
    .from("reputations")
    .select("wallet_address, score, tier")
    .eq("wallet_address", addr)
    .maybeSingle();
  if (selErr) return res.status(500).json({ error: selErr.message });

  const baseScore = current?.score ?? 60.0;
  const newScore = Math.max(0, baseScore + (isIncrease ? deltaScore : -deltaScore));
  const tier = newScore >= 80 ? "A" : newScore >= 70 ? "B" : newScore >= 60 ? "C" : "D";

  const { error: upErr } = await supabase
    .from("reputations")
    .upsert({ wallet_address: addr, score: newScore, tier, last_updated: new Date().toISOString() })
    .eq("wallet_address", addr);
  if (upErr) return res.status(500).json({ error: upErr.message });

  return res.json({ walletAddress: addr, score: newScore, tier, lastUpdated: new Date().toISOString() });
});

export default router;


