const HeroSection = () => {
    return (
      <div className="relative h-[500px] flex items-end justify-center text-white">
        {/* Background image */}
        <img
          src="/images/moas_hero.jpg"
          alt="Moas Trends Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
  
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
  
        {/* Text content */}
        <div className="relative z-20 text-center px-6 py-10 w-full">
          <h1 className="text-4xl font-bold mb-4">WELCOME TO MOAS_TRENDS</h1>
          <p className="max-w-2xl mx-auto text-lg">
            Your daily destination for the latest updates, compelling stories, and trending insights.
            We’re committed to delivering quality news, enriching perspectives, and a community-first experience.
          </p>
        </div>
      </div>
    );
  };
  
  export default HeroSection;
  