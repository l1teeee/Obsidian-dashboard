
import { motion } from 'framer-motion';
import { TestimonialsColumn, type Testimonial } from '@/components/ui/testimonials-columns-1';

const testimonials: Testimonial[] = [
  {
    text: "We cut our weekly content planning from 8 hours to under 2. Vielinks gave us back time we didn't know we were losing.",
    image: '/favicon.png',
    name: 'Sofia Reyes',
    role: 'Social Media Director, Wavefront',
  },
  {
    text: 'Our engagement rate went up 31% in the first month. Having everything in one place means we actually analyze data instead of just collecting it.',
    image: '/favicon.png',
    name: 'Diego Ramírez',
    role: 'Content Manager, Luminary',
  },
  {
    text: 'Managing three brand accounts used to feel chaotic. Now I have everything visible at a glance and schedule a full month in one afternoon.',
    image: '/favicon.png',
    name: 'Priya Kapoor',
    role: 'Brand Manager, Onyx Labs',
  },
  {
    text: 'The AI caption suggestions alone are worth the subscription. We now publish 40% more content with the exact same team.',
    image: '/favicon.png',
    name: 'James Thornton',
    role: 'Founder, Meridian Agency',
  },
  {
    text: "I tried four other tools. Vielinks is the only one my entire team actually uses without complaints on Monday morning.",
    image: '/favicon.png',
    name: 'Ana Llorente',
    role: 'Head of Marketing, Stackline',
  },
  {
    text: 'From setup to our first scheduled post took 15 minutes. The clarity of the dashboard is something I did not know I needed until I had it.',
    image: '/favicon.png',
    name: 'Marcus Bell',
    role: 'Social Media Manager, Northpeak',
  },
  {
    text: 'Our clients love the unified analytics report. We used to spend 3 hours every week exporting data from different platform dashboards.',
    image: '/favicon.png',
    name: 'Claudia Voss',
    role: 'Agency Director, Beacon Co',
  },
  {
    text: 'The best-time posting intelligence is genuinely impressive. Our Friday posts now consistently outperform what we used to get on weekdays.',
    image: '/favicon.png',
    name: 'Rob Sullivan',
    role: 'Content Creator',
  },
  {
    text: 'Vielinks replaced Hootsuite, Buffer, and our Google Sheets tracker. We save over $200 per month and have better visibility across all platforms.',
    image: '/favicon.png',
    name: 'Nina Fischer',
    role: 'Startup Founder',
  },
];

const firstColumn  = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn  = testimonials.slice(6, 9);

export default function TestimonialsSection() {
  return (
    <section id="Testimonials" className="relative overflow-hidden py-28 md:py-36">
      {/* Ambient */}
      <div className="pointer-events-none absolute left-[8%] top-20 h-80 w-80 rounded-full bg-[#C8553A]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute right-[6%] bottom-10 h-72 w-72 rounded-full bg-[#A53F28]/[0.04] blur-[100px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-[#15140F]/[0.05] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#15140F]/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
            Workflow signals, not vanity claims
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-[#15140F] md:text-5xl max-w-2xl">
            What our users{' '}
            <span className="text-[#C8553A]">
              actually say.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-[1rem] font-light leading-[1.8] text-[#15140F]/50">
            Use these examples as the kind of operational clarity Vielinks is built to create for social media teams.
          </p>
        </motion.div>

        {/* Scrolling columns */}
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn}  duration={18} />
          <TestimonialsColumn testimonials={secondColumn} duration={23} className="hidden md:block" />
          <TestimonialsColumn testimonials={thirdColumn}  duration={20} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
