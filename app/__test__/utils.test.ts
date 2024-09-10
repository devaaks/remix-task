import { z } from 'zod';
import { validateSchema, getSearchParam } from '../utils';

// Mock the zod library
jest.mock('zod', () => ({
  ZodSchema: jest.fn(),
}));

describe('validateSchema', () => {
  let mockSchema: jest.Mocked<z.ZodSchema>;

  beforeEach(() => {
    mockSchema = {
      safeParse: jest.fn(),
    } as any;
  });

  it('should return data when validation succeeds', () => {
    const testData = { name: 'John' };
    mockSchema.safeParse.mockReturnValue({ success: true });

    const result = validateSchema(testData, mockSchema);

    expect(result).toEqual(testData);
    expect(mockSchema.safeParse).toHaveBeenCalledWith(testData);
  });

  it('should throw a Response with status 400 when validation fails', () => {
    const testData = { name: 123 };
    mockSchema.safeParse.mockReturnValue({ success: false });

    expect(() => validateSchema(testData, mockSchema)).toThrow(Response);
  });

  it('should log error and rethrow when an unexpected error occurs', () => {
    const testData = { name: 'John' };
    const testError = new Error('Unexpected error');
    mockSchema.safeParse.mockImplementation(() => {
      throw testError;
    });

    console.error = jest.fn();

    expect(() => validateSchema(testData, mockSchema)).toThrow(testError);
    expect(console.error).toHaveBeenCalledWith('Data validation failed: ', testError);
  });
});

describe('getSearchParam', () => {
  it('should return empty string when no search param is present', () => {
    const url = 'https://example.com';
    expect(getSearchParam(url)).toBe('');
  });

  it('should return correctly formatted search query when search param is present', () => {
    const url = 'https://example.com?search=test';
    expect(getSearchParam(url)).toBe('search=test');
  });

  it('should handle URL encoded search params', () => {
    const url = 'https://example.com?search=hello%20world';
    expect(getSearchParam(url)).toBe('search=hello%20world');
  });

  it('should ignore other query params', () => {
    const url = 'https://example.com?page=1&search=test&sort=asc';
    expect(getSearchParam(url)).toBe('search=test');
  });

  it('should return empty string when search param is empty', () => {
    const url = 'https://example.com?search=';
    expect(getSearchParam(url)).toBe('');
  });
});