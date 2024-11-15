import { describe, test, expect, beforeEach, vi } from 'vitest';
import { listTeas, getTeaByName, saveTea, generateNewTeaId } from './saver';

import * as fs from 'node:fs';

vi.mock('node:fs');

describe('saver.js tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fs.existsSync.mockReturnValue(true); 
  });

  test('should get tea by name', () => {
    const mockTeas = [{ id: 1, name: 'Green Tea' }, { id: 2, name: 'Black Tea' }];
    fs.readFileSync.mockReturnValue(JSON.stringify(mockTeas));

    const tea = getTeaByName('Green Tea');
    expect(tea).toEqual(mockTeas[0]);
  });

  test('should save a new tea', () => {
    const newTea = { id: 3, name: 'Oolong Tea', description: 'A traditional Chinese tea' };
    fs.readFileSync.mockReturnValue(JSON.stringify([])); 

    saveTea(newTea); 

    expect(fs.writeFileSync).toHaveBeenCalledWith('data.json', JSON.stringify([newTea], null, 2));
  });
  test('should throw error when trying to save tea with an existing name and a different id', () => {
    const existingTea = { id: 1, name: 'Black Tea', description: 'Strong tea' };
    fs.readFileSync.mockReturnValue(JSON.stringify([existingTea]));

    const newTea = { id: 2, name: 'Black Tea', description: 'Different description' };

    expect(() => saveTea(newTea)).toThrowError('Tea with name Black Tea already exists');
});
test('should throw error when trying to save tea with an existing id and a different name', () => {
  const existingTea = { id: 1, name: 'Green Tea', description: 'Healthy tea' };
  fs.readFileSync.mockReturnValue(JSON.stringify([existingTea]));

  const newTea = { id: 1, name: 'Earl Grey', description: 'A different type of tea' };

  expect(() => saveTea(newTea)).toThrowError('Tea with id 1 already exists');
});
  test('should throw error when tea name already exists', () => {
    const existingTea = { id: 1, name: 'Green Tea', description: 'A classic tea' };
    fs.readFileSync.mockReturnValue(JSON.stringify([existingTea]));

    const newTea = { id: 2, name: 'Green Tea', description: 'Another description' };
    expect(() => saveTea(newTea)).toThrowError('Tea with name Green Tea already exists');
  });

  test('should return a list of teas', () => {
    const mockTeas = [{ id: 1, name: 'Green Tea' }, { id: 2, name: 'Black Tea' }];
    fs.readFileSync.mockReturnValue(JSON.stringify(mockTeas));

    const teas = listTeas();
    expect(teas).toEqual(mockTeas);
  });
  test('should return an array of teas when data file exists', () => {
    const teaArray = [
        { id: 1, name: 'Green Tea', description: 'Healthy drink' },
        { id: 2, name: 'Black Tea', description: 'Strong drink' }
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(teaArray));

    const teas = listTeas();

    expect(teas).toEqual(teaArray); 
});
test('should return empty array when the data file does not exist', () => {
  fs.existsSync.mockReturnValue(false);

  const teas = listTeas();

  expect(teas).toEqual([]); 
});
  test('should return a unique tea ID', () => {
    const id = generateNewTeaId();
    expect(typeof id).toBe('number');
  });
});
