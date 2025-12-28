export default function Contact() {
  const email = 'hello@yourbrand.com'; // Replace with your actual email

  return (
    <section className="py-24">
      <div className="container-narrow">
        <h1 className="font-display text-4xl font-semibold text-gray-900">
          Get in touch
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Have a project in mind? We'd love to hear from you.
        </p>

        <div className="mt-12 rounded-2xl bg-gray-50 p-8 sm:p-12">
          <h2 className="font-display text-xl font-semibold text-gray-900">
            Email us
          </h2>
          <p className="mt-2 text-gray-600">
            Drop us a line and we'll get back to you within 24 hours.
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-6 inline-block rounded-full bg-brand-600 px-8 py-3 font-medium text-white transition-colors hover:bg-brand-700"
          >
            {email}
          </a>
        </div>

        <div className="mt-8 rounded-2xl bg-gray-50 p-8 sm:p-12">
          <h2 className="font-display text-xl font-semibold text-gray-900">
            Based in
          </h2>
          <p className="mt-2 text-gray-600">
            Your City, Country
            <br />
            <span className="text-sm text-gray-500">
              (Available for remote consultations worldwide)
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
