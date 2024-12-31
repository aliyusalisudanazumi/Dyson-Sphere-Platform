import { describe, it, beforeEach, expect, vi } from 'vitest';

const mockContractCall = vi.fn();

describe('Dyson Construction Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('add-construction-phase', () => {
    it('should add a construction phase successfully', async () => {
      const name = 'Initial Framework';
      const description = 'Constructing the initial framework for the Dyson sphere';
      const resourceRequirements = [
        { resource: 'steel', amount: 1000000 },
        { resource: 'solar-panels', amount: 500000 }
      ];
      
      mockContractCall.mockResolvedValue({ value: 1 }); // Assuming 1 is the new phase ID
      
      const result = await mockContractCall('dyson-construction', 'add-construction-phase', [name, description, resourceRequirements]);
      
      expect(result.value).toBe(1);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-construction', 'add-construction-phase', [name, description, resourceRequirements]);
    });
  });
  
  describe('update-phase-status', () => {
    it('should update a phase status successfully', async () => {
      const phaseId = 1;
      const newStatus = 'in-progress';
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('dyson-construction', 'update-phase-status', [phaseId, newStatus]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-construction', 'update-phase-status', [phaseId, newStatus]);
    });
    
    it('should fail if the phase does not exist', async () => {
      const phaseId = 999;
      const newStatus = 'completed';
      
      mockContractCall.mockRejectedValue(new Error('Phase not found'));
      
      await expect(mockContractCall('dyson-construction', 'update-phase-status', [phaseId, newStatus]))
          .rejects.toThrow('Phase not found');
    });
  });
  
  describe('allocate-resource', () => {
    it('should allocate a resource successfully', async () => {
      const resource = 'steel';
      const amount = 500000;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('dyson-construction', 'allocate-resource', [resource, amount]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-construction', 'allocate-resource', [resource, amount]);
    });
  });
  
  describe('use-resource', () => {
    it('should use a resource successfully', async () => {
      const resource = 'steel';
      const amount = 100000;
      
      mockContractCall.mockResolvedValue({ value: true });
      
      const result = await mockContractCall('dyson-construction', 'use-resource', [resource, amount]);
      
      expect(result.value).toBe(true);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-construction', 'use-resource', [resource, amount]);
    });
    
    it('should fail if trying to use more than allocated', async () => {
      const resource = 'steel';
      const amount = 1000000000;
      
      mockContractCall.mockRejectedValue(new Error('Insufficient resources'));
      
      await expect(mockContractCall('dyson-construction', 'use-resource', [resource, amount]))
          .rejects.toThrow('Insufficient resources');
    });
  });
  
  describe('get-phase', () => {
    it('should return phase details', async () => {
      const phaseId = 1;
      const expectedPhase = {
        name: 'Initial Framework',
        description: 'Constructing the initial framework for the Dyson sphere',
        resource_requirements: [
          { resource: 'steel', amount: 1000000 },
          { resource: 'solar-panels', amount: 500000 }
        ],
        status: 'in-progress'
      };
      
      mockContractCall.mockResolvedValue({ value: expectedPhase });
      
      const result = await mockContractCall('dyson-construction', 'get-phase', [phaseId]);
      
      expect(result.value).toEqual(expectedPhase);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-construction', 'get-phase', [phaseId]);
    });
    
    it('should return null for non-existent phase', async () => {
      const phaseId = 999;
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('dyson-construction', 'get-phase', [phaseId]);
      
      expect(result.value).toBeNull();
    });
  });
  
  describe('get-resource-allocation', () => {
    it('should return resource allocation details', async () => {
      const resource = 'steel';
      const expectedAllocation = { allocated: 500000, used: 100000 };
      
      mockContractCall.mockResolvedValue({ value: expectedAllocation });
      
      const result = await mockContractCall('dyson-construction', 'get-resource-allocation', [resource]);
      
      expect(result.value).toEqual(expectedAllocation);
      expect(mockContractCall).toHaveBeenCalledWith('dyson-construction', 'get-resource-allocation', [resource]);
    });
    
    it('should return null for non-existent resource', async () => {
      const resource = 'unobtainium';
      
      mockContractCall.mockResolvedValue({ value: null });
      
      const result = await mockContractCall('dyson-construction', 'get-resource-allocation', [resource]);
      
      expect(result.value).toBeNull();
    });
  });
});

