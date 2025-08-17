import { CGV_DATA } from './cgv';
import { TermsContent } from '../../models/Terms';

describe('CGV_DATA', () => {
  it('should be defined', () => {
    expect(CGV_DATA).toBeDefined();
  });

  it('should have correct structure', () => {
    expect(CGV_DATA.title).toBeDefined();
    expect(CGV_DATA.date).toBeDefined();
    expect(CGV_DATA.sections).toBeDefined();
    expect(Array.isArray(CGV_DATA.sections)).toBeTrue();
  });

  it('should have correct title and date', () => {
    expect(CGV_DATA.title).toBe('CONDITIONS GÉNÉRALES DE VENTE');
    expect(CGV_DATA.date).toBe('Juin 2025');
  });

  it('should have sections with correct structure', () => {
    CGV_DATA.sections.forEach(section => {
      expect(section.title).toBeDefined();
      expect(section.content).toBeDefined();
      expect(Array.isArray(section.content)).toBeTrue();
      expect(typeof section.title).toBe('string');
      expect(section.title.length).toBeGreaterThan(0);
    });
  });

  it('should have content items with text property', () => {
    CGV_DATA.sections.forEach(section => {
      section.content.forEach(item => {
        expect(item.text).toBeDefined();
        expect(typeof item.text).toBe('string');
        expect(item.text.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have bullet points formatted correctly', () => {
    CGV_DATA.sections.forEach(section => {
      section.content.forEach(item => {
        if (item.text.startsWith('• ')) {
          expect(item.text.length).toBeGreaterThan(2);
        }
      });
    });
  });

  it('should have specific required sections', () => {
    const sectionTitles = CGV_DATA.sections.map(section => section.title);
    expect(sectionTitles.length).toBeGreaterThan(0);
    expect(sectionTitles[0]).toContain('Article');
  });

  it('should conform to TermsContent interface', () => {
    const cgvData: TermsContent = CGV_DATA;
    expect(cgvData).toBeDefined();
    expect(typeof cgvData.title).toBe('string');
    expect(typeof cgvData.date).toBe('string');
    expect(Array.isArray(cgvData.sections)).toBeTrue();
  });

  it('should have non-empty content in all sections', () => {
    CGV_DATA.sections.forEach(section => {
      expect(section.content.length).toBeGreaterThan(0);
      section.content.forEach(item => {
        expect(item.text.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
