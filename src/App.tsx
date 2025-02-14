import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Salad,
  Phone,
  Clock,
  MapPin,
  MessageCircle,
  Heart,
  Award,
  Users,
  Dessert,
  PackageOpenIcon,
  LeafyGreen,
  Sandwich,
} from "lucide-react";

// ---------------------
// Static Data (moved outside the component)
// ---------------------
interface Product {
  name: string;
  price: string;
  description: string;
  image: string;
  tags: string[];
  badge: string;
}

const PRODUCTS: Product[] = [
  // Dessert
  {
    name: "Soup Buah",
    price: "10K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/dessert/sopbuah.jpg",
    tags: ["dessert"],
    badge: "",
  },
  {
    name: "Heatly Cendol",
    price: "10K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/dessert/cendol.jpg",
    tags: ["dessert"],
    badge: "",
  },
  {
    name: "Creamy Avosago",
    price: "15K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/dessert/avosago.jpg",
    tags: ["dessert"],
    badge: "",
  },
  {
    name: "Mango Sago",
    price: "15K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/dessert/mango.jpg",
    tags: ["dessert"],
    badge: "",
  },
  {
    name: "Almond Milk",
    price: "20K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/dessert/milk.jpg",
    tags: ["dessert"],
    badge: "",
  },
  // Snack
  {
    name: "Salad Wrap",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/snack/wrap.jpg",
    tags: ["snack"],
    badge: "",
  },
  // Ricebox
  {
    name: "Chicken Salted Egg (Jumbo Only)",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/ricebox/ricebox.jpg",
    tags: ["ricebox"],
    badge: "",
  },
  {
    name: "Chicken Sambal Matah",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/ricebox/ricebox.jpg",
    tags: ["ricebox"],
    badge: "",
  },
  {
    name: "Chicken Blackpapper",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/ricebox/ricebox.jpg",
    tags: ["ricebox"],
    badge: "",
  },
  {
    name: "Chicken Curry",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/ricebox/ricebox.jpg",
    tags: ["ricebox"],
    badge: "",
  },
  {
    // Salad buah
    name: "Mini",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/salad/small.jpg",
    tags: ["saladbuah"],
    badge: "",
  },
  {
    name: "Medium",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/salad/medium.jpg",
    tags: ["saladbuah"],
    badge: "",
  },
  {
    name: "Larage",
    price: "35K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/assets/salad/jumbo.jpg",
    tags: ["saladbuah"],
    badge: "Discount 10%",
  },
];

interface Category {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
}

const CATEGORIES: Category[] = [
  { id: "all", name: "All", icon: LeafyGreen },
  { id: "dessert", name: "Dessert", icon: Dessert },
  { id: "snack", name: "Snack", icon: Sandwich },
  { id: "ricebox", name: "Rice Box", icon: PackageOpenIcon },
  { id: "saladbuah", name: "Salad Buah", icon: Salad },
];

// Object map for badge colors
const badgeColors: Record<string, string> = {};
const getBadgeColor = (badge: string) => badgeColors[badge] || "bg-red-500";

// ---------------------
// Main App Component
// ---------------------
function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Reset pagination ketika kategori atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Use IntersectionObserver for animate-on-scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Filter produk berdasarkan kategori dan search term
  const filteredProducts = useMemo(() => {
    let products =
      selectedCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter((product) => product.tags.includes(selectedCategory));
    if (searchTerm.trim() !== "") {
      products = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return products;
  }, [selectedCategory, searchTerm]);

  // Pagination: tampilkan produk sesuai halaman aktif
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Callback untuk order melalui WhatsApp
  const handleWhatsAppOrder = useCallback(
    (productName: string, price: string) => {
      const message = `Hai salad 18! Saya ingin memesan:\n\n${productName} (Rp ${price})\n\nTolong bantu saya dengan pesanan saya`;
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/6288989840119?text=${encodedMessage}`,
        "_blank"
      );
    },
    []
  );

  // Fungsi untuk scroll ke section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img className="w-14" src="/logo.png" alt="logo" />
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("home")}
              className={`transition-colors duration-300 ${
                scrolled
                  ? "text-gray-600 hover:text-[#9cc90a]"
                  : "text-white hover:text-[#9cc90a]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`transition-colors duration-300 ${
                scrolled
                  ? "text-gray-600 hover:text-[#9cc90a]"
                  : "text-white hover:text-[#9cc90a]"
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("menu")}
              className={`transition-colors duration-300 ${
                scrolled
                  ? "text-gray-600 hover:text-[#9cc90a]"
                  : "text-white hover:text-[#9cc90a]"
              }`}
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="salad.jpg"
            alt="Salad"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-16 text-center my-50">
          <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            ONE STOP
            <br />
            <span className="text-[#9cc90a]">HEALTHY FOOD BRAND</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Temukan perpaduan sempurna bahan-bahan segar, dipilih dengan cermat
            dan disiapkan setiap hari untuk gaya hidup sehat Anda.
          </p>
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => scrollToSection("menu")}
              className="bg-[#9cc90a] text-white px-8 py-4 rounded-full transition duration-300 hover:scale-105 shadow-lg"
            >
              Pesan Sekarang
            </button>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center border-2 border-[#fe6704] text-[#fe6704] px-8 py-4 rounded-full transition duration-300 bg-orange-100 hover:scale-105 shadow-lg"
            >
              <MessageCircle className="h-6 w-6 mr-2" />
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Kisah kami</h2>
            <p className="text-gray-600 max-w-3xl mb-4 mx-auto">
              Dimulai sebagai usaha kecil di 2019, Salad 18 telah tumbuh dengan
              mengutamakan kualitas dan inovasi. Dengan resep turun-temurun dan
              buah-buahan segar, kami berkomitmen menyajikan hidangan sehat yang
              memikat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 animate-on-scroll">
              <div className="bg-green-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center transform transition hover:rotate-12">
                <Heart className="h-10 w-10 text-[#9cc90a]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Dibuat dengan Cinta
              </h3>
              <p className="text-gray-600">
                Setiap mangkuk dibuat dengan hati-hati dan perhatian terhadap
                detail
              </p>
            </div>

            <div className="text-center p-6 animate-on-scroll">
              <div className="bg-green-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center transform transition hover:rotate-12">
                <Award className="h-10 w-10 text-[#9cc90a]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Kualitas Pertama</h3>
              <p className="text-gray-600">
                Kami hanya mengambil buah-buahan segar dengan kualitas terbaik
              </p>
            </div>

            <div className="text-center p-6 animate-on-scroll">
              <div className="bg-green-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center transform transition hover:rotate-12">
                <Users className="h-10 w-10 text-[#9cc90a]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Pelanggan yang Bahagia
              </h3>
              <p className="text-gray-600">
                Ribuan pelanggan yang puas dan terus bertambah
              </p>
            </div>
          </div>

          <div className="mt-16 bg-orange-50 rounded-2xl p-8 animate-on-scroll">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Misi kami</h3>
                <p className="text-gray-600 mb-4">
                  Kami berkomitmen menyediakan hidangan sehat, segar, dan
                  bergizi dengan pilihan inovatif. Visi kami adalah menjadi
                  brand healthy food yang dikenal secara nasional dan regional.
                </p>
                <p className="text-gray-600">
                  Kami terus berinovasi dan berkembang dengan menghadirkan
                  produk berkualitas dan pelayanan terbaik untuk Anda.
                </p>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src="salad.jpg"
                  alt="Fresh fruits"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="menu" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Menu kami</h2>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? "bg-[#9cc90a] text-white shadow-lg scale-105"
                    : "bg-white text-gray-600 hover:bg-green-50 shadow-md"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#9cc90a] transition duration-300 ease-in-out"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 animate-on-scroll"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {product.badge && (
                  <div
                    className={`absolute top-4 right-4 ${getBadgeColor(
                      product.badge
                    )} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {product.badge}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#9cc90a]">
                    Rp {product.price}
                  </span>
                  <button
                    onClick={() =>
                      handleWhatsAppOrder(product.name, product.price)
                    }
                    className="bg-[#9cc90a] text-white px-6 py-2 rounded-full transition flex items-center space-x-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Pesan</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredProducts.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-[#9cc90a] text-white rounded-full mr-2 transition transform hover:scale-105"
              >
                Prev
              </button>
            )}
            {currentPage <
              Math.ceil(filteredProducts.length / itemsPerPage) && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-[#9cc90a] text-white rounded-full transition transform hover:scale-105"
              >
                Next
              </button>
            )}
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-b from-white to-green-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Hubungi Kami */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#f0f5e9] mr-4">
                  <Phone className="h-6 w-6 text-[#9cc90a]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Hubungi Kami
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 text-base">+62 813 3568 8509</p>
                <p className="text-gray-600 text-base">+62 821 4241 7242</p>
              </div>
            </div>

            {/* Card Jam Buka */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#f0f5e9] mr-4">
                  <Clock className="h-6 w-6 text-[#9cc90a]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Jam Buka
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 text-base">09:00 - 21:00</p>
              </div>
            </div>

            {/* Card Cabang Beroperasi */}
            <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition duration-300 ease-in-out">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#f0f5e9] mr-4">
                  <MapPin className="h-6 w-6 text-[#9cc90a]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Cabang Beroperasi
                </h3>
              </div>
              <div className="space-y-2 flex flex-col">
                <a
                  href="https://maps.google.com/?q=Ponorogo%2C+Jl.+Basuki+Rahmad+No.36%2C+Surodikraman%2C+Ponorogo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-gray-600 text-base hover:text-[#9cc90a] transition duration-300">
                    Ponorogo, Jl. Basuki Rahmad No.36, Surodikraman, Ponorogo
                  </p>
                </a>
                <a
                  href="https://maps.google.com/?q=Jember%2C+Jl.+Mastrip+No.63%2C+Sumbersari%2C+Jember"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-gray-600 text-base hover:text-[#9cc90a] transition duration-300">
                    Jember, Jl. Mastrip No.63, Sumbersari, Jember (Seberang
                    Fakultas Kedokteran Unej)
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">
                © 2025 Salad 18. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
