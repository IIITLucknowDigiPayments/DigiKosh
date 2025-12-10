/**
 * API client for backend
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `API Error: ${response.statusText}`;

        // Try to parse error message from response
        if (contentType?.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            // Ignore JSON parse errors, use generic message
          }
        }

        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      return response.json();
    } catch (error) {
      console.error(`[ApiClient] Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Vaults
  async getVaults() {
    return this.request<{ success: boolean; data: any[] }>("/vaults");
  }

  async createVault(payload: {
    address: string;
    name: string;
    description: string;
    asset?: string;
    deployer?: string;
    totalAssets?: string;
    totalSupply?: string;
  }) {
    console.log("[ApiClient] Creating vault:", payload);
    const result = await this.request<{ success: boolean; data: any }>(
      "/vaults",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    console.log("[ApiClient] Vault created:", result);
    return result;
  }

  async createContributor(payload: {
    vault: string;
    wallet: string;
    name: string;
    role: string;
    monthlyAllocation?: string;
    totalEarned?: string;
    isActive?: boolean;
  }) {
    return this.request<{ success: boolean; data: any }>("/contributors", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async createVoting(payload: {
    votingId?: number;
    vault: string;
    nominee: string;
    nomineeName: string;
    description: string;
    startTime?: string | number;
    endTime?: string | number;
  }) {
    return this.request<{ success: boolean; data: any }>("/votings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getVault(address: string) {
    try {
      return await this.request<{ success: boolean; data: any }>(
        `/vaults/${address}`
      );
    } catch (error: any) {
      // Return null data for 404, but still throw for other errors
      if (error.status === 404) {
        console.warn(`[ApiClient] Vault not found: ${address}`);
        return { success: false, data: null, error: "Vault not found" };
      }
      throw error;
    }
  }

  async syncVaults() {
    return this.request<{ success: boolean; data: any[]; message: string }>(
      "/vaults/sync"
    );
  }

  // Contributors
  async getContributors() {
    return this.request<{ success: boolean; data: any[] }>("/contributors");
  }

  async getVaultContributors(vaultAddress: string) {
    return this.request<{ success: boolean; data: any[] }>(
      `/contributors/vault/${vaultAddress}`
    );
  }

  // Votings
  async getVotings() {
    return this.request<{ success: boolean; data: any[] }>("/votings");
  }

  async getActiveVotings() {
    return this.request<{ success: boolean; data: any[] }>("/votings/active");
  }

  async getPastVotings() {
    return this.request<{ success: boolean; data: any[] }>("/votings/past");
  }

  async getVotingById(votingId: number) {
    return this.request<{ success: boolean; data: any }>(
      `/votings/${votingId}`
    );
  }

  async recordVote(
    votingId: number | string,
    votesFor: number,
    votesAgainst: number
  ) {
    return this.request<{ success: boolean; data: any }>(
      `/votings/${votingId}/record-vote`,
      {
        method: "PUT",
        body: JSON.stringify({ votesFor, votesAgainst }),
      }
    );
  }

  async incrementVote(
    votingId: number | string,
    deltaFor: number,
    deltaAgainst: number
  ) {
    return this.request<{ success: boolean; data: any }>(
      `/votings/${votingId}/increment`,
      {
        method: "PUT",
        body: JSON.stringify({ deltaFor, deltaAgainst }),
      }
    );
  }

  // Distributions
  async getDistributions() {
    return this.request<{ success: boolean; data: any[] }>("/distributions");
  }

  async getUpcomingDistributions() {
    return this.request<{ success: boolean; data: any[] }>(
      "/distributions/upcoming"
    );
  }

  async getRecentDistributions() {
    return this.request<{ success: boolean; data: any[] }>(
      "/distributions/recent"
    );
  }

  async getDistributionById(scheduleId: number) {
    return this.request<{ success: boolean; data: any }>(
      `/distributions/${scheduleId}`
    );
  }

  async syncDistributions() {
    return this.request<{ success: boolean; data: any[]; message: string }>(
      "/distributions/sync"
    );
  }
}

export const apiClient = new ApiClient();
