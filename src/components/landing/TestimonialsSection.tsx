
import { motion } from 'framer-motion';
import { TestimonialsColumn, type Testimonial } from '@/components/ui/testimonials-columns-1';

const testimonials: Testimonial[] = [
  {
    text: "We cut our weekly content planning from 8 hours to under 2. Vielinks gave us back time we didn't know we were losing.",
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    name: 'Sofia Reyes',
    role: 'Social Media Director, Wavefront',
  },
  {
    text: 'Our engagement rate went up 31% in the first month. Having everything in one place means we actually analyze data instead of just collecting it.',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Diego Ramírez',
    role: 'Content Manager, Luminary',
  },
  {
    text: 'Managing three brand accounts used to feel chaotic. Now I have everything visible at a glance and schedule a full month in one afternoon.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    name: 'Priya Kapoor',
    role: 'Brand Manager, Onyx Labs',
  },
  {
    text: 'The AI caption suggestions alone are worth the subscription. We now publish 40% more content with the exact same team.',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'James Thornton',
    role: 'Founder, Meridian Agency',
  },
  {
    text: "I tried four other tools. Vielinks is the only one my entire team actually uses without complaints on Monday morning.",
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: 'Ana Llorente',
    role: 'Head of Marketing, Stackline',
  },
  {
    text: 'From setup to our first scheduled post took 15 minutes. The clarity of the dashboard is something I did not know I needed until I had it.',
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    name: 'Marcus Bell',
    role: 'Social Media Manager, Northpeak',
  },
  {
    text: 'Our clients love the unified analytics report. We used to spend 3 hours every week exporting data from different platform dashboards.',
    image: 'https://randomuser.me/api/portraits/women/7.jpg',
    name: 'Claudia Voss',
    role: 'Agency Director, Beacon Co',
  },
  {
    text: 'The best-time posting intelligence is genuinely impressive. Our Friday posts now consistently outperform what we used to get on weekdays.',
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
    name: 'Rob Sullivan',
    role: 'Content Creator',
  },
  {
    text: 'Vielinks replaced Hootsuite, Buffer, and our Google Sheets tracker. We save over $200 per month and have better visibility across all platforms.',
    image: 'https://randomuser.me/api/portraits/women/9.jpg',
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
      <div className="pointer-events-none absolute left-[8%] top-20 h-80 w-80 rounded-full bg-[#d394ff]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute right-[6%] bottom-10 h-72 w-72 rounded-full bg-[#aa30fa]/[0.04] blur-[100px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/[0.07] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            Real results, real teams
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-white md:text-5xl max-w-2xl">
            What our users{' '}
            <span className="bg-gradient-to-r from-[#d394ff] via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              actually say.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-[1rem] font-light leading-[1.8] text-white/50">
            12,000+ social media teams already use Vielinks. Here is what they tell us after the first 30 days.
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
