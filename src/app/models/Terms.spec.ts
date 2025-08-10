import { TermsContent, TermsSection } from './Terms';

describe('Terms Models', () => {
  describe('TermsSection', () => {
    it('should create TermsSection with all required properties', () => {
      const section = new TermsSection();
      section.title = 'Section 1';
      section.content = [
        { text: 'Content of section 1' },
        { text: 'More content of section 1' }
      ];

      expect(section.title).toBe('Section 1');
      expect(section.content.length).toBe(2);
      expect(section.content[0].text).toBe('Content of section 1');
      expect(section.content[1].text).toBe('More content of section 1');
    });
  });

  describe('TermsContent', () => {
    it('should create TermsContent with all required properties', () => {
      const content = new TermsContent();
      content.title = 'Conditions Générales d\'Utilisation';
      content.date = '2024-01-01';
      
      const section1 = new TermsSection();
      section1.title = 'Section 1';
      section1.content = [{ text: 'Content of section 1' }];
      
      const section2 = new TermsSection();
      section2.title = 'Section 2';
      section2.content = [{ text: 'Content of section 2' }];
      
      content.sections = [section1, section2];

      expect(content.title).toBe('Conditions Générales d\'Utilisation');
      expect(content.date).toBe('2024-01-01');
      expect(content.sections.length).toBe(2);
      expect(content.sections[0].title).toBe('Section 1');
      expect(content.sections[0].content[0].text).toBe('Content of section 1');
      expect(content.sections[1].title).toBe('Section 2');
      expect(content.sections[1].content[0].text).toBe('Content of section 2');
    });
  });
}); 