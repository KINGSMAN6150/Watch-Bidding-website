import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="pt-16"> {/* pt-16 = navbar height offset */}
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-background to-background" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

        <div className="container-xl relative z-10 grid md:grid-cols-2 gap-12 items-center py-20">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="text-xs font-semibold text-accent tracking-widest uppercase mb-4 block">
              Live Auction Platform
            </span>
            <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold leading-tight text-foreground mb-6">
              Bid on{' '}
              <span className="gradient-text">Rare</span>
              <br />
              Timepieces
            </h1>
            <p className="text-muted text-lg mb-8 max-w-md leading-relaxed">
              Real-time auctions for luxury watches. Place bids that update
              instantly across all devices. Authenticated, secure, and live.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/buy" className="btn-primary text-base px-8 py-3">
                Browse Auctions →
              </Link>
              <Link to="/sell" className="btn-ghost text-base px-8 py-3">
                List Your Watch
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { label: 'Live Auctions', value: 'Real-time' },
                { label: 'Bid Updates', value: 'Instant' },
                { label: 'Secure Auth', value: 'JWT' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-foreground font-semibold text-lg">{value}</p>
                  <p className="text-muted text-sm">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Watch display card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="hidden md:flex justify-center"
          >
            <div className="auction-card p-6 max-w-sm w-full">
              <div className="aspect-square bg-elevated rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent" />
                <span className="text-7xl">⌚</span>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-display text-xl font-semibold text-foreground">Rolex Submariner</p>
                  <p className="text-muted text-sm">Ref. 126610LN · 2023</p>
                </div>
                <span className="live-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <div>
                  <p className="text-muted text-xs">Current Bid</p>
                  <p className="text-gold font-bold text-xl">₹14,50,000</p>
                </div>
                <div className="text-right">
                  <p className="text-muted text-xs">Ends in</p>
                  <p className="text-foreground font-semibold">2h 14m</p>
                </div>
              </div>
              <button className="btn-gold w-full mt-4 py-2">Place Bid</button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
