import { describe, expect, it, vi } from 'vitest'
import { processSQLInChunks } from './processSQLInChunks.js'

describe(processSQLInChunks, () => {
  describe('processSQLInChunks', () => {
    it('should split input by newline and process each chunk', async () => {
      const input = 'SELECT 1;\nSELECT 2;\nSELECT 3;'
      const chunkSize = 2
      const callback = vi.fn().mockResolvedValue([null, null, []])

      await processSQLInChunks(input, chunkSize, callback)

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenCalledWith('SELECT 1;\nSELECT 2;')
      expect(callback).toHaveBeenCalledWith('SELECT 3;')
    })

    it('should handle chunks correctly to avoid invalid SQL syntax', async () => {
      const input = 'SELECT 1;\nSELECT 2;\nSELECT 3;\nSELECT 4;'
      const chunkSize = 3
      const callback = vi.fn().mockResolvedValue([null, null, []])

      await processSQLInChunks(input, chunkSize, callback)

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenCalledWith('SELECT 1;\nSELECT 2;\nSELECT 3;')
      expect(callback).toHaveBeenCalledWith('SELECT 4;')
    })

    it('should handle input with no newlines correctly', async () => {
      const input = 'SELECT 1; SELECT 2; SELECT 3;'
      const chunkSize = 1
      const callback = vi.fn().mockResolvedValue([null, null, []])

      await processSQLInChunks(input, chunkSize, callback)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith('SELECT 1; SELECT 2; SELECT 3;')
    })

    it('should handle empty input correctly', async () => {
      const input = ''
      const chunkSize = 1
      const callback = vi.fn().mockResolvedValue([null, null, []])

      await processSQLInChunks(input, chunkSize, callback)

      expect(callback).not.toHaveBeenCalled()
    })

    it('should correctly handle readOffset by partially consuming chunk lines', async () => {
      const input = [
        'SELECT 1;',
        'SELECT 2;',
        'SELECT 3, -- partial statement',
        '4;',
      ].join('\n')
      const chunkSize = 3
      const callback = vi
        .fn()
        // On the first call, return readOffset=19, indicating that only part of the chunk was successfully processed.
        .mockResolvedValueOnce([null, 19, []])
        // Subsequent calls should process without issues.
        .mockResolvedValue([null, null, []])

      const errors = await processSQLInChunks(input, chunkSize, callback)

      expect(errors).toEqual([])
      // Verify the first call: the first three lines are passed as a chunk.
      expect(callback).toHaveBeenNthCalledWith(
        1,
        'SELECT 1;\nSELECT 2;\nSELECT 3, -- partial statement',
      )
      // Verify the second call: the unprocessed part of the chunk is retried along with the next line.
      expect(callback).toHaveBeenNthCalledWith(
        2,
        'SELECT 3, -- partial statement\n4;',
      )
    })
  })
})
