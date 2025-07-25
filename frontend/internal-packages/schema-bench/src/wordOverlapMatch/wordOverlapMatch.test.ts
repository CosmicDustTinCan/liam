import { describe, expect, it } from 'vitest'
import { wordOverlapMatch } from './wordOverlapMatch'

describe('wordOverlapMatch', () => {
  it('maps similar names by word overlap', () => {
    const reference = ['Payment Record', 'Medical Claim', 'User Info']
    const predict = ['Payment', 'MedicalRecord', 'User Information']
    const mapping: Record<string, string> = {}
    wordOverlapMatch(reference, predict, mapping)
    expect(mapping).toEqual({
      'Payment Record': 'Payment',
      'User Info': 'User Information',
    })
    expect(mapping).not.toHaveProperty('Medical Claim')
  })

  it('does not map: no shared words between reference and predict names', () => {
    const reference = ['Order', 'Shipment']
    const predict = ['Invoice', 'Customer']
    const mapping: Record<string, string> = {}
    wordOverlapMatch(reference, predict, mapping)
    expect(mapping).toEqual({})
  })

  it('does not map: similar-looking but non-overlapping words (e.g. "bookingid" vs "bookingno")', () => {
    const reference = ['bookingid']
    const predict = ['bookingno']
    const mapping: Record<string, string> = {}
    wordOverlapMatch(reference, predict, mapping)
    expect(mapping).toEqual({})
  })

  it('does not overwrite existing mapping', () => {
    const reference = ['Payment', 'Claim']
    const predict = ['Payment', 'Claim']
    const mapping: Record<string, string> = { Payment: 'Payment' }
    wordOverlapMatch(reference, predict, mapping)
    expect(mapping).toEqual({ Payment: 'Payment', Claim: 'Claim' })
  })

  it('does not assign a candidate twice', () => {
    const reference = ['Payment', 'Refund']
    const predict = ['Payment']
    const mapping: Record<string, string> = {}
    wordOverlapMatch(reference, predict, mapping)
    expect(Object.values(mapping).filter((v) => v === 'Payment').length).toBe(1)
  })

  it('handles case insensitivity', () => {
    const reference = ['User Info']
    const predict = ['user information']
    const mapping: Record<string, string> = {}
    wordOverlapMatch(reference, predict, mapping)
    expect(mapping).toEqual({ 'User Info': 'user information' })
  })

  it('ignores stop words', () => {
    const reference = ['Record of Payment']
    const predict = ['Payment']
    const mapping: Record<string, string> = {}
    wordOverlapMatch(reference, predict, mapping)
    expect(mapping).toEqual({ 'Record of Payment': 'Payment' })
  })
})
