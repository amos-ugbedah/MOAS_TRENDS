import { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/layout/HeroSection";
import NewsPage from "./NewsPage";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { name: "All", slug: "all" },
    { name: "Sport", slug: "sport" },
    { name: "Politics", slug: "politics" },
    { name: "Comedy", slug: "comedy" },
    { name: "Trending", slug: "trending" },
    { name: "Local", slug: "local" },
    { name: "International", slug: "international" },
  ];

  return (
    <div>
      <HeroSection />

      {/* CATEGORY FILTER */}
      <div className="flex flex-wrap gap-3 justify-center my-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/category/${category.slug}`}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === category.name ? "bg-black text-white" : "bg-gray-200"
            } hover:bg-gray-300 transition-colors`}
            onClick={() => setSelectedCategory(category.name === "All" ? "" : category.name)}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* NEWS DISPLAY */}
      <NewsPage selectedCategory={selectedCategory} />
    </div>
  );
};

export default Home;