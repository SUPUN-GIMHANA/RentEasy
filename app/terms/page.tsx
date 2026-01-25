import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-blue">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-8 text-lg">Last updated: January 2, 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed mb-4">
              By accessing and using RentHub, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="leading-relaxed mb-4">
              To access certain features of the platform, you must create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities that occur under your
              account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Rental Agreement</h2>
            <p className="leading-relaxed mb-4">
              When you book a rental through RentHub, you enter into a binding agreement with the item owner. You agree
              to use the item responsibly and return it in the same condition as received.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p className="leading-relaxed mb-4">
              All payments must be made through our secure payment system. Prices are displayed in Polish Zloty (PLR)
              and include applicable taxes unless otherwise stated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cancellations and Refunds</h2>
            <p className="leading-relaxed mb-4">
              Cancellation policies vary by item and owner. Please review the specific cancellation policy before
              booking. Refunds will be processed according to the applicable cancellation policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Liability</h2>
            <p className="leading-relaxed mb-4">
              RentHub acts as a marketplace platform connecting renters and owners. We are not responsible for the
              quality, safety, or legality of items listed. Users rent items at their own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Prohibited Uses</h2>
            <p className="leading-relaxed mb-4">You may not use RentHub for any illegal purposes or in violation of:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any applicable laws or regulations</li>
              <li>The intellectual property rights of others</li>
              <li>Activities that could harm other users or the platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
              to the platform. Continued use of RentHub constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="leading-relaxed mb-4">
              If you have questions about these terms, please contact us at legal@renthub.pl or visit our contact page.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
