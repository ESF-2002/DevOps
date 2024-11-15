import { describe, test, expect, beforeEach, vi } from 'vitest';
import { getTeaByName, saveTea, listTeas } from './saver';
import * as fs from 'node:fs';

// Mock du module fs
vi.mock('node:fs');

describe('saver functions tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fs.readFileSync.mockReturnValue(JSON.stringify([])); 
    fs.existsSync.mockReturnValue(true); 
  });

  test('should call readFileSync when getTeaByName is called', () => {
    getTeaByName('Some Tea');
    expect(fs.readFileSync).toHaveBeenCalledWith('data.json', 'utf8');
  });

  test('should handle error when saving tea', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([{ name: 'Green Tea', id: 1 }]));
    
    const newTea = { id: 2, name: 'Green Tea', description: 'Delicious green tea' };
    expect(() => saveTea(newTea)).toThrowError('Tea with name Green Tea already exists');
  });

  test('should return a list of teas', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([{ name: 'Green Tea' }, { name: 'Black Tea' }]));
    
    const teas = listTeas();
    expect(teas).toEqual([{ name: 'Green Tea' }, { name: 'Black Tea' }]);
  });
});
