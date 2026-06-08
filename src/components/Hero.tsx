import { Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onCategoryClick: (category: string) => void;
}

const featuredProducts = [
  {
    name: 'Whimsy Whiskers Shock-Absorbing Bungee Dog...',
    price: '$23.80',
    image: '/featured-1.jpg',
  },
  {
    name: 'Whimsy Whiskers Fruit Squeaky Plush Dog Toy',
    price: '$12.16',
    image: '/featured-2.jpg',
  },
  {
    name: 'Cozy Cat Tunnel Bed',
    price: '$35.00',
    image: '/featured-3.jpg',
  },
  {
    name: 'Handmade Knit Pet Scarf',
    price: '$4.28',
    image: '/featured-4.jpg',
  },
];

const whyChooseUs = [
  { title: 'Free Shipping', icon: Truck },
  { title: 'Made with Care', icon: HeartHandshake },
  { title: 'Customer First', icon: ShieldCheck },
];

export function Hero({ onCategoryClick }: HeroProps) {
  return (
    <section className="bg-[#f4ebe4]">
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #f2e3e8 0%, #f3e5e8 58%, #f2e5e3 78%, #f4ebe4 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-32">
          <div className="grid md:grid-cols-[5fr_7fr] gap-10 items-center min-h-[82vh]">
            <div className="space-y-6 pb-8 md:pb-24">
              <p className="text-sm tracking-[0.28em] uppercase text-[#9d8d8b]">
                Thoughtfully designed for pets
              </p>

              <h1 className="text-5xl md:text-7xl font-light tracking-wide text-[#1f1f1f] leading-[0.95]">
                Whimsy
                <br />
                Whiskers
              </h1>

              <p className="text-lg md:text-[19px] text-[#5f5a57] leading-relaxed max-w-xl">
                We make thoughtfully designed pet essentials that turn everyday
                moments into better ones.
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-[#7a746f]">
                <span className="px-5 py-3 rounded-full bg-white/45 border border-white/50">
                  Soft everyday essentials
                </span>
                <span className="px-5 py-3 rounded-full bg-white/45 border border-white/50">
                  Handmade charm
                </span>
                <span className="px-5 py-3 rounded-full bg-white/45 border border-white/50">
                  For dogs and cats
                </span>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    const section = document.getElementById('featured-products');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#2f3743] text-white px-10 py-4 rounded-lg hover:bg-[#252c36] transition-colors tracking-wide text-lg"
                >
                  SHOP NOW
                </button>

                <button
                  onClick={() => {
                    const section = document.getElementById('shop-by-category');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-10 py-4 rounded-lg border border-[#d8c9c1] text-[#5e5753] bg-white/25 hover:bg-white/50 transition-colors tracking-wide text-lg"
                >
                  EXPLORE
                </button>
              </div>
            </div>

            <div className="relative flex justify-center md:justify-end items-end">
              <img
                src="/homepage.png"
                alt="Happy pets"
                className="w-full max-w-[860px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full leading-none overflow-hidden">
          <svg
            viewBox="0 0 1440 180"
            className="w-full h-[130px] md:h-[170px]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,112C672,107,768,117,864,122.7C960,128,1056,128,1152,117.3C1248,107,1344,85,1392,74.7L1440,64V181H1392C1344,181,1248,181,1152,181C1056,181,960,181,864,181C768,181,672,181,576,181C480,181,384,181,288,181C192,181,96,181,48,181H0Z"
              fill="#f4ebe4"
            />
          </svg>
        </div>
      </div>

      <div id="shop-by-category" className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-[#2a2928]">
            Shop by Category
          </h2>

          <p className="mt-3 text-base text-[#8f8681]">
            Browse our collections and discover perfect items for your pets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => onCategoryClick('dog-products')}
            className="group bg-[#f8f4ef] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-left hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-[280px] overflow-hidden">
                 <img
                  src="/dog-category.png"
                  alt="Dog products"
                  className="w-full h-full object-cover scale-[1.08] -translate-y-3 group-hover:scale-[1.13] transition-transform duration-500"
                />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-medium text-[#1f1f1f]">
                Dog Products
              </h3>
              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#efe3d8] text-[#5f5a57] text-base font-medium">
                Shop Now
                <span>›</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => onCategoryClick('cat-products')}
            className="group bg-[#f8f4ef] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-left hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-[280px] overflow-hidden">
                <img
                  src="/cat-category.png"
                  alt="Cat products"
                  className="w-full h-full object-cover scale-[1.1] -translate-y-5 group-hover:scale-[1.15] transition-transform duration-500"
                />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-medium text-[#1f1f1f]">
                Cat Products
              </h3>
              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#efe3d8] text-[#5f5a57] text-base font-medium">
                Shop Now
                <span>›</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => onCategoryClick('custom-products')}
            className="group bg-[#f8f4ef] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-left hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-[280px] overflow-hidden">
              <img
                src="/custom-category.png"
                alt="Customized pet products"
                className="w-full h-full object-cover object-[50%_30%] group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 text-center">
              <h3 className="text-2xl font-medium text-[#1f1f1f]">
                Customized Products
              </h3>

              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#efe3d8] text-[#5f5a57] text-base font-medium">
                Shop Now
                <span>›</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => onCategoryClick('diy-furniture')}
            className="group bg-[#f8f4ef] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-left hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-[280px] overflow-hidden">
              <img
                src="/diy-furniture.png"
                alt="DIY furniture"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 text-center">
              <h3 className="text-2xl font-medium text-[#1f1f1f]">
                DIY Furniture
              </h3>

              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#efe3d8] text-[#5f5a57] text-base font-medium">
                Shop Now
                <span>›</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div id="featured-products" className="bg-[#f5ece6] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-[#2a2928]">
              Featured Products
            </h2>

            <p className="mt-3 text-base text-[#8f8681]">
              Our most popular and new arrivals
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.name}
                className="bg-[#fbf7f3] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-[250px] bg-[#f2e7de] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[15px] leading-7 text-[#2a2928] min-h-[72px]">
                    {product.name}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[2rem] leading-none font-semibold text-[#bb6b27]">
                      {product.price}
                    </span>
                    <span className="text-[#bb6b27] text-2xl">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#f4ebe4] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-light text-[#2a2928]">
              Why Choose Us?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-[#f6ebe2] rounded-2xl px-5 py-4 flex items-center justify-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-white/55 border border-[#eadfd8] flex items-center justify-center text-[#a18d80]">
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                  </div>

                  <span className="text-[15px] md:text-base font-normal text-[#4f4a46] whitespace-nowrap">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
