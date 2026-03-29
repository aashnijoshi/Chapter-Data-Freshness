"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Shield,
  MapPin,
  Lightbulb,
  Rocket,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (startOnView && !isInView) return
    if (hasStarted.current) return
    hasStarted.current = true

    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, isInView, startOnView])

  return { count, ref }
}

// Section component with animation
function Section({
  id,
  children,
  className = "",
}: {
  id: string
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// Metric card component
function MetricCard({
  value,
  label,
  description,
  icon: Icon,
  delay = 0,
}: {
  value: string | number
  label: string
  description: string
  icon: React.ElementType
  delay?: number
}) {
  const numericValue =
    typeof value === "string" ? parseInt(value.replace(/,/g, "")) : value
  const { count, ref } = useAnimatedCounter(numericValue)
  const formattedCount =
    typeof value === "string" && value.includes(",")
      ? count.toLocaleString()
      : typeof value === "string" && value.includes("%")
        ? `${count}%`
        : count

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30"
    >
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-150" />
      <div className="relative">
        <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
          {formattedCount}
        </div>
        <div className="mb-2 text-sm font-medium text-foreground">{label}</div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

// Expandable callout component
function Callout({
  title,
  children,
  variant = "default",
}: {
  title: string
  children: React.ReactNode
  variant?: "default" | "warning" | "success"
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const bgColors = {
    default: "bg-secondary/50",
    warning: "bg-chart-4/10",
    success: "bg-chart-3/10",
  }
  const borderColors = {
    default: "border-secondary",
    warning: "border-chart-4/30",
    success: "border-chart-3/30",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`rounded-xl border ${borderColors[variant]} ${bgColors[variant]} p-4 cursor-pointer transition-all duration-300`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Navigation items
const navItems = [
  { id: "summary", label: "Summary" },
  { id: "churn", label: "Plan Churn" },
  { id: "renames", label: "Renames" },
  { id: "stability", label: "Stability" },
  { id: "enrollment", label: "Enrollment" },
  { id: "geography", label: "Geography" },
  { id: "insights", label: "Insights" },
  { id: "next-steps", label: "Next Steps" },
]

// Chart data
const churnDataDecJan = [
  { name: "Removed", value: 1428, fill: "var(--chart-4)" },
  { name: "Added", value: 1151, fill: "var(--chart-3)" },
  { name: "Stable", value: 6435, fill: "var(--chart-1)" },
]

const churnDataJanFeb = [
  { name: "Removed", value: 5, fill: "var(--chart-4)" },
  { name: "Added", value: 11, fill: "var(--chart-3)" },
  { name: "Stable", value: 7581, fill: "var(--chart-1)" },
]

const renameData = [
  { org: "CVS Health Corporation", count: 440 },
  { org: "Health Care Service Corp", count: 243 },
  { org: "Devoted Health, Inc.", count: 213 },
  { org: "UnitedHealth Group", count: 47 },
  { org: "Humana Inc.", count: 41 },
  { org: "Centene Corporation", count: 36 },
  { org: "Elevance Health, Inc.", count: 34 },
  { org: "Lumeris Group Holdings", count: 12 },
  { org: "BCBS Michigan", count: 11 },
  { org: "Highmark Health", count: 10 },
]

const stabilityData = [
  { field: "Organization Name", changes: 40, color: "var(--chart-4)" },
  { field: "Plan Name", changes: 9, color: "var(--chart-2)" },
  { field: "Contract Effective Date", changes: 8, color: "var(--chart-2)" },
  { field: "Parent Organization", changes: 4, color: "var(--chart-2)" },
  { field: "Organization Type", changes: 0, color: "var(--chart-3)" },
  { field: "Plan Type", changes: 0, color: "var(--chart-3)" },
  { field: "Offers Part D", changes: 0, color: "var(--chart-3)" },
  { field: "SNP Plan", changes: 0, color: "var(--chart-3)" },
  { field: "EGHP", changes: 0, color: "var(--chart-3)" },
  { field: "Org Marketing Name", changes: 0, color: "var(--chart-3)" },
]

const enrollmentData = [
  { name: "Masked", value: 3212695, fill: "var(--chart-5)" },
  { name: "Non-Masked", value: 184687, fill: "var(--chart-1)" },
]

const topEnrollments = [
  { plan: "H0524-3", county: "Los Angeles County, CA", enrollment: 178107 },
  { plan: "S4802-94", county: "Los Angeles County, CA", enrollment: 136729 },
  { plan: "S5617-158", county: "Los Angeles County, CA", enrollment: 110574 },
  { plan: "S4802-134", county: "Maricopa County, AZ", enrollment: 94308 },
  { plan: "H0524-805", county: "Los Angeles County, CA", enrollment: 93054 },
]

const statesCoverage = [
  { state: "Texas", counties: 254, plans: 528 },
  { state: "Georgia", counties: 159, plans: 424 },
  { state: "Virginia", counties: 136, plans: 414 },
  { state: "Kentucky", counties: 120, plans: 335 },
  { state: "Missouri", counties: 115, plans: 356 },
]

const stateDrops = [
  { state: "South Carolina", change: -31, percent: "-7.4%" },
  { state: "Illinois", change: -30, percent: "-6.9%" },
  { state: "Oklahoma", change: -24, percent: "-6.9%" },
  { state: "Pennsylvania", change: -23, percent: "-5.3%" },
  { state: "Ohio", change: -21, percent: "-5.1%" },
  { state: "Montana", change: -20, percent: "-7.5%" },
]

const stateGains = [
  { state: "Puerto Rico", change: 10, percent: "+4.4%" },
  { state: "Florida", change: 8, percent: "+1.4%" },
  { state: "New Mexico", change: 7, percent: "+2.3%" },
  { state: "Washington", change: 5, percent: "+1.3%" },
  { state: "California", change: 2, percent: "+0.4%" },
]

const opportunities = [
  {
    title: "Automated freshness scoring",
    description:
      "A pipeline that ingests each CMS release, scores every plan on how recently its data changed, and flags anything that looks stale before it reaches the matching engine.",
    icon: RefreshCw,
  },
  {
    title: "Provider directory validation",
    description:
      "CMS is building a national provider directory with FHIR APIs for 2027. Cross-referencing plan networks against that directory would catch a second layer of staleness (plan data is fresh but the provider list is months old).",
    icon: Shield,
  },
  {
    title: "Formulary change tracking",
    description:
      "CMS publishes quarterly drug formulary files. Diffing those the same way would catch medication coverage changes that directly affect what seniors pay.",
    icon: Lightbulb,
  },
  {
    title: "Enrollment trend monitoring",
    description:
      "With access to unmasked data, track which plans are gaining or losing members as an early warning signal for plan instability.",
    icon: TrendingUp,
  },
  {
    title: "Plan year transition playbook",
    description:
      "The December to January churn is predictable. A system could pre-stage expected changes and validate the actual CMS data against those expectations on January 1st.",
    icon: Rocket,
  },
]

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("summary")

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`whitespace-nowrap text-sm font-medium transition-colors duration-200 ${activeSection === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <Section id="hero" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
              CMS Plan Data: A Freshness Analysis
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl text-pretty">

            </p>
            <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
              <p className="leading-relaxed text-muted-foreground">
                I pulled 3 months of public CMS plan data (Dec 2025, Jan 2026, Feb 2026) and compared them. The goal being to understand how the upstream data that a plan matching engine depends on actually behaves. What changes, what stays stable, and where the risks are.
              </p>
            </div>
          </motion.div>
        </Section>

        {/* Executive Summary Cards */}
        <Section id="summary" className="mb-20">
          <h2 className="mb-8 text-2xl font-semibold text-foreground">
            Executive Summary
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <MetricCard
              value="1,428"
              label="plans disappeared"
              description="Between December and January, when the new plan year starts"
              icon={TrendingDown}
              delay={0}
            />
            <MetricCard
              value="1,151"
              label="new plans appeared"
              description="Net loss of 277 plans. The market contracted slightly."
              icon={TrendingUp}
              delay={0.1}
            />
            <MetricCard
              value="1,197"
              label="plans renamed"
              description="That's 1 in 6 plans changing their display name overnight"
              icon={RefreshCw}
              delay={0.2}
            />
            <MetricCard
              value="94"
              label="% enrollment masked"
              description="CMS hides most enrollment counts in public data"
              icon={Shield}
              delay={0.3}
            />
            <MetricCard
              value="0"
              label="structural changes"
              description="Plan type, SNP status, Part D: nothing changed Jan to Feb"
              icon={AlertTriangle}
              delay={0.4}
            />
          </div>
        </Section>

        {/* Plan Churn Section */}
        <Section id="churn" className="mb-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            What happens at the plan year transition
          </h2>
          <p className="mb-8 max-w-3xl text-muted-foreground">
            Every January 1, Medicare Advantage plans reset. Some terminate, new ones launch, and carriers restructure their portfolios. This year was historically elevated. KFF found that 2.6 million enrollees (13%) had their plan terminated entering 2026, double the rate from 2024. Carriers are pulling back from unprofitable markets. The data shows it clearly: 1,428 plans removed in the Dec to Jan transition (18% of the entire plan universe). But between January and February? Only 5 plans removed. The plan year transition is where the risk is. Mid-year is calm.
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                December → January
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={churnDataDecJan} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {churnDataDecJan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-chart-4" />
                  <span className="text-muted-foreground">
                    1,428 Removed
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-chart-3" />
                  <span className="text-muted-foreground">1,151 Added</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-chart-1" />
                  <span className="text-muted-foreground">6,435 Stable</span>
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                January → February
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={churnDataJanFeb} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={80}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {churnDataJanFeb.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-chart-4" />
                  <span className="text-muted-foreground">5 Removed</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-chart-3" />
                  <span className="text-muted-foreground">11 Added</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-chart-1" />
                  <span className="text-muted-foreground">7,581 Stable</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Callout title="Key Insight" variant="warning">
              If a plan matching engine is still working off December&apos;s data on January 2nd, it&apos;s recommending plans that don&apos;t exist anymore, to people who just lost their coverage and are actively looking for a new plan. That&apos;s the worst possible time to be wrong.
            </Callout>
          </div>
        </Section>

        {/* Plan Rename Volatility Section */}
        <Section id="renames" className="mb-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Plan names change more than you&apos;d expect
          </h2>
          <p className="mb-8 max-w-3xl text-muted-foreground">
            1,197 plans changed their display name between December and January. Some changes are small (adding &quot;Plus&quot; or &quot;Sync&quot; to the name). Others are full rebrands. The clearest example: every Cigna-branded plan under contract H0354 became HealthSpring. Same contract, same plan ID, completely different name. This happened because Health Care Service Corporation reorganized their portfolio. If an advisor&apos;s tool shows &quot;Cigna Preferred Medicare (HMO)&quot; but the plan is now called &quot;HealthSpring Preferred (HMO)&quot;, that&apos;s a trust problem. And if any matching logic uses plan names as identifiers, it breaks silently. The only reliable way to track a plan across time is Contract ID + Plan ID. Names are not stable.
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-4xl font-semibold text-chart-4">1,197</div>
                <div className="text-sm text-muted-foreground">
                  plan renames Dec → Jan
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-4xl font-semibold text-chart-3">9</div>
                <div className="text-sm text-muted-foreground">
                  plan renames Jan → Feb
                </div>
              </div>
              <Callout title="Cigna → HealthSpring" variant="default">
                Under contract H0354, every Cigna-branded plan became HealthSpring. Same contract, same plan ID, completely different consumer-facing name. This is why name-based matching breaks silently.
              </Callout>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                Top Organizations by Plan Renames (Dec → Jan)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={renameData}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="var(--border)"
                  />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis
                    dataKey="org"
                    type="category"
                    width={140}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-1)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Section>

        {/* Structural Stability Section */}
        <Section id="stability" className="mb-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            What you can trust mid-year (and what you can&apos;t)
          </h2>
          <p className="mb-8 max-w-3xl text-muted-foreground">
            Between January and February, I checked every field for every plan that existed in both months (7,586 plans). The structural attributes (plan type, organization type, SNP status, Part D, EGHP) had zero changes. These are locked at the start of the plan year. But naming fields kept shifting: 40 organization name changes, 9 plan name changes, 4 parent organization changes, 8 contract effective date changes. This means structural data can be cached aggressively between January and December. Display names and org metadata need to be refreshed continuously, even mid-year.
          </p>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-foreground">
              Field-Level Changes (Jan → Feb)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={stabilityData}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis
                  dataKey="field"
                  type="category"
                  width={160}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="changes" radius={[0, 4, 4, 0]}>
                  {stabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-chart-3" />
                <span className="text-muted-foreground">Zero changes (stable)</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-chart-2" />
                <span className="text-muted-foreground">Low volatility</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-chart-4" />
                <span className="text-muted-foreground">Higher volatility</span>
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Callout title="Safe to Cache" variant="success">
              Plan type, organization type, SNP status, Part D, EGHP: zero changes between January and February. These structural fields are locked at plan year start and safe to cache aggressively.
            </Callout>
            <Callout title="Requires Fresh Data" variant="warning">
              Organization Name (40 changes), Plan Name (9), Contract Effective Date (8), Parent Organization (4). Display names and org metadata need continuous refresh, even mid-year.
            </Callout>
          </div>
        </Section>

        {/* Enrollment Masking Section */}
        <Section id="enrollment" className="mb-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Most enrollment data is hidden, but what&apos;s visible matters
          </h2>
          <p className="mb-8 max-w-3xl text-muted-foreground">
            CMS masks enrollment counts below a certain threshold for privacy. In the January file, 94.6% of rows show * instead of a number. Only 5.4% (184,687 rows) have real enrollment counts. But those visible rows reveal something important: enrollment is extremely concentrated. The top 10 plan-county combinations are almost all in Los Angeles County and Maricopa County (Phoenix). A single plan (H0524-3) has 178,107 enrollees in LA County alone. Getting a recommendation wrong in LA County affects 100x more people than getting it wrong in a rural county. Data freshness monitoring should be weighted by how many people are affected, not treated the same everywhere.
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                Enrollment Data Visibility
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={enrollmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {enrollmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value: number) => value.toLocaleString()}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-chart-5" />
                    <span className="text-muted-foreground">Masked rows</span>
                  </span>
                  <span className="font-medium text-foreground">
                    3,212,695 (94.6%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-chart-1" />
                    <span className="text-muted-foreground">Non-masked rows</span>
                  </span>
                  <span className="font-medium text-foreground">
                    184,687 (5.4%)
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                Top Plan-County Enrollments
              </h3>
              <div className="space-y-3">
                {topEnrollments.map((item, index) => (
                  <motion.div
                    key={item.plan}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-xl bg-secondary/50 p-3"
                  >
                    <div>
                      <div className="font-medium text-foreground">
                        {item.plan}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.county}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {item.enrollment.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Callout title="Note on data access" variant="default">
              In production, a company like Chapter likely accesses unmasked enrollment data through direct carrier feeds or CMS data use agreements, which would unlock full enrollment trend analysis.
            </Callout>
          </div>
        </Section>

        {/* Geographic Coverage Section */}
        <Section id="geography" className="mb-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            Same coverage footprint, fewer plan options
          </h2>
          <p className="mb-8 max-w-3xl text-muted-foreground">
            All 56 states and territories maintained Medicare Advantage coverage across all three months. No state lost or gained counties. The geographic footprint is stable. But the number of plan options within those counties shifted. South Carolina lost 31 plans (down 7.4%), Montana lost 20 (down 7.5%), Illinois lost 30 (down 6.9%). Meanwhile Florida gained 8 and California gained 2. The pattern: carriers are retreating from lower-margin states in the midwest and southeast while protecting high-enrollment markets like Florida and California. For beneficiaries in states like South Carolina or Montana, the recommendation set just got smaller, and each remaining plan matters more.
          </p>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground">
                Coverage Overview
              </h3>
              <div className="space-y-4">
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <div className="text-3xl font-semibold text-foreground">
                    56
                  </div>
                  <div className="text-sm text-muted-foreground">
                    States/Territories with coverage
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Consistent across Dec, Jan, Feb
                  </div>
                </div>
              </div>
              <h4 className="mt-6 mb-3 text-sm font-medium text-foreground">
                Top States by County Coverage (Jan)
              </h4>
              <div className="space-y-2">
                {statesCoverage.map((item) => (
                  <div
                    key={item.state}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{item.state}</span>
                    <span className="text-foreground">
                      {item.counties} counties / {item.plans} plans
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-chart-4" />
                Biggest Plan Drops
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Dec → Jan plan count decreases
              </p>
              <div className="space-y-3">
                {stateDrops.map((item, index) => (
                  <motion.div
                    key={item.state}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.state}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-chart-4">
                        {item.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({item.percent})
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-3" />
                Biggest Plan Gains
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Dec → Jan plan count increases
              </p>
              <div className="space-y-3">
                {stateGains.map((item, index) => (
                  <motion.div
                    key={item.state}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.state}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-chart-3">
                        +{item.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({item.percent})
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Callout title="Regional impact" variant="default">
              Carriers are retreating from lower-margin states while protecting high-enrollment markets. For beneficiaries in states like South Carolina or Montana, the recommendation set just got smaller, and each remaining plan matters more.
            </Callout>
          </div>
        </Section>

        {/* Why This Matters Section */}
        <Section id="insights" className="mb-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            What this means if you&apos;re building a plan matcher
          </h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Key takeaways for building a reliable, high-accuracy plan matching engine.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Refresh data immediately in January",
                description:
                  "The plan year transition causes 18% churn. Even a few days of lag means recommending plans that don't exist.",
              },
              {
                title: "Don't use plan names as identifiers",
                description:
                  "1 in 6 changed in a single month. Use Contract ID + Plan ID.",
              },
              {
                title: "Cache structural fields mid-year",
                description:
                  "Plan type, SNP status, and Part D coverage don't change between January and December.",
              },
              {
                title: "Keep refreshing display names",
                description:
                  "Organization names and plan names change even between monthly releases.",
              },
              {
                title: "Prioritize dense counties",
                description:
                  "LA County enrollment dwarfs most states. Weight your monitoring by impact.",
              },
              {
                title: "Public data has limits",
                description:
                  "94.6% of enrollment is masked. Real enrollment analysis requires unmasked carrier feeds.",
              },
            ].map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 className="mb-2 font-medium text-foreground">
                  {insight.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {insight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Next Steps Section */}
        <Section id="next-steps" className="mb-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            What I&apos;d look at next
          </h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Future work to strengthen data freshness and matching accuracy.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp, index) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20">
                  <opp.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-medium text-foreground">
                  {opp.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {opp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Analysis based on CMS Medicare Advantage CPSC monthly files (Dec 2025, Jan 2026, Feb 2026). Publicly available at cms.gov.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Built by <span className="text-foreground">Aashni Joshi</span>, March 2026
          </p>

          {/* Methodology Links */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Dive deeper into the methodology:</p>
            <div className="flex items-center justify-center gap-3">
              <a
                href="/notebook.ipynb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-muted-foreground text-[13px] shadow-sm transition-all duration-200 hover:border-accent hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                View Notebook
              </a>
              <a
                href="/analysis.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-muted-foreground text-[13px] shadow-sm transition-all duration-200 hover:border-accent hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                View Analysis PDF
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
