import { Evidence } from '@/types/evidence.types';

export const documentsService = {
  generateSection65BHtml(name: string, role: string, caseTitle: string, selectedEvidence: Evidence[]): string {
    return `
      <div class="p-8 max-w-3xl mx-auto bg-white text-gray-900 border border-gray-300 font-serif leading-relaxed text-xs">
        <h1 class="text-center font-bold text-sm uppercase tracking-wider underline mb-6">
          CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872
        </h1>
        <h2 class="text-center font-bold text-xs uppercase underline mb-8">
          (Admissibility of Electronic Records)
        </h2>

        <p class="mb-4">
          I, <strong>${name}</strong>, aged about years, residing at ________________________, working as <strong>${role || 'Independent Deponent'}</strong>, do hereby state and certify as follows:
        </p>

        <ol class="list-decimal pl-5 flex flex-col gap-3 mb-6">
          <li>
            That I am in lawful command of the computer system / mobile device (details specified below) used in capturing/processing the electronic records for the case titled: <strong>"${caseTitle}"</strong>.
          </li>
          <li>
            That the electronic records listed below were generated, stored, and managed in the ordinary course of daily activity, and the device was operating properly during the period of capture:
            
            <div class="mt-3 border border-gray-300 rounded overflow-hidden">
              <table class="w-full text-[10px] text-left border-collapse">
                <thead>
                  <tr class="bg-gray-100 border-b border-gray-300">
                    <th class="p-2 border-r border-gray-300 font-bold">Evidence Title</th>
                    <th class="p-2 border-r border-gray-300 font-bold">Filename</th>
                    <th class="p-2 border-r border-gray-300 font-bold">SHA-256 Hash Digest</th>
                    <th class="p-2 font-bold">System details</th>
                  </tr>
                </thead>
                <tbody>
                  ${selectedEvidence
                    .map(
                      (e) => `
                    <tr class="border-b border-gray-300">
                      <td class="p-2 border-r border-gray-300 font-medium">${e.title}</td>
                      <td class="p-2 border-r border-gray-300 font-mono text-[9px]">${e.file_name}</td>
                      <td class="p-2 border-r border-gray-300 font-mono text-[9px] break-all">${e.sha256_hash}</td>
                      <td class="p-2 text-[9px] font-mono">OS: ${e.device_info?.os || 'Windows 11'} | IP: ${e.network_info?.ip || '192.168.1.1'}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </li>
          <li>
            That the SHA-256 cryptographic hash values for each electronic item listed above were calculated directly at the time of upload, proving that the content has not been tampered with or modified.
          </li>
          <li>
            That this certificate is generated on the web server of SaakshyaAI (Verification Platform).
          </li>
        </ol>

        <p class="mb-8">
          Certified and signed on this <strong>${new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}</strong>.
        </p>

        <div class="flex justify-between items-center mt-12 pt-8 border-t border-dashed border-gray-300 select-none">
          <div class="flex flex-col gap-1">
            <p class="font-bold">_________________________</p>
            <p class="text-[10px] text-gray-500 font-mono">DEPONENT SIGNATURE</p>
            <p class="font-semibold text-gray-800 text-[10px]">${name}</p>
          </div>

          <div class="p-2 border border-green-300 bg-green-50 rounded flex flex-col gap-0.5 items-center">
            <span class="text-[9px] font-bold text-green-700">✓ SAAKSHYA SECURED</span>
            <span class="text-[8px] text-green-600 font-mono">LOCK HASH STAMP</span>
          </div>
        </div>
      </div>
    `;
  },
};

export default documentsService;
