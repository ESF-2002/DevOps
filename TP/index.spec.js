import { describe, test, expect, vi } from 'vitest';
import { addTea } from './index.js';
import { saveTea, getTeaByName, generateNewTeaId } from './saver.js';

vi.mock('./saver.js', () => ({
  saveTea: vi.fn(),
  getTeaByName: vi.fn(),
  generateNewTeaId: vi.fn(),
}));

describe('index.js tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('should create a new tea', () => {
    const newTea = { name: 'Earl Grey', description: 'A classic tea' };
    getTeaByName.mockReturnValue(undefined); 
    generateNewTeaId.mockReturnValue(1);
  
    const result = addTea(newTea);
    
    expect(saveTea).toHaveBeenCalled();
    expect(saveTea).toHaveBeenCalledWith(expect.objectContaining({
      id: 1, 
      name: 'Earl Grey',
      description: 'A classic tea'
    }));
    expect(result.success).toBe(true);
  });
  
  test('should create a new tea', () => {
    const newTea = { name: 'Earl Grey', description: 'A classic tea' };
    getTeaByName.mockReturnValue(undefined); 

    const result = addTea(newTea);
    
    expect(saveTea).toHaveBeenCalled();
    expect(saveTea).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Earl Grey',
      description: 'A classic tea'
    }));
    expect(result.success).toBe(true);
  });

  test('should update tea if name already exists', () => {
    const existingTea = { id: 1, name: 'Chai', description: 'Spicy tea' };
    const updatedTea = { name: 'Chai', description: 'Updated spicy tea' };

    getTeaByName.mockReturnValue(existingTea); 

    const result = addTea(updatedTea);

    expect(saveTea).toHaveBeenCalledWith(expect.objectContaining({
      id: 1, 
      name: 'Chai',
      description: 'Updated spicy tea'
    }));
    expect(result.success).toBe(true);
  });

  test('should fail if saveTea throws an error', () => {
    const newTea = { name: 'Mint Tea', description: 'Refreshing tea' };
    getTeaByName.mockReturnValue(undefined);
    saveTea.mockImplementation(() => { throw new Error('Save failed'); });

    const result = addTea(newTea);

    expect(result.success).toBe(false);
  });
});
