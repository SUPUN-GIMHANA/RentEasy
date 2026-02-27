"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Shield } from "lucide-react"
import { api } from "@/lib/api-client"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      await api.users.updateProfile(formData)
      setIsEditing(false)
      // Optionally refresh user data - would need to update auth context
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground mb-8">Manage your account information and preferences</p>

          <div className="grid gap-6">
            {/* Personal Information Card */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#2B70FF]" />
                  Personal Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Colombo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Sri Lanka"
                    />
                  </div>
                </div>
                {isEditing && (
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="bg-[#2B70FF] hover:bg-[#1A4FCC] transition-all duration-300 hover:scale-105"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#2B70FF]" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Account ID</p>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Role</p>
                    <p className="font-medium capitalize bg-blue-100 text-[#2B70FF] px-3 py-1 rounded w-fit">
                      {user.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-4 w-4 text-[#2B70FF]" />
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                  <p className="font-medium text-sm">{user.email}</p>
                </CardContent>
              </Card>

              {formData.phoneNumber && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="h-4 w-4 text-[#2B70FF]" />
                      <p className="text-sm text-muted-foreground">Phone</p>
                    </div>
                    <p className="font-medium text-sm">{formData.phoneNumber}</p>
                  </CardContent>
                </Card>
              )}

              {formData.city && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-4 w-4 text-[#2B70FF]" />
                      <p className="text-sm text-muted-foreground">City</p>
                    </div>
                    <p className="font-medium text-sm">{formData.city}</p>
                  </CardContent>
                </Card>
              )}

              {formData.country && (
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-4 w-4 text-[#2B70FF]" />
                      <p className="text-sm text-muted-foreground">Country</p>
                    </div>
                    <p className="font-medium text-sm">{formData.country}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
