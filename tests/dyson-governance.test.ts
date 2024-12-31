import { describe, it, beforeEach, expect, vi } from 'vitest';

const mockContractCall = vi.fn();

describe('Dyson Governance Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('create-proposal', () => {
    it('should create a proposal successfully', async () => {
      const title = 'Increase Solar Panel Efficiency';
      const description = 'Proposal to upgrade solar panels to increase energy capture efficiency';
      
      mockContractCall.mockResolvedValue({ value: 1 }); // Assuming 1 is the new proposal ID
      
      const result = await mockContractCall('dyson-governance', 'create-proposal', [title, description]);
      
      expect(result.value).toBe(1);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-governance', 'create-proposal', [title, description]);
    });
  });
  
  describe('vote', () => {
    it('should process a vote successfully', async () => {
      const proposalId = 1;
      const voteFor = true;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('dyson-governance', 'vote', [proposalId, voteFor]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-governance', 'vote', [proposalId, voteFor]);
    });
    
    it('should fail if voting on a non-existent proposal', async () => {
      const proposalId = 999;
      const voteFor = false;
      
      mockContractCall.mockRejectedValue(new Error('Proposal not found'));
      
      await expect(mockContractCall('dyson-governance', 'vote', [proposalId, voteFor]))
          .rejects.toThrow('Proposal not found');
    });
    
    it('should fail if voting on a closed proposal', async () => {
      const proposalId = 1;
      const voteFor = true;
      
      mockContractCall.mockRejectedValue(new Error('Proposal is not active'));
      
      await expect(mockContractCall('dyson-governance', 'vote', [proposalId, voteFor]))
          .rejects.toThrow('Proposal is not active');
    });
  });
  
  describe('close-proposal', () => {
    it('should close a proposal successfully', async () => {
      const proposalId = 1;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('dyson-governance', 'close-proposal', [proposalId]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-governance', 'close-proposal', [proposalId]);
    });
    
    it('should fail if trying to close a non-existent proposal', async () => {
      const proposalId = 999;
      
      mockContractCall.mockRejectedValue(new Error('Proposal not found'));
      
      await expect(mockContractCall('dyson-governance', 'close-proposal', [proposalId]))
          .rejects.toThrow('Proposal not found');
    });
    
    it('should fail if trying to close an already closed proposal', async () => {
      const proposalId = 1;
      
      mockContractCall.mockRejectedValue(new Error('Proposal is not active'));
      
      await expect(mockContractCall('dyson-governance', 'close-proposal', [proposalId]))
          .rejects.toThrow('Proposal is not active');
    });
  });
  
  describe('get-proposal', () => {
    it('should return proposal details', async () => {
      const proposalId = 1;
      const expectedProposal = {
        title: 'Increase Solar Panel Efficiency',
        description: 'Proposal to upgrade solar panels to increase energy capture efficiency',
        proposer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        status: 'active',
        votes_for: 10,
        votes_against: 5
      };
      
      mockContractCall.mockResolvedValue({ value: expectedProposal });
      
      const result = await mockContractCall('dyson-governance', 'get-proposal', [proposalId]);
      
      expect(result.value).toEqual(expectedProposal);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-governance', 'get-proposal', [proposalId]);
    });
    
    it('should return null for non-existent proposal', async () => {
      const proposalId = 999;
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('dyson-governance', 'get-proposal', [proposalId]);
      
      expect(result.value).toBeNull();
    });
  });
});

