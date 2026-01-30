import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search,
  Ticket,
  Star,
  DollarSign,
  Tag,
  Building2,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Download,
  Plus,
  Globe,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

type TabType = "Tickets" | "Featuring" | "Itome" | "Flipaty" | "Cominany";

const ToolsPage = () => {
  const { theme } = useTheme();
  const [activeTopTab, setActiveTopTab] = useState<TabType>("Tickets");
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data for Tickets tab
  const ticketsData = [
    {
      id: "TK-001",
      title: "Website Performance Issue",
      status: "Open",
      priority: "High",
      assignee: "John Doe",
      created: "2024-01-15",
      category: "Technical",
    },
    {
      id: "TK-002",
      title: "Feature Request: Dark Mode",
      status: "In Progress",
      priority: "Medium",
      assignee: "Jane Smith",
      created: "2024-01-14",
      category: "Enhancement",
    },
    {
      id: "TK-003",
      title: "Bug Report: Login Error",
      status: "Resolved",
      priority: "High",
      assignee: "Mike Johnson",
      created: "2024-01-13",
      category: "Bug",
    },
    {
      id: "TK-004",
      title: "API Integration Request",
      status: "Open",
      priority: "Low",
      assignee: "Sarah Williams",
      created: "2024-01-12",
      category: "Integration",
    },
    {
      id: "TK-005",
      title: "UI/UX Improvements",
      status: "In Progress",
      priority: "Medium",
      assignee: "David Brown",
      created: "2024-01-11",
      category: "Design",
    },
  ];

  // Dummy data for Featuring tab
  const featuringData = [
    {
      id: 1,
      name: "AI-Powered Analytics",
      category: "Analytics",
      status: "Active",
      views: 12500,
      likes: 892,
      rating: 4.8,
      description: "Advanced analytics dashboard with AI insights",
    },
    {
      id: 2,
      name: "Smart Automation Suite",
      category: "Automation",
      status: "Active",
      views: 9800,
      likes: 654,
      rating: 4.6,
      description: "Automate your workflow with intelligent tools",
    },
    {
      id: 3,
      name: "Real-time Collaboration",
      category: "Collaboration",
      status: "Featured",
      views: 15200,
      likes: 1200,
      rating: 4.9,
      description: "Work together seamlessly in real-time",
    },
    {
      id: 4,
      name: "Security Dashboard",
      category: "Security",
      status: "Active",
      views: 8700,
      likes: 543,
      rating: 4.7,
      description: "Monitor and manage security in one place",
    },
  ];

  // Dummy data for Itome tab
  const itomeData = [
    {
      id: 1,
      title: "Q1 2024 Revenue Report",
      type: "Financial",
      amount: "$125,000",
      date: "2024-01-15",
      status: "Completed",
    },
    {
      id: 2,
      title: "User Growth Analysis",
      type: "Analytics",
      amount: "15,234 users",
      date: "2024-01-14",
      status: "In Review",
    },
    {
      id: 3,
      title: "Marketing Campaign Results",
      type: "Marketing",
      amount: "$45,000",
      date: "2024-01-13",
      status: "Completed",
    },
    {
      id: 4,
      title: "Product Launch Metrics",
      type: "Product",
      amount: "2,500 signups",
      date: "2024-01-12",
      status: "Pending",
    },
  ];

  // Dummy data for Flipaty tab
  const flipatyData = [
    {
      id: 1,
      name: "Enterprise Plan",
      price: "$299/month",
      users: 500,
      features: ["Unlimited Storage", "Priority Support", "Advanced Analytics"],
      status: "Active",
    },
    {
      id: 2,
      name: "Professional Plan",
      price: "$99/month",
      users: 250,
      features: ["100GB Storage", "Email Support", "Basic Analytics"],
      status: "Active",
    },
    {
      id: 3,
      name: "Starter Plan",
      price: "$29/month",
      users: 120,
      features: ["10GB Storage", "Community Support"],
      status: "Active",
    },
  ];

  // Dummy data for Cominany tab
  const cominanyData = [
    {
      id: 1,
      name: "TechCorp Inc.",
      industry: "Technology",
      employees: 250,
      revenue: "$5.2M",
      status: "Active",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      name: "DesignStudio",
      industry: "Design",
      employees: 45,
      revenue: "$1.8M",
      status: "Active",
      location: "New York, NY",
    },
    {
      id: 3,
      name: "DataSolutions",
      industry: "Data Analytics",
      employees: 120,
      revenue: "$3.5M",
      status: "Active",
      location: "Austin, TX",
    },
    {
      id: 4,
      name: "CloudServices",
      industry: "Cloud Computing",
      employees: 200,
      revenue: "$4.8M",
      status: "Active",
      location: "Seattle, WA",
    },
  ];

  const getStatusColor = (status: string) => {
    const isDark = theme === "dark";
    switch (status.toLowerCase()) {
      case "open":
      case "active":
      case "completed":
        return isDark
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in progress":
      case "in review":
        return isDark
          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
          : "bg-blue-50 text-blue-700 border-blue-200";
      case "resolved":
      case "featured":
        return isDark
          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
          : "bg-purple-50 text-purple-700 border-purple-200";
      case "pending":
        return isDark
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return isDark
          ? "bg-gray-800 text-gray-300 border-gray-700"
          : "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    const isDark = theme === "dark";
    switch (priority.toLowerCase()) {
      case "high":
        return isDark
          ? "bg-red-500/20 text-red-400 border-red-500/30"
          : "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return isDark
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return isDark
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return isDark
          ? "bg-gray-800 text-gray-300 border-gray-700"
          : "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const renderTicketsContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={cn(
            "text-3xl font-bold tracking-tight",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Support Tickets
          </h2>
          <p className={cn(
            "text-sm mt-1.5",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            Manage and track all support tickets efficiently
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      <Card className={cn(
        "border shadow-sm transition-colors duration-300",
        theme === "dark" 
          ? "bg-[#0f0f0f] border-gray-800" 
          : "bg-white border-gray-200"
      )}>
        <CardHeader className={cn(
          "pb-4",
          theme === "dark" ? "border-b border-gray-800" : "border-b border-gray-200"
        )}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className={cn(
                theme === "dark" ? "text-white" : "text-gray-900"
              )}>
                Tickets Overview
              </CardTitle>
              <CardDescription className="mt-1">
                All support tickets and their current status
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                )} />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full sm:w-64 pl-9",
                    theme === "dark"
                      ? "bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                      : "bg-gray-50 border-gray-200"
                  )}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn(
                  theme === "dark" 
                    ? "border-b border-gray-800 hover:bg-gray-900/50" 
                    : "border-b border-gray-200 hover:bg-gray-50"
                )}>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Ticket ID
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Title
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Status
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Priority
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Assignee
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Category
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Created
                  </TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketsData.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className={cn(
                      theme === "dark"
                        ? "border-b border-gray-800 hover:bg-gray-900/50"
                        : "border-b border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <TableCell className={cn(
                      "font-medium",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {ticket.id}
                    </TableCell>
                    <TableCell className={cn(
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    )}>
                      {ticket.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(ticket.status))}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(ticket.priority))}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    )}>
                      {ticket.assignee}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        theme === "dark"
                          ? "bg-gray-800 text-gray-300 border-gray-700"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      )}>
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    )}>
                      {ticket.created}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFeaturingContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={cn(
            "text-3xl font-bold tracking-tight",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Featured Products
          </h2>
          <p className={cn(
            "text-sm mt-1.5",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            Discover our most popular features and products
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Feature
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuringData.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "transition-all duration-300 hover:shadow-lg",
              theme === "dark"
                ? "bg-[#0f0f0f] border-gray-800 hover:border-gray-700"
                : "bg-white border-gray-200 hover:border-gray-300"
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <CardTitle className={cn(
                      "text-xl",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {item.name}
                    </CardTitle>
                    {item.status === "Featured" && (
                      <Badge className={cn(
                        "text-xs",
                        theme === "dark"
                          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      )}>
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mb-3 text-xs",
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    )}
                  >
                    {item.category}
                  </Badge>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className={cn(
                  "flex items-center gap-6 text-sm",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{item.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">{item.likes}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderItomeContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={cn(
            "text-3xl font-bold tracking-tight",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Income Reports
          </h2>
          <p className={cn(
            "text-sm mt-1.5",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            Track revenue and financial metrics
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$195,000", change: "+12.5%", icon: DollarSign },
          { label: "Active Users", value: "15,234", change: "+8.2%", icon: Users },
          { label: "New Signups", value: "2,500", change: "+15.3%", icon: TrendingUp },
          { label: "Conversion Rate", value: "3.2%", change: "+0.5%", icon: BarChart3 },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                theme === "dark"
                  ? "bg-card border-border"
                  : "bg-white border-gray-200"
              )}
            >
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-medium uppercase tracking-wide">
                  {stat.label}
                </CardDescription>
                <CardTitle className={cn(
                  "text-2xl font-bold mt-2",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                )}>
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className={cn(
        "border shadow-sm",
        theme === "dark"
          ? "bg-card border-border"
          : "bg-white border-gray-200"
      )}>
        <CardHeader className={cn(
          "pb-4",
          theme === "dark" ? "border-b border-gray-800" : "border-b border-gray-200"
        )}>
          <CardTitle className={cn(
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Recent Reports
          </CardTitle>
          <CardDescription>Latest income and analytics reports</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn(
                  theme === "dark"
                    ? "border-b border-gray-800 hover:bg-gray-900/50"
                    : "border-b border-gray-200 hover:bg-gray-50"
                )}>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Title
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Type
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Amount
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Date
                  </TableHead>
                  <TableHead className={cn(
                    "font-semibold",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}>
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itomeData.map((item) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      theme === "dark"
                        ? "border-b border-gray-800 hover:bg-gray-900/50"
                        : "border-b border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <TableCell className={cn(
                      "font-medium",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {item.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        )}
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      "font-semibold",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {item.amount}
                    </TableCell>
                    <TableCell className={cn(
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    )}>
                      {item.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFlipatyContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={cn(
            "text-3xl font-bold tracking-tight",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Subscription Plans
          </h2>
          <p className={cn(
            "text-sm mt-1.5",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            Manage pricing and subscription tiers
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {flipatyData.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "transition-all duration-200 hover:shadow-lg",
              plan.id === 1 && "ring-2 ring-primary",
              theme === "dark"
                ? "bg-card border-border hover:border-gray-700"
                : "bg-white border-gray-200 hover:border-gray-300"
            )}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className={cn(
                  "text-xl",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  {plan.name}
                </CardTitle>
                <Badge className={cn("text-xs", getStatusColor(plan.status))}>
                  {plan.status}
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-gray-900"
                )}>
                  {plan.price}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={cn(
                  "flex items-center gap-2 text-sm pb-3 border-b border-border",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{plan.users.toLocaleString()} active users</span>
                </div>
                <div className="space-y-3">
                  <p className={cn(
                    "text-sm font-semibold",
                    theme === "dark" ? "text-white" : "text-gray-900"
                  )}>
                    Features:
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={cn(
                          "flex items-center gap-2 text-sm",
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        )}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full mt-4"
                  variant={plan.id === 1 ? "default" : "outline"}
                >
                  {plan.id === 1 ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
            </div>
  );

  const renderCominanyContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
          <h2 className={cn(
            "text-3xl font-bold tracking-tight",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Companies
          </h2>
          <p className={cn(
            "text-sm mt-1.5",
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          )}>
            Manage company profiles and information
          </p>
                    </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Company
        </Button>
                    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cominanyData.map((company) => (
          <Card
            key={company.id}
            className={cn(
              "transition-all duration-200 hover:shadow-lg",
              theme === "dark"
                ? "bg-card border-border hover:border-gray-700"
                : "bg-white border-gray-200 hover:border-gray-300"
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className={cn(
                      "w-5 h-5 shrink-0",
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    )} />
                    <CardTitle className={cn(
                      "text-xl",
                      theme === "dark" ? "text-white" : "text-gray-900"
                    )}>
                      {company.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mb-3 text-xs",
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    )}
                  >
                    {company.industry}
                  </Badge>
                </div>
                <Badge className={cn("text-xs", getStatusColor(company.status))}>
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={cn(
                  "flex items-center gap-2 text-sm",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                  <Users className="w-4 h-4 shrink-0" />
                  <span>{company.employees} employees</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-sm",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>Revenue: {company.revenue}</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-sm",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}>
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                    </div>
                    </div>
            </CardContent>
          </Card>
        ))}
                    </div>
                  </div>
  );

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "Tickets", label: "Tickets", icon: Ticket },
    { id: "Featuring", label: "Featuring", icon: Star },
    { id: "Itome", label: "Itome", icon: DollarSign },
    { id: "Flipaty", label: "Flipaty", icon: Tag },
    { id: "Cominany", label: "Cominany", icon: Building2 },
  ];

  const renderContent = () => {
    switch (activeTopTab) {
      case "Tickets":
        return renderTicketsContent();
      case "Featuring":
        return renderFeaturingContent();
      case "Itome":
        return renderItomeContent();
      case "Flipaty":
        return renderFlipatyContent();
      case "Cominany":
        return renderCominanyContent();
      default:
        return renderTicketsContent();
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === "dark"
        ? "bg-[#0a0a0a]"
        : "bg-white"
    )}>
      {/* Top Navigation Bar */}
      <div className={cn(
        "border-b shadow-sm backdrop-blur-sm transition-colors duration-300 sticky top-0 z-10",
        theme === "dark"
          ? "border-gray-800 bg-[#0a0a0a]/95"
          : "border-gray-200 bg-white/95"
      )}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1 flex-wrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTopTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      activeTopTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : theme === "dark"
                          ? "text-gray-400 hover:text-white hover:bg-gray-800/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-2",
                  theme === "dark"
                    ? "border-gray-800 bg-gray-900 hover:bg-gray-800"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                )}
              >
                <Search className="w-4 h-4" />
                Arierntes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-2",
                  theme === "dark"
                    ? "border-gray-800 bg-gray-900 hover:bg-gray-800"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                )}
              >
                <Globe className="w-4 h-4" />
                Red Wertory
              </Button>
            </div>
          </div>
        </div>
        </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <AnimatePresence mode="wait">
      <motion.div
            key={activeTopTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        </div>
    </div>
  );
};

export default ToolsPage;
