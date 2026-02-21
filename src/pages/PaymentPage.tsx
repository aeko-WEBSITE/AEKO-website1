import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Check, X, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { paymentAPI, authAPI, packageAPI } from "@/lib/api";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Package {
  _id: string;
  name: string;
  description?: string;
  includedCredits: number;
  actualPrice: number;
  currentPrice: number;
  offer?: string | null;
  sortOrder?: number;
  // Legacy fields for backward compatibility
  price?: number;
  credits?: number;
  features?: string[];
  duration?: number;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [packageId, setPackageId] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPackageSelection, setShowPackageSelection] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Get package ID from URL params or location state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("packageId") || location.state?.packageId;
    
    if (!id) {
      // No package selected - fetch all packages for selection
      setShowPackageSelection(true);
      fetchAllPackages();
      setLoading(false);
      return;
    }

    setPackageId(id);
    setShowPackageSelection(false);
    fetchPackage(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const fetchAllPackages = async () => {
    try {
      setLoading(true);
      const data = await packageAPI.getAll();
      const packagesList = Array.isArray(data) ? data : (data.packages || []);
      const validPackages = packagesList
        .filter((pkg: Package) => pkg && pkg.isActive !== false && pkg._id && pkg.name && pkg.price !== undefined && pkg.credits !== undefined)
        .sort((a: Package, b: Package) => a.price - b.price);
      setPackages(validPackages);
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      toast.error(error.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setPackageId(pkg._id);
    setPackageData(pkg);
    setShowPackageSelection(false);
    // Update URL without reload
    navigate(`/payment?packageId=${pkg._id}`, { replace: true });
  };

  const fetchPackage = async (id: string) => {
    try {
      setLoading(true);
      const data = await packageAPI.getById(id);
      setPackageData(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load package");
      navigate("/pricing");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!packageId) {
      toast.error("No package selected");
      return;
    }

    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      toast.error("Please sign in to purchase a package");
      navigate("/auth/sign-in", { state: { returnTo: `/payment?packageId=${packageId}` } });
      return;
    }

    try {
      setProcessing(true);
      
      // Create Razorpay order
      const orderData = await paymentAPI.createOrder(packageId);

      // Validate order data
      if (!orderData.orderId || !orderData.amount || !orderData.keyId) {
        throw new Error("Invalid order data received from server");
      }

      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh the page.");
        setProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        order_id: orderData.orderId,
        name: "AEKO.AI",
        description: `Purchase ${packageData?.name || "package"}`,
        handler: async (response: any) => {
          try {
            // Verify payment
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Credits have been added to your wallet.");
            navigate("/dashboard");
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast.error(error.message || "Payment verification failed. Please contact support if the amount was deducted.");
            setProcessing(false);
          }
        },
        prefill: {
          name: authAPI.getCurrentUser()?.username || "",
          email: authAPI.getCurrentUser()?.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment order creation error:", error);
      
      // Handle specific error cases
      if (error.message?.includes("Authentication required")) {
        toast.error("Please sign in to purchase a package");
        navigate("/auth/sign-in", { state: { returnTo: `/payment?packageId=${packageId}` } });
      } else if (error.message?.includes("Package not found")) {
        toast.error("Package not found. Please select a valid package.");
        navigate("/pricing");
      } else if (error.message?.includes("payment gateway not configured")) {
        toast.error("Payment gateway is not configured. Please contact support.");
      } else {
        toast.error(error.message || "Failed to create payment order. Please try again.");
      }
      
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden w-full relative text-white">
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #2d1b4e 55%, #3b2a5c 75%, #4c2d5e 90%, #5c3a5a 100%)",
        }} />
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          <p className="mt-4 text-violet-200">Loading packages...</p>
        </div>
      </main>
    );
  }

  // Show package selection if no package is selected
  if (showPackageSelection) {
    return (
      <main className="min-h-screen overflow-x-hidden w-full relative text-white">
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #2d1b4e 55%, #3b2a5c 75%, #4c2d5e 90%, #5c3a5a 100%)",
        }} />
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.07]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }} />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <section className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-4xl">
              <Button
                variant="ghost"
                onClick={() => navigate("/pricing")}
                className="mb-6 text-violet-200 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pricing
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold text-white mb-2">Select a Package</h1>
                <p className="text-violet-200/70">Choose a package to proceed with payment</p>
              </motion.div>

              {packages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-8 bg-black border border-violet-400/20 text-center"
                >
                  <p className="text-violet-200/70 mb-4">No packages available at the moment.</p>
                  <Button
                    onClick={() => navigate("/pricing")}
                    className="bg-violet-500 hover:bg-violet-600"
                  >
                    Go to Pricing
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-2xl p-6 bg-black border border-violet-400/20 hover:border-violet-400/40 transition-all cursor-pointer"
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                      {pkg.description && (
                        <p className="text-sm text-violet-200/70 mb-4">{pkg.description}</p>
                      )}
                      {pkg.offer && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                            {pkg.offer}
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2 mb-4">
                        {pkg.actualPrice > pkg.currentPrice && (
                          <span className="text-lg font-medium text-violet-300/60 line-through">
                            ₹{pkg.actualPrice ?? pkg.price ?? 0}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-white">₹{pkg.currentPrice ?? pkg.price ?? 0}</span>
                      </div>
                      <div className="text-sm text-violet-200/80 mb-4">
                        <span className="font-medium">Credits: </span>
                        <span>{(pkg.includedCredits ?? pkg.credits ?? 0).toLocaleString()}</span>
                      </div>
                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {pkg.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-violet-100/90">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        className="w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-600 text-white hover:opacity-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePackageSelect(pkg);
                        }}
                      >
                        Select Package
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Footer />
        </div>
      </main>
    );
  }

  if (!packageData) {
    return null;
  }

  return (
    <main className="min-h-screen overflow-x-hidden w-full relative text-white">
      {/* Refined gradient: deep indigo → violet → soft rose */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #2d1b4e 55%, #3b2a5c 75%, #4c2d5e 90%, #5c3a5a 100%)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <section className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-2xl">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/pricing")}
              className="mb-6 text-violet-200 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>

            {/* Payment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 sm:p-8 bg-black border border-violet-400/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-violet-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
                  <p className="text-sm text-violet-200/70">Secure payment via Razorpay</p>
                </div>
              </div>

              {/* Package Details */}
              <div className="mb-6 p-4 rounded-xl bg-violet-500/10 border border-violet-400/20">
                <h2 className="text-lg font-semibold text-white mb-2">{packageData.name}</h2>
                {packageData.description && (
                  <p className="text-sm text-violet-200/70 mb-3">{packageData.description}</p>
                )}
                {packageData.offer && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                      {packageData.offer}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-2 mb-3">
                  {packageData.actualPrice > packageData.currentPrice && (
                    <span className="text-lg font-medium text-violet-300/60 line-through">
                      ₹{packageData.actualPrice ?? packageData.price ?? 0}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-white">₹{packageData.currentPrice ?? packageData.price ?? 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-violet-200/80">
                  <span className="font-medium">Credits:</span>
                  <span>{(packageData.includedCredits ?? packageData.credits ?? 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Features */}
              {packageData.features && packageData.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3">Package Features:</h3>
                  <ul className="space-y-2">
                    {packageData.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-violet-100/90">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Payment Summary */}
              <div className="mb-6 p-4 rounded-xl bg-black/50 border border-violet-400/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-violet-200/70">Package Price</span>
                  <span className="text-lg font-semibold text-white">₹{packageData.currentPrice ?? packageData.price ?? 0}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-violet-400/10">
                  <span className="text-base font-semibold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-violet-300">₹{packageData.currentPrice ?? packageData.price ?? 0}</span>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-12 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-600 text-white font-semibold hover:opacity-95 shadow-lg shadow-violet-500/25 text-base"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              {/* Security Note */}
              <p className="mt-4 text-xs text-center text-violet-300/60">
                Your payment is secured by Razorpay. We never store your card details.
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default PaymentPage;

