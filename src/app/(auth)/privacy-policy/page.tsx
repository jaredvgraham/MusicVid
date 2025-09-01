import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Sonexa",
  description:
    "Privacy Policy for Sonexa - AI-powered lyric video creation platform",
};

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <p className="text-sm text-white/70 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                1. Information We Collect
              </h2>
              <div className="space-y-3 text-white/70">
                <p>
                  <strong>Personal Information:</strong>{" "}
                  {
                    "When you create an account, we collect your email address, name, and any profile information you provide."
                  }
                </p>
                <p>
                  <strong>Usage Data:</strong>{" "}
                  {
                    "We collect information about how you use our service, including video uploads, rendering requests, and feature usage."
                  }
                </p>
                <p>
                  <strong>Technical Data:</strong>{" "}
                  {
                    "We collect device information, IP addresses, browser type, and usage analytics to improve our service."
                  }
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                2. How We Use Your Information
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Service Provision:</strong>{" "}
                  {
                    "To provide, maintain, and improve our lyric video creation service."
                  }
                </p>
                <p>
                  <strong>Communication:</strong>{" "}
                  {
                    "To send you important updates, security alerts, and support messages."
                  }
                </p>
                <p>
                  <strong>Analytics:</strong>{" "}
                  {
                    "To analyze usage patterns and optimize our platform performance."
                  }
                </p>
                <p>
                  <strong>Security:</strong>{" "}
                  {"To detect and prevent fraud, abuse, and security threats."}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                3. Data Storage and Security
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Video Content:</strong>{" "}
                  {
                    "Your uploaded videos and generated content are stored securely in AWS S3 with encryption."
                  }
                </p>
                <p>
                  <strong>Processing:</strong>{" "}
                  {
                    "Video processing is handled by secure AWS Lambda functions with strict access controls."
                  }
                </p>
                <p>
                  <strong>Retention:</strong>{" "}
                  {
                    "We retain your data only as long as necessary to provide our service."
                  }
                </p>
                <p>
                  <strong>Security Measures:</strong>{" "}
                  {
                    "We implement industry-standard security practices including encryption, access controls, and regular security audits."
                  }
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                4. Data Sharing and Disclosure
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>No Sale:</strong>{" "}
                  {
                    "We do not sell, trade, or rent your personal information to third parties."
                  }
                </p>
                <p>
                  <strong>Service Providers:</strong>{" "}
                  {
                    "We may share data with trusted third-party services (AWS, payment processors) to operate our platform."
                  }
                </p>
                <p>
                  <strong>Legal Requirements:</strong>{" "}
                  {
                    "We may disclose information if required by law or to protect our rights and safety."
                  }
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                5. Your Rights and Choices
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Access:</strong> You can access and update your
                  personal information through your account settings.
                </p>
                <p>
                  <strong>Deletion:</strong> You can request deletion of your
                  account and associated data.
                </p>
                <p>
                  <strong>Opt-out:</strong> You can opt out of non-essential
                  communications and analytics.
                </p>
                <p>
                  <strong>Data Portability:</strong> You can export your data in
                  a standard format.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                6. Cookies and Tracking
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  <strong>Essential Cookies:</strong> We use cookies necessary
                  for the platform to function properly.
                </p>
                <p>
                  <strong>Analytics Cookies:</strong> We use analytics cookies
                  to understand usage patterns and improve our service.
                </p>
                <p>
                  <strong>Third-party Services:</strong> Some third-party
                  services (like payment processors) may use their own cookies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                7. International Data Transfers
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  Your data may be processed in countries other than your own.
                  We ensure appropriate safeguards are in place for
                  international data transfers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                {"8. Children's Privacy"}
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  Our service is not intended for children under 13. We do not
                  knowingly collect personal information from children under 13.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                9. Changes to This Policy
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  We may update this privacy policy from time to time. We will
                  notify you of any material changes via email or through our
                  platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                10. Contact Us
              </h2>
              <div className="space-y-3 text-gray-200">
                <p>
                  If you have questions about this privacy policy or our data
                  practices, please contact us:
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
