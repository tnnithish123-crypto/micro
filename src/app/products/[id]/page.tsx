'use client'

import { products, type Product } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import StarRating from '@/components/StarRating'
import ScrollReveal from '@/components/ScrollReveal'
import { useWishlist, useCompare, useRecentlyViewed } from '@/components/AppProviders'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useMemo } from 'react'
import {
  CheckCircle,
  Sparkles,
  ShoppingCart,
  Heart,
  GitCompareArrows,
  Share2,
  ChevronRight,
  Star,
  Package,
  Cpu,
  Monitor,
  Wifi,
  ArrowLeft,
  Home,
  AlertCircle,
} from 'lucide-react'

const thumbnailLabels = ['Front', 'Side', 'Open', 'Keyboard', 'Back'] as const
type ViewAngle = (typeof thumbnailLabels)[number]

const specTabs = ['Overview', 'Performance', 'Display & Audio', 'Connectivity'] as const

const sampleReviews = [
  {
    name: 'John D.',
    date: '2 weeks ago',
    rating: 5,
    text: 'Absolutely love this laptop! The performance is incredible for both work and casual gaming. The display is stunning and the build quality feels premium.',
  },
  {
    name: 'Sarah M.',
    date: '1 month ago',
    rating: 4,
    text: 'Great laptop overall. The battery life is impressive and it handles my daily tasks with ease. Only minor complaint is that it runs a bit warm under heavy load.',
  },
  {
    name: 'Alex K.',
    date: '3 months ago',
    rating: 5,
    text: 'This is hands down the best laptop I have owned. The AI features are genuinely useful, the keyboard is fantastic, and the weight makes it perfect for travel.',
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const product = useMemo(() => products.find((p) => p.id === id), [id])

  const [viewAngle, setViewAngle] = useState<ViewAngle>('Front')
  const [activeTab, setActiveTab] = useState<(typeof specTabs)[number]>('Overview')
  const [showStickyBar, setShowStickyBar] = useState(false)
  const buyButtonsRef = useRef<HTMLDivElement>(null)

  const { isInWishlist, toggleWishlist } = useWishlist()
  const { isInCompare, toggleCompare } = useCompare()
  const { addRecentlyViewed } = useRecentlyViewed()

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product)
    }
  }, [product, addRecentlyViewed])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '0px' }
    )

    const el = buyButtonsRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-hp-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-hp-navy mb-2">Product Not Found</h1>
          <p className="text-hp-gray-500 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-hp-blue text-white rounded-xl font-medium hover:bg-hp-blue-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </motion.div>
      </div>
    )
  }

  const stockColor =
    product.stock === 'in-stock'
      ? 'bg-hp-success'
      : product.stock === 'low-stock'
      ? 'bg-hp-warning'
      : 'bg-hp-danger'

  const stockLabel =
    product.stock === 'in-stock'
      ? 'In Stock'
      : product.stock === 'low-stock'
      ? 'Low Stock'
      : 'Out of Stock'

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const percentage =
      stars === 5
        ? 65
        : stars === 4
        ? 22
        : stars === 3
        ? 8
        : stars === 2
        ? 3
        : 2
    return { stars, percentage }
  })

  const recommended = useMemo(() => {
    const sameSeries = products.filter(
      (p) => p.id !== product.id && p.series === product.series
    )
    const similarPrice = products.filter(
      (p) =>
        p.id !== product.id &&
        p.series !== product.series &&
        Math.abs(p.price - product.price) <= product.price * 0.2
    )
    const combined = [...sameSeries, ...similarPrice]
    const unique = combined.filter(
      (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
    )
    return unique.slice(0, 4)
  }, [product])

  const specData: Record<(typeof specTabs)[number], { label: string; value: string }[]> = {
    Overview: [
      { label: 'Name', value: product.name },
      { label: 'Series', value: product.series },
      { label: 'Processor', value: product.processor },
      { label: 'GPU', value: product.gpu },
      { label: 'RAM', value: `${product.ram} GB` },
      { label: 'Storage', value: product.storage },
      { label: 'Operating System', value: product.operatingSystem },
      { label: 'Weight', value: `${product.weight} kg` },
      { label: 'Warranty', value: product.warranty },
      { label: 'Release Year', value: product.releaseYear.toString() },
    ],
    Performance: [
      { label: 'Processor', value: product.processor },
      { label: 'Processor Generation', value: product.processorGeneration },
      { label: 'GPU', value: product.gpu },
      { label: 'RAM Type', value: product.ramType },
      { label: 'RAM', value: `${product.ram} GB` },
      { label: 'Expandable Storage', value: product.expandableStorage || 'N/A' },
      { label: 'AI Features', value: product.aiFeatures.join(', ') || 'None' },
    ],
    'Display & Audio': [
      { label: 'Display Size', value: product.displaySize },
      { label: 'Resolution', value: product.resolution },
      { label: 'Panel Type', value: product.panelType },
      { label: 'Refresh Rate', value: `${product.refreshRate} Hz` },
      { label: 'Brightness', value: `${product.brightness} nits` },
      { label: 'Touch Support', value: product.touchSupport ? 'Yes' : 'No' },
    ],
    Connectivity: [
      { label: 'WiFi', value: product.wifiVersion },
      { label: 'Bluetooth', value: product.bluetooth },
      { label: 'Ports', value: product.ports.join(', ') },
      { label: 'Webcam', value: product.webcam },
      { label: 'Fingerprint', value: product.fingerprint ? 'Yes' : 'No' },
      { label: 'Keyboard Backlight', value: product.keyboardBacklight ? 'Yes' : 'No' },
    ],
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pb-24 md:pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-hp-gray-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-hp-blue transition-colors inline-flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/collection" className="hover:text-hp-blue transition-colors">
            Collection
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/collection?series=${encodeURIComponent(product.series)}`}
            className="hover:text-hp-blue transition-colors"
          >
            {product.series}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-hp-navy font-medium">{product.name}</span>
        </nav>

        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          {/* Left Column - Image Gallery */}
          <div className="lg:w-[55%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewAngle}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="aspect-video rounded-2xl bg-gradient-to-br from-hp-blue/5 to-hp-navy/5 flex items-center justify-center mb-4 relative overflow-hidden"
              >
                <img
                  src={product.images.front}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
                <span className="absolute bottom-4 right-4 text-sm font-medium text-hp-gray-400 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  {viewAngle} View
                </span>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3">
              {thumbnailLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => setViewAngle(label)}
                  className={`flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    viewAngle === label
                      ? 'bg-hp-blue text-white shadow-md'
                      : 'bg-hp-gray-50 text-hp-gray-600 hover:bg-hp-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:w-[45%]">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-hp-blue/10 text-hp-blue text-xs font-semibold rounded-full uppercase tracking-wide">
                {product.series}
              </span>
              {product.badges?.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 bg-hp-success/10 text-hp-success text-xs font-semibold rounded-full"
                >
                  {badge}
                </span>
              ))}
              {product.newArrival && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  New Arrival
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-hp-navy mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-sm text-hp-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-sm text-hp-gray-500 block">Starting at</span>
              <span className="text-3xl font-bold text-hp-navy">
                ${product.price.toLocaleString()}
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2.5 h-2.5 rounded-full ${stockColor}`} />
              <span className="text-sm font-medium text-hp-gray-700">{stockLabel}</span>
            </div>

            <div className="h-px bg-hp-gray-200 mb-6" />

            {/* Key Features */}
            <h2 className="text-lg font-semibold text-hp-navy mb-3">Key Features</h2>
            <ul className="space-y-2.5 mb-6">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-hp-blue mt-0.5 shrink-0" />
                <span className="text-sm text-hp-gray-700">
                  {product.processor} &middot; {product.gpu}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-hp-blue mt-0.5 shrink-0" />
                <span className="text-sm text-hp-gray-700">
                  {product.ram} GB {product.ramType} RAM
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-hp-blue mt-0.5 shrink-0" />
                <span className="text-sm text-hp-gray-700">{product.storage}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-hp-blue mt-0.5 shrink-0" />
                <span className="text-sm text-hp-gray-700">
                  {product.displaySize} &middot; {product.resolution} &middot;{' '}
                  {product.panelType} &middot; {product.refreshRate} Hz
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-hp-blue mt-0.5 shrink-0" />
                <span className="text-sm text-hp-gray-700">
                  {product.batteryLife} battery life
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4.5 h-4.5 text-hp-blue mt-0.5 shrink-0" />
                <span className="text-sm text-hp-gray-700">{product.weight} kg</span>
              </li>
            </ul>

            <div className="h-px bg-hp-gray-200 mb-6" />

            {/* AI Features */}
            {product.aiFeatures.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-hp-navy mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-hp-blue" />
                  AI Features
                </h2>
                <ul className="space-y-2 mb-6">
                  {product.aiFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-hp-gray-700"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-hp-blue shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="h-px bg-hp-gray-200 mb-6" />
              </>
            )}

            {/* Action Buttons */}
            <div ref={buyButtonsRef} className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-hp-blue text-white font-semibold rounded-xl hover:bg-hp-blue-dark transition-colors shadow-lg shadow-hp-blue/20">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm border-2 transition-all ${
                    isInWishlist(product.id)
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-hp-gray-200 text-hp-gray-600 hover:border-hp-gray-300'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  Wishlist
                </button>
                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm border-2 transition-all ${
                    isInCompare(product.id)
                      ? 'border-hp-blue bg-hp-blue/5 text-hp-blue'
                      : 'border-hp-gray-200 text-hp-gray-600 hover:border-hp-gray-300'
                  }`}
                >
                  <GitCompareArrows className="w-4 h-4" />
                  Compare
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm border-2 border-hp-gray-200 text-hp-gray-600 hover:border-hp-gray-300 transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-hp-navy mb-6">Technical Specifications</h2>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-hp-gray-200 mb-6 overflow-x-auto">
              {specTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === tab ? 'text-hp-blue' : 'text-hp-gray-500 hover:text-hp-gray-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeSpecTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-hp-blue"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Spec Table */}
            <div className="bg-white rounded-2xl border border-hp-gray-100 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {specData[activeTab].map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex flex-col sm:flex-row sm:items-center px-6 py-4 ${
                        i % 2 === 0 ? 'bg-white' : 'bg-hp-gray-50'
                      }`}
                    >
                      <span className="sm:w-1/3 text-sm text-hp-gray-500 mb-1 sm:mb-0">
                        {row.label}
                      </span>
                      <span className="sm:w-2/3 text-sm text-hp-navy font-medium">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </ScrollReveal>

        {/* Reviews Section */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-hp-navy mb-6">Customer Reviews</h2>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Summary */}
              <div className="md:w-1/3 bg-hp-gray-50 rounded-2xl p-6 text-center">
                <span className="text-5xl font-bold text-hp-navy block mb-2">
                  {product.rating}
                </span>
                <div className="flex justify-center mb-2">
                  <StarRating rating={product.rating} />
                </div>
                <span className="text-sm text-hp-gray-500">
                  Based on {product.reviews} reviews
                </span>
              </div>

              {/* Distribution */}
              <div className="md:w-2/3 space-y-2.5">
                {ratingDistribution.map(({ stars, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-hp-gray-600 w-12 shrink-0">
                      {stars} star
                    </span>
                    <div className="flex-1 h-3 bg-hp-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="h-full bg-amber-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm text-hp-gray-500 w-10 text-right">
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-4 mb-6">
              {sampleReviews.map((review, i) => (
                <div key={i} className="bg-white border border-hp-gray-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-hp-blue/10 flex items-center justify-center text-hp-blue font-semibold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-hp-navy text-sm">{review.name}</p>
                        <p className="text-xs text-hp-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${
                            j < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-hp-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-hp-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>

            <button className="px-6 py-3 border-2 border-hp-blue text-hp-blue rounded-xl font-medium hover:bg-hp-blue/5 transition-colors text-sm">
              Write a Review
            </button>
          </section>
        </ScrollReveal>

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <ScrollReveal>
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-hp-navy mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommended.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>

      {/* Sticky Buy Bar (Mobile Only) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="bg-white/80 backdrop-blur-xl border-t border-hp-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-hp-navy truncate">{product.name}</p>
                  <p className="text-lg font-bold text-hp-navy">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-5 py-3 bg-hp-blue text-white font-semibold rounded-xl shrink-0 shadow-lg shadow-hp-blue/20">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
