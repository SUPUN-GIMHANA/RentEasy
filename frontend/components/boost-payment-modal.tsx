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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreditCard } from "lucide-react"

interface BoostPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  planName: string
  amount: number
  onPaymentSuccess: () => void
}

export function BoostPaymentModal({
  open,
  onOpenChange,
  itemName,
  planName,
  amount,
  onPaymentSuccess,
}: BoostPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      alert("Please fill in all payment details")
      return
    }

    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)

    // Clear form
    setCardNumber("")
    setCardExpiry("")
    setCardCvc("")
    setCardName("")

    onPaymentSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Secure payment for your boost plan
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Item:</span>
                <span className="font-medium">{itemName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{planName}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-[#2B70FF]">${amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-name">Cardholder Name</Label>
            <Input
              id="card-name"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-expiry">Expiry Date</Label>
              <Input
                id="card-expiry"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-cvc">CVC</Label>
              <Input
                id="card-cvc"
                placeholder="123"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                maxLength={3}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-[#2B70FF] hover:bg-[#1A4FCC]"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ${amount}
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          This is a demo payment. No real charges will be made.
        </p>
      </DialogContent>
    </Dialog>
  )
}
