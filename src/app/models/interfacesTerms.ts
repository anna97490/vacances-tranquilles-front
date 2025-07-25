export interface TermsSection {
  title: string;
  content: { text: string }[];
}

export interface TermsContent {
  title: string;
  date: string;
  sections: TermsSection[];
}