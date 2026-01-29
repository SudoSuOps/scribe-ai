// Letterdrop AI - Frontend JavaScript

// API Configuration
const API_BASE = 'https://api.letterdrop.ai'; // Change to your API endpoint
// For local testing: 'http://localhost:8004'

// DOM Elements
const letterType = document.getElementById('letter-type');
const situation = document.getElementById('situation');
const senderName = document.getElementById('sender-name');
const senderAddress = document.getElementById('sender-address');
const generateBtn = document.getElementById('generate-btn');
const letterOutput = document.getElementById('letter-output');
const copyBtn = document.getElementById('copy-btn');

// Generate Letter
async function generateLetter() {
    const btnText = generateBtn.querySelector('.btn-text');
    const btnLoading = generateBtn.querySelector('.btn-loading');

    // Validate inputs
    if (!situation.value.trim()) {
        alert('Please describe your situation');
        situation.focus();
        return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    generateBtn.disabled = true;
    letterOutput.innerHTML = '<p class="placeholder-text">Generating your letter...</p>';

    try {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: situation.value,
                letter_type: letterType.value,
                sender_name: senderName.value || null,
                sender_address: senderAddress.value || null
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Display the letter
        letterOutput.textContent = data.letter;
        copyBtn.style.display = 'block';

        // Scroll to output on mobile
        if (window.innerWidth < 900) {
            letterOutput.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Generation error:', error);

        // Demo fallback - show sample letter
        letterOutput.textContent = generateDemoLetter();
        copyBtn.style.display = 'block';
    }

    // Reset button
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    generateBtn.disabled = false;
}

// Demo letter generator (fallback when API unavailable)
function generateDemoLetter() {
    const type = letterType.value;
    const name = senderName.value || '[Your Name]';
    const address = senderAddress.value || '[Your Address]';
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const templates = {
        credit_dispute: `${today}

${name}
${address}

TransUnion Consumer Relations
2 Baldwin Place
Chester, PA 19022

RE: Dispute of Inaccurate Information

To Whom It May Concern:

I am writing pursuant to my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681i, to dispute inaccurate information appearing on my credit report.

${situation.value || 'The account information listed is inaccurate and must be investigated.'}

Under Section 611 of the FCRA, you are required to conduct a reasonable investigation into this matter within 30 days of receipt of this letter.

Please investigate this dispute and remove or correct the inaccurate information. Send me written confirmation of the results of your investigation.

Sincerely,

${name}`,

        debt_validation: `${today}

${name}
${address}

[Debt Collector Name]
[Collector Address]

RE: Debt Validation Request - FDCPA Section 809(b)

To Whom It May Concern:

I am writing pursuant to my rights under the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. § 1692g, to request validation of the alleged debt.

${situation.value || 'I dispute this debt and require validation.'}

Please provide:
• The original signed contract or agreement
• Complete payment history
• Proof of your authority to collect this debt
• Itemized statement of the amount claimed

Until you provide proper validation, you must cease all collection activities as required by Section 809(b) of the FDCPA.

Sincerely,

${name}`,

        cease_desist: `${today}

${name}
${address}

[Debt Collector Name]
[Collector Address]

RE: Cease and Desist - FDCPA Section 805(c)

To Whom It May Concern:

Pursuant to my rights under the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. § 1692c(c), I hereby demand that you cease all communication with me.

${situation.value || 'Your continued contact is unwanted and must stop.'}

Any further contact after receipt of this letter, except to confirm receipt or notify me of legal action, will be considered a violation of federal law.

This notice is being sent via certified mail. I am retaining a copy for my records.

Sincerely,

${name}`,

        demand_letter: `${today}

${name}
${address}

[Recipient Name]
[Recipient Address]

RE: Demand for Payment

Dear Sir/Madam:

This letter serves as formal demand for the following:

${situation.value || 'Payment of amount owed.'}

You have 30 days from receipt of this letter to resolve this matter.

If I do not receive payment or a satisfactory response within 30 days, I will have no choice but to pursue all available legal remedies, including filing suit in small claims court.

Govern yourself accordingly.

Sincerely,

${name}`,

        medical_billing: `${today}

${name}
${address}

[Hospital/Provider Name]
Billing Department
[Provider Address]

RE: Dispute of Medical Bill

To Whom It May Concern:

I am writing to dispute charges on my account.

${situation.value || 'The billed amount is inaccurate.'}

Please provide:
• Itemized statement of all charges
• Explanation of Benefits (EOB) from insurance
• Medical records related to these charges

Do not send this account to collections while this dispute is pending. I request a response within 30 days.

Sincerely,

${name}`
    };

    return templates[type] || templates.credit_dispute;
}

// Copy to clipboard
async function copyLetter() {
    const text = letterOutput.textContent;

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    }
}

// Event Listeners
generateBtn.addEventListener('click', generateLetter);
copyBtn.addEventListener('click', copyLetter);

// Allow Enter key in textarea to not submit (Shift+Enter for line break, just Enter works normally)
situation.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        generateLetter();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('Letterdrop AI loaded');
