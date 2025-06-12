import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Sparkles, Heart, Battery, Coins, CreditCard, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Pricing() {
  const [selectedTab, setSelectedTab] = useState<"subscriptions" | "topups" | "paygo">("subscriptions");

  const subscriptionPlans = [
    {
      id: 1,
      name: "PeepPower Starter",
      price: 4.99,
      interval: "month",
      juicePerDay: 100,
      features: [
        "100% PeepPower daily",
        "Basic chat stories",
        "Standard recharge rate",
        "Community support"
      ],
      color: "from-blue-500 to-blue-600",
      icon: <Battery className="w-6 h-6" />
    },
    {
      id: 2,
      name: "PeepPower Pro",
      price: 9.99,
      interval: "month",
      juicePerDay: 250,
      features: [
        "250% PeepPower daily",
        "Premium stories access",
        "2x faster recharge",
        "Early story access",
        "Priority support"
      ],
      color: "from-purple-500 to-pink-500",
      icon: <Zap className="w-6 h-6" />,
      popular: true
    },
    {
      id: 3,
      name: "PeepPower Unlimited",
      price: 19.99,
      interval: "month",
      juicePerDay: "Unlimited",
      features: [
        "Unlimited PeepPower",
        "All premium content",
        "Instant recharge",
        "Exclusive VIP stories",
        "Custom themes",
        "24/7 VIP support"
      ],
      color: "from-yellow-500 to-orange-500",
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const topUpOptions = [
    {
      id: 1,
      name: "Quick Boost",
      juice: 50,
      price: 0.99,
      bonus: 0,
      color: "from-green-500 to-green-600"
    },
    {
      id: 2,
      name: "Power Pack",
      juice: 150,
      price: 2.99,
      bonus: 25,
      color: "from-blue-500 to-blue-600",
      popular: true
    },
    {
      id: 3,
      name: "Mega Charge",
      juice: 300,
      price: 4.99,
      bonus: 75,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      name: "Ultra Power",
      juice: 500,
      price: 7.99,
      bonus: 150,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const payGoRates = [
    {
      range: "1-10 messages",
      rate: "0.05",
      description: "Perfect for casual browsing"
    },
    {
      range: "11-50 messages",
      rate: "0.04",
      description: "Great for regular readers"
    },
    {
      range: "51+ messages",
      rate: "0.03",
      description: "Best value for power users"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-green to-primary bg-clip-text text-transparent">
            PeepPower™ Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Fuel your addiction to secret chats with our flexible pricing options
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-surface rounded-lg p-1 flex space-x-1">
              <button
                onClick={() => setSelectedTab("subscriptions")}
                className={cn(
                  "px-6 py-3 rounded-md font-medium transition-all",
                  selectedTab === "subscriptions" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Crown className="w-4 h-4 inline mr-2" />
                Subscriptions
              </button>
              <button
                onClick={() => setSelectedTab("topups")}
                className={cn(
                  "px-6 py-3 rounded-md font-medium transition-all",
                  selectedTab === "topups" 
                    ? "bg-green-500 text-white" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Battery className="w-4 h-4 inline mr-2" />
                Top-ups
              </button>
              <button
                onClick={() => setSelectedTab("paygo")}
                className={cn(
                  "px-6 py-3 rounded-md font-medium transition-all",
                  selectedTab === "paygo" 
                    ? "bg-green-500 text-white" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Coins className="w-4 h-4 inline mr-2" />
                Pay-as-you-go
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        {selectedTab === "subscriptions" && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={cn(
                "relative overflow-hidden bg-gray-900 border-gray-700",
                plan.popular && "ring-2 ring-green-500"
              )}>
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className={cn(
                    "w-16 h-16 mx-auto rounded-full bg-gradient-to-r flex items-center justify-center mb-4",
                    plan.color
                  )}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {plan.juicePerDay === "Unlimited" ? "Unlimited" : `${plan.juicePerDay}%`} PeepPower daily
                  </CardDescription>
                  <div className="text-center mt-4">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400">/{plan.interval}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={cn(
                    "w-full py-6 text-lg font-semibold bg-gradient-to-r text-white",
                    plan.color
                  )}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Top-up Options */}
        {selectedTab === "topups" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Instant PeepPower Top-ups</h2>
              <p className="text-gray-400">Get more juice instantly when you need it most</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topUpOptions.map((option) => (
                <Card key={option.id} className={cn(
                  "relative overflow-hidden bg-gray-900 border-gray-700 hover:border-green-500 transition-colors",
                  option.popular && "ring-2 ring-green-500"
                )}>
                  {option.popular && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white text-xs">
                      Best Value
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <div className={cn(
                      "w-12 h-12 mx-auto rounded-full bg-gradient-to-r flex items-center justify-center mb-3",
                      option.color
                    )}>
                      <Battery className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-white">{option.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="text-center space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-green-400">
                        {option.juice + option.bonus}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {option.juice}% + {option.bonus}% bonus
                      </div>
                    </div>
                    
                    <div className="text-2xl font-bold text-white">
                      ${option.price}
                    </div>
                    
                    <Button className={cn(
                      "w-full bg-gradient-to-r text-white",
                      option.color
                    )}>
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pay-as-you-go */}
        {selectedTab === "paygo" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Pay-as-you-go Pricing</h2>
              <p className="text-gray-400">Only pay for what you use - perfect for occasional readers</p>
            </div>
            
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-white flex items-center justify-center space-x-2">
                  <CreditCard className="w-6 h-6" />
                  <span>Flexible Pricing Tiers</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {payGoRates.map((tier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-lg font-semibold text-white">{tier.range}</div>
                      <div className="text-sm text-gray-400">{tier.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">${tier.rate}</div>
                      <div className="text-sm text-gray-400">per message</div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center mt-8">
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 text-lg">
                    Start Pay-as-you-go
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    No commitment • Pay only for messages you read
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-[#161b22] rounded-lg border border-[#21262d]">
          <h3 className="text-2xl font-bold text-[#f0f6fc] mb-4">
            Need help choosing the right plan?
          </h3>
          <p className="text-[#7d8590] mb-6">
            Our PeepPower experts are here to help you find the perfect plan for your chat addiction
          </p>
          <Button className="bg-[#0969da] text-white hover:bg-[#0860ca] border-none">
            Contact Support
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}