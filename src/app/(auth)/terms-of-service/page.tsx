import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Sonexa",
  description:
    "Terms of Service for Sonexa - AI-powered lyric video creation platform",
};

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Ambient background matching landing page */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-500 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-1/3 left-1/4 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8))]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Terms of Service
        </h1>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <p className="text-sm text-white/70 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                1. Acceptance of Terms
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  {
                    'By accessing and using Sonexa ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.'
                  }
                </p>
                <p>
                  {
                    "If you do not agree to abide, please do not use this service."
                  }
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                2. Description of Service
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  {
                    "Sonexa is an AI-powered platform that allows users to create lyric videos by:"
                  }
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>{"Uploading video content"}</li>
                  <li>{"Generating AI captions and transcriptions"}</li>
                  <li>{"Creating custom lyric layouts and styles"}</li>
                  <li>{"Rendering final videos with synchronized lyrics"}</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                3. User Accounts and Registration
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Account Creation:</strong> You must create an account
                  to access certain features of the Service.
                </p>
                <p>
                  <strong>Account Security:</strong> You are responsible for
                  maintaining the confidentiality of your account credentials.
                </p>
                <p>
                  <strong>Account Responsibility:</strong> You are responsible
                  for all activities that occur under your account.
                </p>
                <p>
                  <strong>Age Requirement:</strong> You must be at least 13
                  years old to use the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                4. Acceptable Use Policy
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Prohibited Content:</strong> You may not upload,
                  create, or distribute content that:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    Is illegal, harmful, threatening, abusive, or defamatory
                  </li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains malware, viruses, or harmful code</li>
                  <li>Is sexually explicit or pornographic</li>
                  <li>Promotes violence or discrimination</li>
                </ul>
                <p>
                  <strong>Service Abuse:</strong> You may not attempt to
                  disrupt, overload, or interfere with the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                5. Intellectual Property Rights
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Your Content:</strong> You retain ownership of content
                  you upload or create using the Service.
                </p>
                <p>
                  <strong>License Grant:</strong> By using the Service, you
                  grant us a limited license to process and store your content
                  to provide the Service.
                </p>
                <p>
                  <strong>Our Platform:</strong> The Service, including its
                  software, design, and content, is owned by Sonexa and
                  protected by intellectual property laws.
                </p>
                <p>
                  <strong>Third-party Rights:</strong> You must ensure you have
                  the right to use any content you upload or incorporate into
                  your videos.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                6. Payment and Subscription Terms
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Pricing:</strong> Service pricing is subject to change
                  with notice.
                </p>
                <p>
                  <strong>Billing:</strong> Subscriptions are billed in advance
                  on a recurring basis.
                </p>
                <p>
                  <strong>Cancellation:</strong> You may cancel your
                  subscription at any time through your account settings.
                </p>
                <p>
                  <strong>Refunds:</strong> Refund policies are subject to our
                  discretion and applicable laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                7. Service Availability and Limitations
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Availability:</strong> We strive to maintain high
                  service availability but do not guarantee uninterrupted
                  access.
                </p>
                <p>
                  <strong>Limitations:</strong> The Service may have usage
                  limits, file size restrictions, and processing time
                  constraints.
                </p>
                <p>
                  <strong>Updates:</strong> We may update, modify, or
                  discontinue features of the Service with notice.
                </p>
                <p>
                  <strong>Third-party Services:</strong> The Service relies on
                  third-party services (AWS, AI providers) which may affect
                  availability.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                8. Privacy and Data Protection
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  Your privacy is important to us. Please review our Privacy
                  Policy to understand how we collect, use, and protect your
                  information.
                </p>
                <p>
                  By using the Service, you consent to our data practices as
                  described in our Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                9. Disclaimers and Limitations of Liability
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>{'Service "As Is":'}</strong>{" "}
                  {
                    'The Service is provided "as is" without warranties of any kind.'
                  }
                </p>
                <p>
                  <strong>AI Accuracy:</strong> AI-generated content may contain
                  errors or inaccuracies.
                </p>
                <p>
                  <strong>Content Responsibility:</strong> We are not
                  responsible for user-generated content or its accuracy.
                </p>
                <p>
                  <strong>Limitation of Liability:</strong> Our liability is
                  limited to the amount you paid for the Service in the 12
                  months preceding the claim.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                10. Indemnification
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  You agree to indemnify and hold harmless Sonexa from any
                  claims, damages, or expenses arising from your use of the
                  Service or violation of these terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                11. Termination
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Your Rights:</strong> You may terminate your account
                  at any time.
                </p>
                <p>
                  <strong>Our Rights:</strong> We may terminate or suspend your
                  account for violations of these terms.
                </p>
                <p>
                  <strong>Effect of Termination:</strong> Upon termination, your
                  access to the Service will cease, and we may delete your
                  content.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                12. Governing Law and Disputes
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Governing Law:</strong>{" "}
                  {
                    "These terms are governed by the laws of Massachusetts, United States."
                  }
                </p>
                <p>
                  <strong>Dispute Resolution:</strong> Disputes will be resolved
                  through binding arbitration or small claims court.
                </p>
                <p>
                  <strong>Class Action Waiver:</strong> You waive any right to
                  participate in class action lawsuits.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                13. Changes to Terms
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  We may modify these terms at any time. We will notify you of
                  material changes via email or through the Service.
                </p>
                <p>
                  Continued use of the Service after changes constitutes
                  acceptance of the new terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                14. Contact Information
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  If you have questions about these terms, please contact us:
                </p>
                <p>
                  <strong>Email:</strong> sonexa.team@gmail.com
                </p>
                <p>
                  <strong>Address:</strong> 75 Raymond RD, Plymouth, MA 02360
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
