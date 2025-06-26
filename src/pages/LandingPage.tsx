'use client'

import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, MessageSquare, Users, BarChart3, Shield, Zap, ChevronLeft, ChevronRight, ArrowRight, Check, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNavigate } from 'react-router-dom'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const JujurlyLandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Budi Santoso',
      role: 'CEO',
      company: 'TechStart Indonesia',
      content: 'Jujurly telah mengubah cara kami mengumpulkan dan menganalisis feedback pelanggan. Platform yang sangat intuitif dan powerful!',
      rating: 5,
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 2,
      name: 'Sari Dewi',
      role: 'Product Manager',
      company: 'Digital Solutions',
      content: 'Dengan Jujurly, kami dapat memahami kebutuhan pelanggan dengan lebih baik dan meningkatkan produk secara berkelanjutan.',
      rating: 5,
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 3,
      name: 'Ahmad Rahman',
      role: 'Marketing Director',
      company: 'InnovateCorp',
      content: 'Dashboard analytics yang disediakan Jujurly memberikan insight yang sangat berharga untuk strategi bisnis kami.',
      rating: 5,
      avatar: '/api/placeholder/64/64'
    }
  ]

  const features: Feature[] = [
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: 'Feedback Real-time',
      description: 'Kumpulkan feedback pelanggan secara real-time dengan berbagai format survei yang dapat disesuaikan.'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: 'Analytics Mendalam',
      description: 'Analisis data feedback dengan dashboard yang komprehensif dan laporan yang mudah dipahami.'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Kolaborasi Tim',
      description: 'Bekerja sama dengan tim untuk menindaklanjuti feedback dan meningkatkan pengalaman pelanggan.'
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Keamanan Terjamin',
      description: 'Data feedback pelanggan Anda aman dengan enkripsi tingkat enterprise dan compliance GDPR.'
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: 'Integrasi Mudah',
      description: 'Integrasikan dengan tools favorit Anda seperti Slack, Trello, dan platform CRM populer.'
    },
    {
      icon: <Star className="h-8 w-8 text-orange-600" />,
      title: 'Rating & Review',
      description: 'Sistem rating dan review yang fleksibel untuk berbagai jenis produk dan layanan.'
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Nama wajib diisi'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid'
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Pesan wajib diisi'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setFormData({ name: '', email: '', message: '' })
    alert('Pesan berhasil dikirim!')
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="space-y-8">
                <Badge variant="secondary" className="w-fit">
                  Platform Feedback Terdepan di Indonesia
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Kumpulkan Feedback
                  <span className="text-blue-600"> Pelanggan</span> dengan
                  <span className="text-blue-600"> Mudah</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Jujurly membantu bisnis Anda mengumpulkan, menganalisis, dan menindaklanjuti 
                  feedback pelanggan untuk meningkatkan kepuasan dan loyalitas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/login')}>
                    Mulai Gratis Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Lihat Demo
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">10K+</div>
                    <div className="text-sm text-muted-foreground">Pengguna Aktif</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4.9/5</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Dashboard Feedback</h3>
                      <Badge variant="secondary">Live</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">94%</div>
                          <div className="text-sm text-muted-foreground">Kepuasan</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">1,247</div>
                          <div className="text-sm text-muted-foreground">Feedback</div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-600 rounded-full" 
                                style={{ width: `${Math.random() * 60 + 40}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Fitur Unggulan
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Semua yang Anda Butuhkan untuk
              <span className="text-blue-600"> Feedback Management</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Platform lengkap dengan fitur-fitur canggih untuk membantu Anda 
              memahami dan merespons feedback pelanggan dengan efektif.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group">
                  <CardHeader>
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section 1 */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Siap Meningkatkan Kepuasan Pelanggan?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan bisnis yang telah mempercayai Jujurly 
              untuk mengelola feedback pelanggan mereka.
            </p>
            <Button onClick={() => navigate('/register')} size="lg" variant="secondary" className="text-lg px-8 py-6">
              Coba Gratis 14 Hari
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Testimoni Pelanggan
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Apa Kata <span className="text-blue-600">Pelanggan Kami</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dengarkan pengalaman nyata dari pelanggan yang telah merasakan 
              manfaat menggunakan platform Jujurly.
            </p>
          </AnimatedSection>

          <div className="relative max-w-4xl mx-auto">
            <Card className="p-8 lg:p-12">
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-xl lg:text-2xl leading-relaxed italic">
                  "{testimonials[currentTestimonial]?.content}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={testimonials[currentTestimonial]?.avatar} />
                    <AvatarFallback>
                      {testimonials[currentTestimonial]?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-lg">
                      {testimonials[currentTestimonial]?.name}
                    </div>
                    <div className="text-muted-foreground">
                      {testimonials[currentTestimonial]?.role} di {testimonials[currentTestimonial]?.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <AnimatedSection>
              <div className="space-y-8">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    Hubungi Kami
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    Ada Pertanyaan? <span className="text-blue-600">Mari Bicara</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Tim ahli kami siap membantu Anda memahami bagaimana Jujurly 
                    dapat meningkatkan strategi feedback management bisnis Anda.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-muted-foreground">hello@jujurly.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Telepon</div>
                      <div className="text-muted-foreground">+62 21 1234 5678</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Alamat</div>
                      <div className="text-muted-foreground">Jakarta, Indonesia</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <Card className="p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Kirim Pesan</CardTitle>
                  <CardDescription>
                    Isi form di bawah ini dan kami akan segera menghubungi Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={formErrors.name ? 'border-red-500' : ''}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Textarea
                        placeholder="Pesan Anda"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={formErrors.message ? 'border-red-500' : ''}
                      />
                      {formErrors.message && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Mulai Perjalanan Feedback Management Anda
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan bisnis yang telah meningkatkan kepuasan 
              pelanggan mereka dengan Jujurly. Gratis untuk 14 hari pertama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/register')} size="lg" variant="secondary" className="text-lg px-8 py-6">
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
                Jadwalkan Demo
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                <Check className="h-6 w-6 text-green-400" />
                <span>Setup dalam 5 menit</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="h-6 w-6 text-green-400" />
                <span>Tidak perlu kartu kredit</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Check className="h-6 w-6 text-green-400" />
                <span>Support 24/7</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-400">Jujurly</h3>
              <p className="text-gray-400">
                Platform feedback management terdepan untuk bisnis modern di Indonesia.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Produk</h4>
              <div className="space-y-2 text-gray-400">
                <div>Feedback Collection</div>
                <div>Analytics Dashboard</div>
                <div>Team Collaboration</div>
                <div>API Integration</div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Perusahaan</h4>
              <div className="space-y-2 text-gray-400">
                <div>Tentang Kami</div>
                <div>Karir</div>
                <div>Blog</div>
                <div>Kontak</div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Dukungan</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Dokumentasi</div>
                <div>Status</div>
                <div>Kebijakan Privasi</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Jujurly. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default JujurlyLandingPage
