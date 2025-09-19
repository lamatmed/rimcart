"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">Contact Us</h1>
        <p className="text-lg text-slate-600 mb-10">
          Got questions or need support? We’re here to help.  
          Reach out to RimCart anytime!
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <form className="grid gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              required
              className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Write your message here..."
              required
              className="mt-1 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="max-w-3xl mx-auto text-center mt-10">
        <p className="text-slate-600">Or contact us directly:</p>
        <ul className="mt-3 space-y-2 text-slate-700">
          <li>📧 support@rimcart.com</li>
          <li>📞 +222 30 57 28 16</li>
          <li>📍 Nouakchott, Mauritanie</li>
        </ul>
      </div>
    </div>
  );
}
