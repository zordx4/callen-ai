// Thin async wrapper around mock data.
// Every method returns a Promise with simulated latency so the UI behaves like a real backend.
// When we wire real backend later, only this file's implementation changes - components stay the same.

import {
  tenants, currentUser, agentConfigs, calls, sampleTranscript,
  tools, kbDocuments, dashboardKpis, callVolumeByHour,
  languageBreakdown, intentBreakdown,
  type Tenant, type Call, type AgentConfig, type Tool, type KbDocument,
} from "./mock-data";

// Simulates network latency so loading states are realistic during development
function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const api = {
  // Auth
  async login(email: string, _password: string) {
    await delay(null, 600);
    if (!email.includes("@")) throw new Error("Invalid email");
    return { user: currentUser, token: "mock-jwt-token" };
  },

  // Tenants
  async listTenants(): Promise<Tenant[]> {
    return delay(tenants);
  },

  async getCurrentUser() {
    return delay(currentUser);
  },

  // Dashboard
  async getDashboardData() {
    return delay({
      kpis: dashboardKpis,
      callVolumeByHour,
      languageBreakdown,
      intentBreakdown,
    });
  },

  // Calls
  async listCalls(tenantId: string): Promise<Call[]> {
    return delay(calls.filter((c) => c.tenantId === tenantId));
  },

  async getCallTranscript(_callId: string) {
    return delay(sampleTranscript);
  },

  async getActiveCalls(tenantId: string) {
    // Simulated 2 active calls for the live console
    return delay(calls.filter((c) => c.tenantId === tenantId).slice(0, 2));
  },

  // Agent Config
  async getAgentConfig(tenantId: string): Promise<AgentConfig | null> {
    return delay(agentConfigs.find((a) => a.tenantId === tenantId && a.isActive) ?? null);
  },

  async saveAgentConfig(config: Partial<AgentConfig>) {
    return delay({ ...config, version: (config.version ?? 0) + 1 }, 800);
  },

  // Knowledge Base
  async listKbDocuments(tenantId: string): Promise<KbDocument[]> {
    return delay(kbDocuments.filter((k) => k.tenantId === tenantId));
  },

  // Tools
  async listTools(tenantId: string): Promise<Tool[]> {
    return delay(tools.filter((t) => t.tenantId === tenantId));
  },
};
