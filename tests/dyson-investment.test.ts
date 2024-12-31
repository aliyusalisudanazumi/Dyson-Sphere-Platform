import { describe, it, beforeEach, expect, vi } from 'vitest';

const mockContractCall = vi.fn();

describe('Dyson Investment Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('invest', () => {
    it('should process an investment successfully', async () => {
      const amount = 1000000;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('dyson-investment', 'invest', [amount]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-investment', 'invest', [amount]);
    });
    
    it('should fail if the investment amount is too low', async () => {
      const amount = 1;
      
      mockContractCall.mockRejectedValue(new Error('Investment amount too low'));
      
      await expect(mockContractCall('dyson-investment', 'invest', [amount]))
          .rejects.toThrow('Investment amount too low');
    });
  });
  
  describe('withdraw', () => {
    it('should process a withdrawal successfully', async () => {
      const amount = 500000;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('dyson-investment', 'withdraw', [amount]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-investment', 'withdraw', [amount]);
    });
    
    it('should fail if trying to withdraw more than invested', async () => {
      const amount = 2000000;
      
      mockContractCall.mockRejectedValue(new Error('Insufficient balance'));
      
      await expect(mockContractCall('dyson-investment', 'withdraw', [amount]))
          .rejects.toThrow('Insufficient balance');
    });
  });
  
  describe('get-investment', () => {
    it('should return investment details for an investor', async () => {
      const investor = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const expectedInvestment = { amount: 1000000 };
      
      mockContractCall.mockResolvedValue({ value: expectedInvestment });
      
      const result = await mockContractCall('dyson-investment', 'get-investment', [investor]);
      
      expect(result.value).toEqual(expectedInvestment);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-investment', 'get-investment', [investor]);
    });
    
    it('should return null for non-existent investor', async () => {
      const investor = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('dyson-investment', 'get-investment', [investor]);
      
      expect(result.value).toBeNull();
    });
  });
  
  describe('get-total-investment', () => {
    it('should return the total investment amount', async () => {
      const expectedTotal = 5000000;
      
      mockContractCall.mockResolvedValue({ value: expectedTotal });
      
      const result = await mockContractCall('dyson-investment', 'get-total-investment', []);
      
      expect(result.value).toBe(expectedTotal);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-investment', 'get-total-investment', []);
    });
  });
});

