#!/usr/bin/env node

import { getCredentials, getAccessToken } from '../auth/index.js';
import { ClaudeCodeClient } from '../api/index.js';

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf-8'));
const VERSION: string = pkg.version;

const args = process.argv.slice(2);
const command = args.filter((a: string) => !a.startsWith('-'));
const flags = new Set(args.filter((a: string) => a.startsWith('-')));
const jsonOutput = flags.has('--json');

async function createClient(): Promise<ClaudeCodeClient> {
  const credentials = await getCredentials();
  const token = getAccessToken(credentials);
  return new ClaudeCodeClient(token);
}

function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

function formatUsage(): (data: Record<string, unknown>) => void {
  return (data) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === null) continue;
      if (key === 'extra_usage') continue;
      if (typeof value === 'object' && value !== null && 'utilization' in value) {
        const bucket = value as { utilization: number; resets_at: string | null };
        const label = key.replace(/_/g, ' ');
        const resets = bucket.resets_at
          ? ` (resets ${new Date(bucket.resets_at).toLocaleString()})`
          : '';
        console.log(`  ${label}: ${bucket.utilization}%${resets}`);
      }
    }

    const extra = data.extra_usage as { is_enabled: boolean } | null;
    if (extra) {
      console.log(`  extra usage: ${extra.is_enabled ? 'enabled' : 'disabled'}`);
    }
  };
}

function formatProfile(data: Record<string, unknown>): void {
  const account = data.account as Record<string, unknown>;
  const org = data.organization as Record<string, unknown>;
  console.log(`  name: ${account.display_name}`);
  console.log(`  email: ${account.email}`);
  console.log(`  plan: ${org.organization_type}`);
  console.log(`  org: ${org.name}`);
  console.log(`  status: ${org.subscription_status}`);
}

async function run(): Promise<void> {
  const [action] = command;

  if (flags.has('-v') || flags.has('--version')) {
    console.log(VERSION);
    return;
  }

  if (!action || flags.has('-h') || flags.has('--help')) {
    console.log(`ccb v${VERSION} — Claude Code Battery CLI

Usage: ccb <command> [options]

Commands:
  oauth usage      Show usage limits
  oauth profile    Show account profile

Options:
  --json           Output as JSON
  -h, --help       Show help
  -v, --version    Show version`);
    return;
  }

  const client = await createClient();

  const path = command.join(' ');

  switch (path) {
    case 'oauth usage': {
      const usage = await client.getUsage();
      if (jsonOutput) {
        printJson(usage);
      } else {
        console.log('Usage:');
        formatUsage()(usage as unknown as Record<string, unknown>);
      }
      break;
    }
    case 'oauth profile': {
      const profile = await client.getProfile();
      if (jsonOutput) {
        printJson(profile);
      } else {
        console.log('Profile:');
        formatProfile(profile as unknown as Record<string, unknown>);
      }
      break;
    }
    default:
      console.error(`Unknown command: ${path}`);
      process.exit(1);
  }
}

run().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
