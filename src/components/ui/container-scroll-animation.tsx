import React, { useRef } from "react";
import { useScroll, useTransform, motion, useReducedMotion, type MotionValue } from "framer-motion"; // motion used by Card

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldReduceMotion = useReducedMotion();
  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [20, 0]);
  const scale  = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : scaleDimensions());

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20 bg-[#F8FAFC]"
      ref={containerRef}
    >
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        <Header titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ titleComponent }: { titleComponent: React.ReactNode }) => (
  <div className="max-w-5xl mx-auto text-center mb-8">
    {titleComponent}
  </div>
);

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      willChange: "transform",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    }}
    className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#2A2825] p-2 md:p-5 bg-[#0F172A] rounded-[30px]"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#FFFFFF]">
      {children}
    </div>
  </motion.div>
);
