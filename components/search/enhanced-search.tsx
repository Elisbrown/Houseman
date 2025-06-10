"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ServiceCard } from "@/components/services/service-card"
import { useI18n } from "@/components/providers/i18n-provider"
import { useServices } from "@/hooks/use-services"
import { useCategories } from "@/hooks/use-categories"
import { Search, X, SlidersHorizontal } from "lucide-react"

interface EnhancedSearchProps {
  onServiceClick: (serviceId: string) => void
  initialQuery?: string
  initialCategory?: string | null
}

export function EnhancedSearch({ onServiceClick, initialQuery = "", initialCategory = null }: EnhancedSearchProps) {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory)
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const { categories } = useCategories()
  const { services, loading, refetch } = useServices({
    search: searchQuery,
    category: selectedCategory || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minRating: minRating,
    sortBy: sortBy === "relevance" ? "created_at" : sortBy,
    sortOrder: sortBy === "price_low" ? "asc" : "desc",
  })

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
    }
    if (initialCategory) {
      setSelectedCategory(initialCategory)
    }
  }, [initialQuery, initialCategory])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 500)
  }

  const clearFilters = () => {
    setSelectedCategory(null)
    setPriceRange([0, 100000])
    setMinRating(0)
    setSortBy("relevance")
  }

  const activeFiltersCount = [selectedCategory, priceRange[0] > 0 || priceRange[1] < 100000, minRating > 0].filter(
    Boolean,
  ).length

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t("services.searchServices")}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-12"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFiltersCount > 0 && <Badge className="ml-1 h-5 w-5 p-0 text-xs">{activeFiltersCount}</Badge>}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="animate-slide-in-down">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("services.filterBy")}</h3>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  {t("common.clearAllFilters")}
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("services.category")}</label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("services.priceRange")}</label>
              <div className="px-2">
                <Slider value={priceRange} onValueChange={setPriceRange} max={100000} step={1000} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{priceRange[0].toLocaleString()} XAF</span>
                  <span>{priceRange[1].toLocaleString()} XAF</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("services.rating")}</label>
              <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All ratings</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("services.sortBy")}</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">{t("services.relevance")}</SelectItem>
                  <SelectItem value="price_low">{t("services.price_low")}</SelectItem>
                  <SelectItem value="price_high">{t("services.price_high")}</SelectItem>
                  <SelectItem value="rating">{t("services.rating")}</SelectItem>
                  <SelectItem value="created_at">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">{t("common.activeFilters")}:</span>
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.id === selectedCategory)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 100000) && (
            <Badge variant="secondary" className="gap-1">
              {priceRange[0].toLocaleString()}-{priceRange[1].toLocaleString()} XAF
              <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 100000])} />
            </Badge>
          )}
          {minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              {minRating}+ stars
              <X className="h-3 w-3 cursor-pointer" onClick={() => setMinRating(0)} />
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {loading || isSearching ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">{t("common.searching")}</span>
            </div>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {services.length} {t("common.servicesFound")}
              </p>
            </div>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={service.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ServiceCard
                    service={{
                      id: service.id,
                      title: service.title,
                      provider: `${service.provider.first_name} ${service.provider.last_name}`,
                      rating: service.rating,
                      reviewCount: service.review_count,
                      price: service.price,
                      image: service.images[0] || "/placeholder.svg",
                      isVerified: service.provider.is_verified,
                      category: service.category.name,
                    }}
                    onClick={() => onServiceClick(service.id)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-2">
                <h3 className="font-medium">{t("common.noServicesFound")}</h3>
                <p className="text-sm text-muted-foreground">{t("common.noServicesMatchFilters")}</p>
                <p className="text-sm text-muted-foreground">{t("common.tryAdjusting")}</p>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    {t("common.clearAllFilters")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
