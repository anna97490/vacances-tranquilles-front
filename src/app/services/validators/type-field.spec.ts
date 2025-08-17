import { CustomValidators } from './type-field';

describe('CustomValidators', () => {
  describe('nameValidator', () => {
    it('should validate correct names', () => {
      expect(CustomValidators.nameValidator('John')).toBe(true);
      expect(CustomValidators.nameValidator('Marie-Claire')).toBe(true);
      expect(CustomValidators.nameValidator('Jean-Pierre')).toBe(true);
      expect(CustomValidators.nameValidator('O\'Connor')).toBe(true);
      expect(CustomValidators.nameValidator('José María')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(CustomValidators.nameValidator('John123')).toBe(false);
      expect(CustomValidators.nameValidator('John@Doe')).toBe(false);
      expect(CustomValidators.nameValidator('')).toBe(false);
      expect(CustomValidators.nameValidator('John!')).toBe(false);
    });
  });

  describe('emailValidator', () => {
    it('should validate correct emails', () => {
      expect(CustomValidators.emailValidator('test@example.com')).toBe(true);
      expect(CustomValidators.emailValidator('user.name@domain.co.uk')).toBe(true);
      expect(CustomValidators.emailValidator('test+tag@example.com')).toBe(true);
      expect(CustomValidators.emailValidator('user123@test-domain.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(CustomValidators.emailValidator('invalid-email')).toBe(false);
      expect(CustomValidators.emailValidator('test@')).toBe(false);
      expect(CustomValidators.emailValidator('@example.com')).toBe(false);
      expect(CustomValidators.emailValidator('test@example')).toBe(false);
      expect(CustomValidators.emailValidator('')).toBe(false);
    });
  });

  describe('phoneNumberValidator', () => {
    it('should validate correct phone numbers', () => {
      expect(CustomValidators.phoneNumberValidator('0123456789')).toBe(true);
      expect(CustomValidators.phoneNumberValidator('+33123456789')).toBe(true);
      expect(CustomValidators.phoneNumberValidator('123456789012345')).toBe(true);
      expect(CustomValidators.phoneNumberValidator('+123456789012345')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(CustomValidators.phoneNumberValidator('123456789')).toBe(false); // Too short
      expect(CustomValidators.phoneNumberValidator('1234567890123456')).toBe(false); // Too long
      expect(CustomValidators.phoneNumberValidator('123-456-7890')).toBe(false); // Contains hyphens
      expect(CustomValidators.phoneNumberValidator('abc123def')).toBe(false); // Contains letters
      expect(CustomValidators.phoneNumberValidator('')).toBe(false);
    });
  });

  describe('postalCodeValidator', () => {
    it('should validate correct French postal codes', () => {
      expect(CustomValidators.postalCodeValidator('75001')).toBe(true);
      expect(CustomValidators.postalCodeValidator('13001')).toBe(true);
      expect(CustomValidators.postalCodeValidator('69001')).toBe(true);
      expect(CustomValidators.postalCodeValidator('00000')).toBe(true);
      expect(CustomValidators.postalCodeValidator('99999')).toBe(true);
    });

    it('should reject invalid postal codes', () => {
      expect(CustomValidators.postalCodeValidator('1234')).toBe(false);
      expect(CustomValidators.postalCodeValidator('123456')).toBe(false);
      expect(CustomValidators.postalCodeValidator('1234A')).toBe(false);
      expect(CustomValidators.postalCodeValidator('12-345')).toBe(false);
      expect(CustomValidators.postalCodeValidator('')).toBe(false);
    });
  });

  describe('siretSirenValidator', () => {
    it('should validate correct SIREN numbers', () => {
      expect(CustomValidators.siretSirenValidator('123456789')).toBe(true);
      expect(CustomValidators.siretSirenValidator('12345678901234')).toBe(true);
    });

    it('should reject invalid SIRET/SIREN numbers', () => {
      expect(CustomValidators.siretSirenValidator('12345678')).toBe(false);
      expect(CustomValidators.siretSirenValidator('123456789012345')).toBe(false);
      expect(CustomValidators.siretSirenValidator('12345678A')).toBe(false);
      expect(CustomValidators.siretSirenValidator('123-456-789')).toBe(false);
      expect(CustomValidators.siretSirenValidator('')).toBe(false);
    });
  });

  describe('injectionPreventionValidator', () => {
    it('should accept safe values', () => {
      expect(CustomValidators.injectionPreventionValidator('John Doe')).toBe(true);
      expect(CustomValidators.injectionPreventionValidator('test.example.com')).toBe(true);
      expect(CustomValidators.injectionPreventionValidator('123456789')).toBe(true);
      expect(CustomValidators.injectionPreventionValidator('normal text with spaces')).toBe(true);
      expect(CustomValidators.injectionPreventionValidator('')).toBe(true);
      expect(CustomValidators.injectionPreventionValidator(null as any)).toBe(true);
      expect(CustomValidators.injectionPreventionValidator(undefined as any)).toBe(true);
    });

    it('should reject values with dangerous characters', () => {
      expect(CustomValidators.injectionPreventionValidator('<script>alert("xss")</script>')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test"quotes')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test\'quotes')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test&entity')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test;semicolon')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test{braces}')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test(parentheses)')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test[brackets]')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test\\backslash')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test/forward')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test|pipe')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test`backtick')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test~tilde')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test!exclamation')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test@at')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test#hash')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test$dollar')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test%percent')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test^caret')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test*asterisk')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test+plus')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('test=equals')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(CustomValidators.injectionPreventionValidator(' ')).toBe(true);
      expect(CustomValidators.injectionPreventionValidator('   ')).toBe(true);
      expect(CustomValidators.injectionPreventionValidator('test with <dangerous> chars')).toBe(false);
      expect(CustomValidators.injectionPreventionValidator('normal text with "quotes" inside')).toBe(false);
    });
  });
});
