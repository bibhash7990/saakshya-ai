import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client gracefully
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    return null;
  }
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    return ai;
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI client:', error);
    return null;
  }
};

export const aiService = {
  // Simple check
  isAIConfigured() {
    return !!import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key';
  },

  async askLegalQuery(query: string, language: 'en' | 'hi' = 'en'): Promise<string> {
    const client = getGeminiClient();

    if (!client) {
      // Mock localized answers for demo runs!
      await new Promise((r) => setTimeout(r, 1000));

      const mockAnswers: Record<string, string> = {
        tenant: `Under Indian Rent Control laws (and the Model Tenancy Act, 2021), here are your rights:
1. **Security Deposit Limitation**: Landlords cannot demand more than 2 months' rent as a security deposit for residential premises.
2. **Right to Receipts**: You are legally entitled to a written receipt for rent and deposits paid (Section 133 CrPC / Rent Court standards).
3. **No Unlawful Cut-Offs**: Landlords cannot shut off essential services like water or electricity. Doing so is illegal and a violation of your basic tenant rights.
4. **Eviction Protection**: You cannot be evicted without a proper written eviction notice and valid grounds (like non-payment of rent for 2 consecutive months).

**Actionable Next Steps**: 
- Screenshot all threatening messages.
- Compile bank payment records.
- Keep the signed rent agreement ready.
- Check state-specific rent control laws for direct escalation.`,
        scam: `For online fraud or marketplace scams, here is the legal recourse in India:
1. **Cyber Cell Reporting**: You can report cyber fraud immediately at **cybercrime.gov.in** or dial the national helpline **1930** within the "golden hour" of the transaction.
2. **Information Technology Act, 2000**: Under Sections 66D (cheating by impersonation) and 66C (identity theft), online scamming is a punishable offense.
3. **Consumer Protection Act, 2019**: You can file a complaint with the National Consumer Helpline (NCH) or via e-Daakhil portal.

**Actionable Next Steps**:
- Save bank transaction receipts showing the UTR number.
- Secure the scammer's profile details and chat logs.
- Generate a verified Section 65B certificate for these screenshots before submitting.`,
      };

      const lower = query.toLowerCase();
      if (lower.includes('tenant') || lower.includes('rent') || lower.includes('deposit') || lower.includes('landlord')) {
        return mockAnswers.tenant;
      }
      if (lower.includes('scam') || lower.includes('fraud') || lower.includes('money') || lower.includes('cyber')) {
        return mockAnswers.scam;
      }

      return `Thank you for your query. 

**Indian Legal Advisor Overview**:
Under Indian Civil and Consumer laws, you have a right to seek relief for disputes or damages. 
To support your claim, you should ensure:
- All communications are documented in writing or print.
- Proof of delivery or work completion is saved with hash verification.
- You send a formal Demand Notice to the other party before initiating formal court proceedings.

*Disclaimer: This information is AI-generated for guidance and does not constitute formal legal counsel. If the dispute involves a significant amount, please consult a certified advocate.*`;
    }

    try {
      // Use the gemini-2.5-flash model
      const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
        You are SaakshyaAI's Legal Rights Assistant. You help Indian citizens understand their legal rights in simple language.
        User Query: "${query}"
        Language: "${language === 'hi' ? 'Hindi' : 'English'}"

        RULES:
        1. Explain in simple, non-legal language first, then mention the relevant law/act.
        2. Always mention specific Indian laws/sections (e.g., IPC/BNS, IT Act 2000, Consumer Protection Act 2019).
        3. Provide step-by-step actionable advice.
        4. Include relevant helpline numbers (like 1930 for cybercrime, 1915 for consumer helpline).
        5. Add a disclaimer that this is AI guidance, not certified legal counsel.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error('Gemini query failure:', err);
      return 'Sorry, there was an issue connecting to the AI server. Please try again.';
    }
  },

  async searchLegalResources(query: string): Promise<any[]> {
    const client = getGeminiClient();

    if (!client) {
      await new Promise((r) => setTimeout(r, 1000));
      return [
        {
          title: 'Mock AI Generated Portal',
          category: 'portal',
          description: `This is a mock AI result for "${query}" because the API key is not configured.`,
          url: 'https://example.com',
          isFree: true,
          isAiGenerated: true,
        },
      ];
    }

    try {
      const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
        You are a legal assistant for Indian citizens. The user searched for: "${query}".
        Return a JSON array of up to 3 relevant Indian government websites, NGOs, or helplines.
        The JSON must be an array of objects matching this exact structure:
        [
          {
            "title": "Name of the organization/portal",
            "category": "legal_aid" | "helpline" | "portal" | "ngo",
            "description": "Short 1-2 sentence description",
            "url": "Valid https URL",
            "phone": "Helpline number (optional)",
            "isFree": true,
            "isAiGenerated": true
          }
        ]
        Respond ONLY with valid JSON. Do not include markdown code blocks.
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json/, '');
      if (text.startsWith('\`\`\`')) text = text.replace(/^\`\`\`/, '');
      if (text.endsWith('\`\`\`')) text = text.replace(/\`\`\`$/, '');
      
      return JSON.parse(text);
    } catch (err) {
      console.error('Gemini resource search failure:', err);
      return [];
    }
  },
};
export default aiService;
