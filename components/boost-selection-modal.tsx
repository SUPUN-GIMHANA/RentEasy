"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

interface BoostPlan {
  id: string
  name: string
  duration: string
  price: number
  features: string[]
  popular?: boolean
}

interface BoostSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  itemImage: string
  plans: BoostPlan[]
  onSelectPlan: (planId: string, planName: string, price: number) => void
}

export function BoostSelectionModal({
  open,
  onOpenChange,
  itemName,
  itemImage,
  plans,
  onSelectPlan,
}: BoostSelectionModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const handleSelectPlan = () => {
    if (selectedPlanId) {
      const plan = plans.find((p) => p.id === selectedPlanId)
      if (plan) {
        onSelectPlan(selectedPlanId, plan.name, plan.price)
        setSelectedPlanId(null)
        onOpenChange(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Boost Plan for: {itemName}</DialogTitle>
          <DialogDescription>
            Choose the best boost plan to increase visibility and reach more customers
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedPlanId === plan.id
                  ? "border-[#2B70FF] border-2 shadow-lg"
                  : "hover:shadow-lg"
              } ${plan.popular ? "md:scale-105" : ""}`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B70FF]">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    / {plan.duration}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#2B70FF]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelectPlan}
            disabled={!selectedPlanId}
            className="flex-1 bg-[#2B70FF] hover:bg-[#1A4FCC]"
          >
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
