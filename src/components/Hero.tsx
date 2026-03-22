export function Hero() {
  return (
    <section className="relative min-h-screen pt-24" style={{ background: '#FCECF4' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-6 z-10">
            <h1 className="text-5xl md:text-6xl font-light tracking-wide">
              Whimsy Whiskers
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              We make thoughtfully designed<br />
              pet essentials that turn everyday<br />
              moments into better ones.
            </p>
            <button className="bg-gray-800 text-white px-8 py-3 hover:bg-gray-900 transition-colors mt-8 tracking-wide">
              SHOP NOW
            </button>
          </div>

          <div className="relative -mr-12 md:-mr-48">
            <div className="relative overflow-hidden">
              <img
                src="/homepage.png"
                alt="Happy pets"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-wrap justify-center">
            <button className="px-8 py-4 text-sm font-medium border-b-2 border-gray-800 hover:bg-gray-50 transition-colors">
              DOG BEST SELLERS
            </button>
            <button className="px-8 py-4 text-sm font-medium hover:bg-gray-50 transition-colors">
              CAT BEST SELLERS
            </button>
            <button className="px-8 py-4 text-sm font-medium hover:bg-gray-50 transition-colors">
              NEW ARRIVALS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
