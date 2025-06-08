"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Users, Zap, Sparkles } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Ready to Get Started?
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Your Next Great Find
              <span className="block text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
                Awaits You
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-white/90 mb-8 leading-relaxed"
            >
              Join thousands of satisfied customers who've discovered amazing
              products at unbeatable prices. Start your shopping journey today
              and experience the difference.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-8 mb-8"
            >
              {[
                { icon: Users, number: "50K+", label: "Happy Customers" },
                {
                  icon: ShoppingBag,
                  number: "100K+",
                  label: "Orders Delivered",
                },
                { icon: Zap, number: "24/7", label: "Fast Support" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-full bg-white/20">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-white/80 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/store">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden bg-white text-purple-600 font-semibold rounded-full px-8 py-4 inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
              </Link>

              <Link href="/accounts/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-medium rounded-full px-8 py-4 transition-all duration-300 backdrop-blur-sm"
                >
                  Create Account
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Floating Cards */}
            <div className="relative h-96">
              {/* Card 1 */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-48 h-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                  <div>
                    <div className="h-2 bg-white/60 rounded w-16 mb-1" />
                    <div className="h-1.5 bg-white/40 rounded w-12" />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="h-1.5 bg-white/40 rounded w-20 mb-2" />
                    <div className="h-1 bg-white/30 rounded w-16" />
                  </div>
                  <div className="text-white/80 text-lg font-bold">★4.9</div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-8 left-0 w-52 h-36 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-green-400" />
                    <span className="text-white/80 font-medium">
                      Order #1234
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-green-400/20 text-green-300 text-xs rounded-full">
                    Delivered
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 bg-white/40 rounded w-full" />
                  <div className="h-1.5 bg-white/30 rounded w-3/4" />
                  <div className="h-1 bg-white/20 rounded w-1/2" />
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute top-20 left-16 w-44 h-28 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded" />
                  <div className="text-white/80 font-medium text-sm">
                    New Arrival
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-white/50 rounded w-full" />
                  <div className="h-1 bg-white/30 rounded w-2/3" />
                </div>
                <div className="mt-2 text-white/60 text-xs">50% OFF</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-12">
          <path
            d="M0,0V120H1200V0C1200,0 800,60 600,60C400,60 0,0 0,0Z"
            fill="white"
            className="dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>
  );
}
