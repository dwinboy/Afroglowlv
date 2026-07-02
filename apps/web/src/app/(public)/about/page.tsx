'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Target, Eye, Heart, Award, Users, Star, MapPin, ArrowRight } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

const TEAM = [
  {
    name: 'Nkonglac Desmond F.',
    role: 'Founder & Owner',
    bio:  'A Cameroonian entrepreneur who arrived in Vilnius in 2018 and built Afroglow around trust, precision, cultural pride, and professional service.',
  },
]

const VALUES = [
  { icon: Star,   title: 'Precision',       desc: 'Clean work, careful consultation, and attention to every detail.' },
  { icon: Heart,  title: 'Respect',         desc: 'Every client and professional is welcomed with dignity and care.' },
  { icon: Award,  title: 'Authenticity',    desc: 'African grooming heritage delivered with modern salon standards.' },
  { icon: Users,  title: 'Opportunity',     desc: 'A platform where skilled professionals can grow their reputation.' },
]

const MILESTONES = [
  { year: '2018', event: 'Nkonglac Desmond F. arrived in Vilnius from Cameroon and began learning the local beauty and grooming market.' },
  { year: '2019', event: 'He started building relationships with clients, barbers, stylists, and communities that needed reliable textured-hair expertise.' },
  { year: '2021', event: 'The idea for Afroglow became clearer: a professional space where African grooming culture and European service standards meet.' },
  { year: '2024', event: 'Afroglow grew into a structured salon concept with services, professionals, booking workflows, and a strong visual identity.' },
  { year: '2026', event: 'The platform now supports online booking, admin-managed services, professional profiles, gallery work, pricing, and working hours.' },
]

const ABOUT_LT = {
  heroTitle: ['Mūsų', 'istorija'],
  heroText: 'Afroglow yra profesionali grožio ir kirpimo erdvė Vilniuje, sukurta Nkonglac Desmond F. - kamerūniečio verslininko, kuris į Vilnių atvyko 2018 metais.',
  storyTitle: 'Nuo Kamerūno iki Vilniaus: profesionalumo istorija',
  story: [
    'Nkonglac Desmond F. atvyko į Vilnių 2018 metais iš Kamerūno. Gyvendamas Lietuvoje jis pastebėjo aiškų poreikį patikimai, kultūriškai suprantančiai ir profesionaliai afro bei tekstūruotų plaukų priežiūros erdvei.',
    'Afroglow buvo kuriamas kaip atsakas į šį poreikį: vieta, kur klientai gali gauti tvarkingą kirpimą, barzdos formavimą, pynimus, lokus, stilizavimą ir konsultaciją be kompromisų dėl kokybės.',
    'Šiandien Afroglow siekia būti daugiau nei įprastas salonas. Tai auganti grožio platforma, jungianti klientus, specialistus, darbo vietų nuomą, galerijas ir aiškią administravimo sistemą vienoje profesionalioje patirtyje.',
  ],
  join: 'Prisijungti prie bendruomenės',
  clients: 'Vilniuje nuo 2018 m.',
  missionTitle: 'Mūsų misija',
  mission: 'Sukurti patikimą, estetišką ir kultūriškai suprantančią grožio erdvę, kurioje klientai gauna kokybiškas paslaugas, o specialistai turi sąlygas augti profesionaliai.',
  visionTitle: 'Mūsų vizija',
  vision: 'Tapti viena iš stipriausių afro, tekstūruotų plaukų ir daugiakultūrio grožio erdvių Baltijos šalyse - žinoma dėl kokybės, pagarbos, autentiškumo ir modernios klientų patirties.',
  valuesTitle: 'Mūsų vertybės',
  journeyTitle: 'Mūsų kelias',
  teamTitle: 'Įkūrėjas',
  teamSubtitle: 'Žmogus, kuriantis Afroglow kryptį ir standartą',
  rentTitle: 'Profesionali erdvė klientams ir specialistams',
  rentText: 'Afroglow sukurta klientams, kurie vertina tvarką, kokybę ir pagarbą, bei specialistams, kurie nori dirbti profesionalioje aplinkoje su aiškia sistema.',
  apply: 'Pateikti paraišką',
  visit: 'Rezervuoti vizitą',
  values: [
    { title: 'Tikslumas', desc: 'Švarus darbas, aiški konsultacija ir dėmesys kiekvienai detalei.' },
    { title: 'Pagarba', desc: 'Kiekvienas klientas ir specialistas sutinkamas oriai ir rūpestingai.' },
    { title: 'Autentiškumas', desc: 'Puoselėjame kultūrinį grožio paveldą ir modernias technikas.' },
    { title: 'Galimybės', desc: 'Platforma, kurioje geri specialistai gali auginti savo vardą.' },
  ],
  milestones: [
    'Nkonglac Desmond F. atvyko į Vilnių iš Kamerūno ir pradėjo pažinti vietinę grožio bei kirpimo rinką.',
    'Jis pradėjo kurti ryšius su klientais, kirpėjais, stilistais ir bendruomenėmis, kurioms reikėjo patikimos tekstūruotų plaukų priežiūros.',
    'Afroglow idėja tapo aiškesnė: profesionali erdvė, kur Afrikos grožio kultūra susitinka su europietiška paslaugų kokybe.',
    'Afroglow išaugo į struktūruotą salono koncepciją su paslaugomis, specialistais, rezervacijomis ir aiškiu prekės ženklu.',
    'Platforma palaiko internetinę rezervaciją, administruojamas paslaugas, specialistų profilius, galerijas, kainas ir darbo valandas.',
  ],
  team: [
    { role: 'Įkūrėjas ir savininkas', bio: 'Kamerūnietis verslininkas, kuris į Vilnių atvyko 2018 m. ir Afroglow kuria remdamasis pasitikėjimu, tikslumu, kultūriniu pasididžiavimu ir profesionalia paslauga.' },
  ],
}

export default function AboutPage() {
  const { locale } = useI18n()
  const values = locale === 'lt'
    ? VALUES.map((v, i) => ({ ...v, title: ABOUT_LT.values[i].title, desc: ABOUT_LT.values[i].desc }))
    : VALUES
  const milestones = locale === 'lt'
    ? MILESTONES.map((m, i) => ({ ...m, event: ABOUT_LT.milestones[i] }))
    : MILESTONES
  const team = locale === 'lt'
    ? TEAM.map((m, i) => ({ ...m, role: ABOUT_LT.team[i].role, bio: ABOUT_LT.team[i].bio }))
    : TEAM
  const c = locale === 'lt' ? ABOUT_LT : null

  return (
    <div className="min-h-screen bg-luxury-black pt-20">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="gold-line mb-6" />
            <h1 className="section-title mb-6">
              {c ? c.heroTitle[0] : 'Our'} <span className="gold-shimmer">{c ? c.heroTitle[1] : 'Story'}</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {c ? c.heroText : 'Afroglow is a professional beauty and grooming space in Vilnius founded by Nkonglac Desmond F., a Cameroonian entrepreneur who arrived in Lithuania in 2018.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                {c ? c.storyTitle : 'From Cameroon to Vilnius: A Professional Beauty Story'}
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                {(c ? c.story : [
                  'Nkonglac Desmond F. arrived in Vilnius from Cameroon in 2018. Living in Lithuania, he saw a clear need for a salon experience that understood textured hair, modern grooming, cultural identity, and professional client care.',
                  'Afroglow was built as the answer to that need: a place where clients can book sharp cuts, beard grooming, braids, locs, styling, and consultation with confidence, clarity, and respect.',
                  'Today, Afroglow is growing into more than a traditional salon. It is a beauty platform connecting clients, professionals, portfolio galleries, working spot rentals, pricing, schedules, and admin-managed service quality in one polished experience.',
                ]).map(text => <p key={text}>{text}</p>)}
              </div>
              <Link href="/rent-a-spot" className="btn-gold mt-8">
                {c ? c.join : 'Join Our Community'} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-luxury h-96">
                <Image
                  src="/images/haircuts/black-hair-barber-1.jpg"
                  alt="Afroglow barber service in Vilnius"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-gold rounded-2xl p-6 shadow-gold">
                <p className="text-3xl font-bold text-gradient-gold">2018</p>
                <p className="text-sm text-gray-300">{c ? c.clients : 'In Vilnius since'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-luxury-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-luxury p-8">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20
                              flex items-center justify-center mb-6">
                <Target size={22} className="text-gold-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">{c ? c.missionTitle : 'Our Mission'}</h3>
              <p className="text-gray-400 leading-relaxed">
                {c ? c.mission : 'To create a trusted, stylish, and culturally aware beauty space where clients receive high-quality service and professionals have the structure to grow their craft and reputation.'}
              </p>
            </div>
            <div className="card-luxury p-8">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20
                              flex items-center justify-center mb-6">
                <Eye size={22} className="text-gold-400" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">{c ? c.visionTitle : 'Our Vision'}</h3>
              <p className="text-gray-400 leading-relaxed">
                {c ? c.vision : 'To become one of the strongest Afro, textured-hair, and multicultural beauty destinations in the Baltics, known for quality, respect, authenticity, and a modern client experience.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">{c ? c.valuesTitle : 'Our Values'}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-luxury p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20
                                flex items-center justify-center mx-auto mb-4">
                  <v.icon size={20} className="text-gold-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">{v.title}</h4>
                <p className="text-xs text-gray-400">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-luxury-charcoal/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">{c ? c.journeyTitle : 'Our Journey'}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-luxury-border" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-8 pl-20 relative"
                >
                  <div className="absolute left-4 w-8 h-8 rounded-full bg-gradient-gold
                                  flex items-center justify-center -translate-x-1/2 flex-shrink-0">
                    <span className="text-luxury-black text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="card-luxury p-5">
                    <span className="text-gold-400 font-bold text-sm">{m.year}</span>
                    <p className="text-white mt-1">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">{c ? c.teamTitle : 'Founder'}</h2>
            <p className="section-subtitle mx-auto">{c ? c.teamSubtitle : 'The person shaping Afroglow’s direction and standard'}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 max-w-xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-luxury overflow-hidden group text-center"
              >
                <div className="h-56 bg-gradient-hero flex items-center justify-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-gold flex items-center justify-center shadow-gold">
                    <span className="text-luxury-black font-serif text-4xl font-bold">D</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-white text-lg">{member.name}</h3>
                  <p className="text-xs text-gold-400 font-semibold mb-3 uppercase tracking-wider">{member.role}</p>
                  <p className="text-sm text-gray-400">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why rent CTA */}
      <section className="py-24 bg-luxury-charcoal/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-3"><div className="gold-line" /></div>
          <h2 className="section-title mb-6">{c ? c.rentTitle : 'A Professional Space for Clients and Specialists'}</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {c ? c.rentText : 'Afroglow is built for clients who value clean service, quality, and respect, and for specialists who want to work in a professional environment with a clear system.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rent-a-spot" className="btn-gold text-base px-8 py-4">
              {c ? c.apply : 'Apply to Rent'} <ArrowRight size={16} />
            </Link>
            <Link href="/book" className="btn-outline-gold text-base px-8 py-4">
              <MapPin size={16} /> {c ? c.visit : 'Book a Visit'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
